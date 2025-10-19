
-- ============================================
-- PARTE 1: SISTEMA DE ROLES SEGURO
-- ============================================

-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'coach', 'student');

-- Criar tabela de roles segura
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função security definer para verificar roles (previne recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Migrar roles existentes da tabela profiles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 
  CASE 
    WHEN role = 'coach' THEN 'coach'::app_role
    WHEN role = 'admin' THEN 'admin'::app_role
    ELSE 'student'::app_role
  END
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- PARTE 2: BANCO DE EXERCÍCIOS
-- ============================================

-- Criar tabela de exercícios
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  equipment TEXT[],
  video_path TEXT,
  thumbnail_path TEXT,
  muscle_groups TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca eficiente
CREATE INDEX idx_exercises_name ON public.exercises(name);
CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_exercises_level ON public.exercises(level);

-- Habilitar RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Políticas: todos podem visualizar, apenas coaches podem editar
CREATE POLICY "Everyone can view exercises"
ON public.exercises FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coaches can insert exercises"
ON public.exercises FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Coaches can update their exercises"
ON public.exercises FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Coaches can delete their exercises"
ON public.exercises FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON public.exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PARTE 3: STORAGE PARA VÍDEOS
-- ============================================

-- Criar bucket para vídeos de exercícios
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-videos', 'exercise-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage: todos podem visualizar, coaches podem fazer upload
CREATE POLICY "Public can view exercise videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'exercise-videos');

CREATE POLICY "Coaches can upload exercise videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'exercise-videos' AND
  (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Coaches can update exercise videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'exercise-videos' AND
  (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Coaches can delete exercise videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'exercise-videos' AND
  (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'))
);

-- ============================================
-- PARTE 4: TABELA DE AUDIT LOG
-- ============================================

CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  target_user_id UUID,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view audit logs"
ON public.audit_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- PARTE 5: RELACIONAR EXERCÍCIOS COM PLANOS
-- ============================================

-- Adicionar campo para armazenar IDs de exercícios no plano
-- O campo 'content' do plano já é JSONB, então podemos usar isso
-- Mas vamos criar uma tabela de relacionamento para melhor normalização

CREATE TABLE public.plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL, -- fallback se exercise_id for null
  sets INTEGER,
  reps TEXT,
  rest_seconds INTEGER,
  notes TEXT,
  day_of_week INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view exercises from their plans"
ON public.plan_exercises FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.plans
    WHERE plans.id = plan_exercises.plan_id
    AND plans.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can manage plan exercises"
ON public.plan_exercises FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin'));

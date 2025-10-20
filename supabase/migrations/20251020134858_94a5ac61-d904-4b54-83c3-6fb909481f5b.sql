-- ============================================
-- CORREÇÃO CRÍTICA DE SEGURANÇA: RLS policies
-- ============================================

-- 1. Corrigir policies de profiles para usar user_roles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Coaches can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Coaches can update all profiles"
ON public.profiles FOR UPDATE
USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 2. Corrigir policies de anamnese
DROP POLICY IF EXISTS "Coaches can view all anamnese" ON public.anamnese;

CREATE POLICY "Coaches can view all anamnese" 
ON public.anamnese FOR SELECT
USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 3. Corrigir policies de evaluations
DROP POLICY IF EXISTS "Coaches can view all evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Coaches can update all evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Coaches can insert evaluations for students" ON public.evaluations;

CREATE POLICY "Coaches can view all evaluations" 
ON public.evaluations FOR SELECT
USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Coaches can update all evaluations"
ON public.evaluations FOR UPDATE
USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Coaches can insert evaluations for students"
ON public.evaluations FOR INSERT
WITH CHECK (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 4. Corrigir policies de referrals
DROP POLICY IF EXISTS "Coaches can view all referrals" ON public.referrals;

CREATE POLICY "Coaches can view all referrals" 
ON public.referrals FOR SELECT
USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 5. Remover campo 'role' da tabela profiles (está duplicado e inseguro)
-- COMENTADO para não perder dados - executar manualmente após migrar roles
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 6. Garantir que coach inicial tem role na user_roles
-- Inserir role de admin para o email do coach principal
DO $$
DECLARE
  coach_user_id uuid;
BEGIN
  -- Buscar ID do usuário coach
  SELECT id INTO coach_user_id
  FROM auth.users
  WHERE email = 'ellymarmonteiro.personal@gmail.com'
  LIMIT 1;

  -- Se encontrou, garantir que tem roles admin e coach
  IF coach_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (coach_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (coach_user_id, 'coach'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
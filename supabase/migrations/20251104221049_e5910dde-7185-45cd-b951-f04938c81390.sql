-- Garantir que todas as tabelas necessárias existam com as colunas corretas

-- Adicionar colunas faltantes em profiles se não existirem
DO $$ 
BEGIN
  -- Adicionar role se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'aluno';
  END IF;
  
  -- Adicionar avatar_url se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Criar tabela de sessões de checkout se não existir
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela checkout_sessions
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para checkout_sessions
DROP POLICY IF EXISTS "Users can view their own checkout sessions" ON public.checkout_sessions;
CREATE POLICY "Users can view their own checkout sessions" 
  ON public.checkout_sessions FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert checkout sessions" ON public.checkout_sessions;
CREATE POLICY "System can insert checkout sessions" 
  ON public.checkout_sessions FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "System can update checkout sessions" ON public.checkout_sessions;
CREATE POLICY "System can update checkout sessions" 
  ON public.checkout_sessions FOR UPDATE 
  USING (true);

-- Criar tabela de eventos de webhook se não existir
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Políticas para webhook_events (apenas sistema pode acessar)
DROP POLICY IF EXISTS "System can manage webhook events" ON public.webhook_events;
CREATE POLICY "System can manage webhook events" 
  ON public.webhook_events FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- Garantir que a função de notificação para coach existe e funciona
CREATE OR REPLACE FUNCTION public.notify_coach_on_plan_creation()
RETURNS TRIGGER AS $$
DECLARE
  coach_ids UUID[];
  coach_id UUID;
  student_name TEXT;
BEGIN
  -- Buscar nome do aluno
  SELECT full_name INTO student_name FROM profiles WHERE id = NEW.user_id;
  
  -- Buscar todos os coaches
  SELECT ARRAY_AGG(user_id) INTO coach_ids
  FROM user_roles
  WHERE role = 'coach';
  
  -- Notificar cada coach
  IF coach_ids IS NOT NULL THEN
    FOREACH coach_id IN ARRAY coach_ids
    LOOP
      PERFORM create_notification(
        coach_id,
        '📋 Novo plano ' || NEW.type || ' aguardando aprovação de ' || COALESCE(student_name, 'Aluno'),
        'plan_pending'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recriar trigger para notificar coaches
DROP TRIGGER IF EXISTS trigger_notify_coach_new_plan ON plans;
CREATE TRIGGER trigger_notify_coach_new_plan
  AFTER INSERT ON plans
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION notify_coach_on_plan_creation();
-- Adicionar campos de Stripe e assinatura na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Atualizar tipos de enum se necessário
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('inactive', 'active', 'past_due', 'canceled', 'trialing');
  END IF;
END $$;

-- Atualizar coluna subscription_status para usar o enum correto
ALTER TABLE profiles 
ALTER COLUMN subscription_status TYPE subscription_status 
USING subscription_status::subscription_status;

-- Criar tabela de anamnese
CREATE TABLE IF NOT EXISTS public.anamnese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dados básicos
  birth_date DATE,
  gender TEXT,
  height NUMERIC(5,2),
  current_weight NUMERIC(5,2),
  target_weight NUMERIC(5,2),
  
  -- Medidas corporais (JSON para flexibilidade)
  measurements JSONB DEFAULT '{}',
  
  -- Histórico de treino
  is_active TEXT,
  training_duration TEXT,
  has_injuries TEXT,
  injuries TEXT,
  
  -- Saúde
  hypertension BOOLEAN DEFAULT false,
  diabetes BOOLEAN DEFAULT false,
  cardiovascular BOOLEAN DEFAULT false,
  kidney BOOLEAN DEFAULT false,
  medications TEXT,
  allergies TEXT,
  intolerances TEXT,
  
  -- Nutrição
  meals_per_day TEXT,
  diet_preference TEXT,
  water_intake NUMERIC,
  supplements TEXT,
  
  -- Estilo de vida
  profession TEXT,
  activity_level TEXT,
  sleep_hours NUMERIC,
  stress_level TEXT,
  
  -- Objetivos
  main_goal TEXT,
  target_timeline TEXT,
  motivation TEXT,
  availability TEXT,
  
  -- Consentimentos
  terms_accepted BOOLEAN DEFAULT false,
  photo_consent BOOLEAN DEFAULT false,
  notifications_consent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar anamnese por usuário
CREATE INDEX IF NOT EXISTS idx_anamnese_user_id ON anamnese(user_id);

-- RLS para anamnese
ALTER TABLE anamnese ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own anamnese"
ON anamnese FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anamnese"
ON anamnese FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anamnese"
ON anamnese FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view all anamnese"
ON anamnese FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'coach'
));

-- Atualizar trigger de updated_at para anamnese
CREATE TRIGGER update_anamnese_updated_at
BEFORE UPDATE ON anamnese
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Adicionar campos faltantes em evaluations se necessário
ALTER TABLE evaluations
ADD COLUMN IF NOT EXISTS neck_circumference NUMERIC,
ADD COLUMN IF NOT EXISTS calf_circumference NUMERIC,
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS heart_rate NUMERIC,
ADD COLUMN IF NOT EXISTS blood_pressure TEXT;

-- Criar tabela para armazenar configurações de notificação do usuário
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  enable_all BOOLEAN DEFAULT true,
  daily_motivation BOOLEAN DEFAULT true,
  daily_motivation_time TIME DEFAULT '08:00',
  workout_reminder BOOLEAN DEFAULT true,
  workout_reminder_minutes INTEGER DEFAULT 30,
  missed_workout BOOLEAN DEFAULT true,
  goal_celebration BOOLEAN DEFAULT true,
  monthly_weigh_in BOOLEAN DEFAULT true,
  silence_days INTEGER DEFAULT 0,
  
  device_tokens JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para notification_settings
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification settings"
ON notification_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings"
ON notification_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
ON notification_settings FOR UPDATE
USING (auth.uid() = user_id);

-- Adicionar schedule_at à tabela notifications se não existir
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS schedule_at TIMESTAMP WITH TIME ZONE;

-- Criar tabela para logs de notificações enviadas
CREATE TABLE IF NOT EXISTS public.notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_notification_log_user_sent ON notification_log(user_id, sent_at DESC);

-- RLS para notification_log
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification logs"
ON notification_log FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notification logs"
ON notification_log FOR INSERT
WITH CHECK (true);

-- Função para agendar notificações de lembrete de treino
CREATE OR REPLACE FUNCTION public.schedule_workout_reminder(
  p_user_id UUID,
  p_workout_time TIMESTAMP WITH TIME ZONE,
  p_reminder_minutes INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reminder_time TIMESTAMP WITH TIME ZONE;
  notification_id UUID;
BEGIN
  reminder_time := p_workout_time - (p_reminder_minutes || ' minutes')::INTERVAL;
  
  INSERT INTO notifications (user_id, message, type, schedule_at)
  VALUES (
    p_user_id,
    '⏰ Seu treino está agendado para daqui a ' || p_reminder_minutes || ' minutos! Se prepare!',
    'workout_reminder',
    reminder_time
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;
-- Criar usuário coach (deve ser feito manualmente no painel Auth)
-- Email: ellymarmonteiro.personal@gmail.com
-- Senha: jmmjjfje

-- Inserir role de coach para o usuário (após criação manual)
-- Este script será executado após o usuário ser criado no Auth

-- Garantir que a tabela exercises tenha video_url ao invés de video_path
-- (manter compatibilidade com ambos)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exercises' 
    AND column_name = 'video_url'
  ) THEN
    ALTER TABLE exercises ADD COLUMN video_url TEXT;
  END IF;
END $$;

-- Criar função para configurar coach após criação do usuário
CREATE OR REPLACE FUNCTION setup_coach_role(coach_email TEXT, coach_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir ou atualizar perfil
  INSERT INTO profiles (id, email, full_name, role, subscription_status)
  VALUES (
    coach_user_id,
    coach_email,
    'Ellymar Monteiro',
    'coach',
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'coach',
      email = coach_email,
      subscription_status = 'active';

  -- Adicionar roles de coach e admin
  INSERT INTO user_roles (user_id, role)
  VALUES 
    (coach_user_id, 'coach'),
    (coach_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Criar notificação para novos planos pendentes
CREATE OR REPLACE FUNCTION notify_coach_new_plan()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  coach_ids UUID[];
  coach_id UUID;
BEGIN
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
        '📋 Novo plano aguardando aprovação de ' || (SELECT full_name FROM profiles WHERE id = NEW.user_id),
        'plan_pending'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para notificar coaches sobre novos planos
DROP TRIGGER IF EXISTS trigger_notify_coach_new_plan ON plans;
CREATE TRIGGER trigger_notify_coach_new_plan
  AFTER INSERT ON plans
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION notify_coach_new_plan();

-- Criar função para atualizar video_path quando video_url é atualizado (compatibilidade)
CREATE OR REPLACE FUNCTION sync_video_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.video_url IS NOT NULL AND NEW.video_url != OLD.video_url THEN
    NEW.video_path := NEW.video_url;
  END IF;
  IF NEW.video_path IS NOT NULL AND NEW.video_path != OLD.video_path THEN
    NEW.video_url := NEW.video_path;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_video_fields_trigger ON exercises;
CREATE TRIGGER sync_video_fields_trigger
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION sync_video_fields();
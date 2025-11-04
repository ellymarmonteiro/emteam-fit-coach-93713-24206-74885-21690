-- Corrigir search_path em todas as funções existentes para segurança

-- Atualizar função has_role (já tem search_path, mas vamos garantir)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Atualizar função create_notification com search_path
CREATE OR REPLACE FUNCTION public.create_notification(p_user_id uuid, p_message text, p_type text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, message, type)
  VALUES (p_user_id, p_message, p_type)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Atualizar função generate_referral_code com search_path
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'EM' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Atualizar função set_referral_code com search_path
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

-- Atualizar função apply_referral_discount com search_path
CREATE OR REPLACE FUNCTION public.apply_referral_discount()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Aplicar desconto ao indicador
  UPDATE profiles 
  SET discount_remaining = GREATEST(discount_remaining, 0) + 2
  WHERE id = NEW.referred_by;
  
  -- Aplicar desconto ao indicado
  NEW.discount_remaining := 2;
  
  -- Criar registro de indicação
  INSERT INTO referrals (referrer_id, referred_id, discount_applied)
  VALUES (NEW.referred_by, NEW.id, true);
  
  -- Criar notificações
  PERFORM create_notification(
    NEW.referred_by,
    '🎉 Parabéns! Você indicou um amigo e ambos ganharam R$10 de desconto nas próximas 2 cobranças!',
    'referral'
  );
  
  PERFORM create_notification(
    NEW.id,
    '🎁 Bem-vindo! Você ganhou R$10 de desconto nas próximas 2 cobranças por indicação!',
    'referral'
  );
  
  RETURN NEW;
END;
$$;

-- Atualizar função schedule_workout_reminder com search_path
CREATE OR REPLACE FUNCTION public.schedule_workout_reminder(p_user_id uuid, p_workout_time timestamp with time zone, p_reminder_minutes integer)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Atualizar função handle_new_user com search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Atualizar função update_updated_at_column com search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
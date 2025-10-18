-- Corrigir search_path da função apply_referral_discount
CREATE OR REPLACE FUNCTION apply_referral_discount()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
-- Criar trigger para aplicar desconto de indicação
CREATE OR REPLACE TRIGGER apply_referral_discount_trigger
AFTER INSERT ON profiles
FOR EACH ROW
WHEN (NEW.referred_by IS NOT NULL)
EXECUTE FUNCTION apply_referral_discount();

-- Atualizar perfis existentes para adicionar códigos de indicação
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN 
    SELECT id FROM profiles WHERE referral_code IS NULL
  LOOP
    UPDATE profiles 
    SET referral_code = generate_referral_code() 
    WHERE id = profile_record.id;
  END LOOP;
END $$;
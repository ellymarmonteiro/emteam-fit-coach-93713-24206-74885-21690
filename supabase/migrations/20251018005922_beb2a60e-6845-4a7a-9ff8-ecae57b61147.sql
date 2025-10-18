-- Adicionar campos de indicação e descontos aos perfis
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS discount_remaining INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'coach', 'admin'));

-- Criar tabela de indicações
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  discount_applied BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  UNIQUE(referrer_id, referred_id)
);

-- Criar tabela de avaliações físicas
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  bmi DECIMAL(5,2),
  body_fat_percentage DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  hip_circumference DECIMAL(5,2),
  arm_circumference DECIMAL(5,2),
  leg_circumference DECIMAL(5,2),
  goal TEXT CHECK (goal IN ('weight_loss', 'muscle_gain', 'conditioning', 'maintenance')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Função para gerar código de indicação único
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger para gerar código de indicação automaticamente
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code_trigger
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_referral_code();

-- Atualizar códigos de indicação para perfis existentes
UPDATE profiles SET referral_code = generate_referral_code() WHERE referral_code IS NULL;

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies para referrals
CREATE POLICY "Users can view their own referrals"
ON referrals FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals"
ON referrals FOR INSERT
WITH CHECK (true);

CREATE POLICY "Coaches can view all referrals"
ON referrals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'coach'
  )
);

-- RLS Policies para evaluations
CREATE POLICY "Users can view their own evaluations"
ON evaluations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations"
ON evaluations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations"
ON evaluations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view all evaluations"
ON evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'coach'
  )
);

CREATE POLICY "Coaches can insert evaluations for students"
ON evaluations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'coach'
  )
);

CREATE POLICY "Coaches can update all evaluations"
ON evaluations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'coach'
  )
);

-- Trigger para atualizar updated_at em evaluations
CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função para aplicar desconto de indicação
CREATE OR REPLACE FUNCTION apply_referral_discount()
RETURNS TRIGGER AS $$
BEGIN
  -- Aplicar desconto ao indicador
  UPDATE profiles 
  SET discount_remaining = GREATEST(discount_remaining, 0) + 2
  WHERE id = (SELECT referred_by FROM profiles WHERE id = NEW.id)
  AND NEW.referred_by IS NOT NULL;
  
  -- Aplicar desconto ao indicado
  IF NEW.referred_by IS NOT NULL THEN
    NEW.discount_remaining := 2;
    
    -- Criar registro de indicação
    INSERT INTO referrals (referrer_id, referred_id, discount_applied)
    VALUES (NEW.referred_by, NEW.id, true);
    
    -- Criar notificação para o indicador
    PERFORM create_notification(
      NEW.referred_by,
      '🎉 Parabéns! Você indicou um amigo e ambos ganharam R$10 de desconto nas próximas 2 cobranças!',
      'referral'
    );
    
    -- Criar notificação para o indicado
    PERFORM create_notification(
      NEW.id,
      '🎁 Bem-vindo! Você ganhou R$10 de desconto nas próximas 2 cobranças por indicação!',
      'referral'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
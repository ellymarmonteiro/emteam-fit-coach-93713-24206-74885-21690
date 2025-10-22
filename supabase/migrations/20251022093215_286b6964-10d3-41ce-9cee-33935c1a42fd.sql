
-- ============================================
-- CORREÇÃO CRÍTICA: Adicionar role admin/coach ao usuário principal
-- ============================================

-- Garantir que ellymarmonteiro.personal@gmail.com tenha roles de admin e coach
-- (Email usado no sistema como coach principal)

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar ID do usuário pelo email (qualquer variante)
  SELECT id INTO v_user_id 
  FROM profiles 
  WHERE email ILIKE '%ellymarmonteiro%' 
  ORDER BY created_at ASC 
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Adicionar role de admin (se não existir)
    INSERT INTO user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Adicionar role de coach (se não existir)
    INSERT INTO user_roles (user_id, role)
    VALUES (v_user_id, 'coach')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Roles admin e coach adicionadas ao usuário: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário principal não encontrado';
  END IF;
END $$;

-- ============================================
-- GARANTIR que a role 'student' existe no enum
-- ============================================
-- Verificar se precisa adicionar (caso não exista)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'student' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'student';
    RAISE NOTICE 'Role student adicionada ao enum app_role';
  END IF;
END $$;

# Configuração do Usuário Coach

## PASSO 1: Criar o usuário no Supabase Auth

1. Acesse o Backend (Lovable Cloud)
2. Vá em Authentication > Users
3. Clique em "Add User" ou "Create new user"
4. Preencha:
   - **Email**: `ellymarmonteiro.personal@gmail.com`
   - **Password**: `jmmjjfje`
   - **Auto Confirm User**: ✅ (marcar)
   
5. Clique em "Create User"
6. **COPIE O USER ID** que foi gerado (algo como: `a1b2c3d4-...`)

## PASSO 2: Configurar as roles do coach

Após criar o usuário, execute o seguinte comando no SQL Editor do Supabase:

```sql
-- Substitua 'SEU_USER_ID_AQUI' pelo ID copiado no passo anterior
SELECT setup_coach_role('ellymarmonteiro.personal@gmail.com', 'SEU_USER_ID_AQUI'::uuid);
```

## PASSO 3: Verificar a configuração

Execute para verificar se está tudo certo:

```sql
-- Verificar perfil
SELECT id, email, full_name, role, subscription_status 
FROM profiles 
WHERE email = 'ellymarmonteiro.personal@gmail.com';

-- Verificar roles
SELECT role 
FROM user_roles 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'ellymarmonteiro.personal@gmail.com');
```

Deve retornar:
- Perfil com role = 'coach'
- Duas roles: 'coach' e 'admin'

## Pronto!

Agora você pode fazer login com:
- **Email**: ellymarmonteiro.personal@gmail.com
- **Senha**: jmmjjfje

E terá acesso ao dashboard do coach em `/coach/dashboard`

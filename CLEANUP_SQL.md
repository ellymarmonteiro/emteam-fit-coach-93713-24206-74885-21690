# SQL para Limpeza de Dados de Teste

⚠️ **ATENÇÃO: NÃO EXECUTE ESTE SQL SEM CONFIRMAÇÃO EXPLÍCITA!**

Este arquivo contém os comandos SQL para remover dados de teste do banco de dados.
Só execute após confirmar que são dados de teste e após fazer BACKUP completo.

## 1. Backup Primeiro (OBRIGATÓRIO)

Antes de executar qualquer comando de exclusão, faça backup das tabelas:

```sql
-- Exportar dados para backup (faça isso via interface do Supabase)
-- Dashboard > Database > Backups
```

## 2. Verificar Dados de Teste

Primeiro, verifique quantos registros serão afetados:

```sql
-- Contar usuários de teste
SELECT count(*) as total_test_users 
FROM profiles 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%exemplo%'
   OR email LIKE '%+test%';

-- Listar usuários de teste para revisão
SELECT id, email, full_name, created_at 
FROM profiles 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%exemplo%'
   OR email LIKE '%+test%'
ORDER BY created_at DESC;
```

## 3. SQL de Limpeza (EXECUTAR APENAS COM CONFIRMAÇÃO)

⚠️ **PEDIR CONFIRMAÇÃO ANTES DE EXECUTAR!**

```sql
-- Deletar planos dos usuários de teste
DELETE FROM plans 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar exercícios dos planos
DELETE FROM plan_exercises 
WHERE plan_id IN (
  SELECT id FROM plans 
  WHERE user_id IN (
    SELECT id FROM profiles 
    WHERE email LIKE '%test%' 
       OR email LIKE '%demo%' 
       OR email LIKE '%exemplo%'
       OR email LIKE '%+test%'
  )
);

-- Deletar avaliações
DELETE FROM evaluations 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar anamneses
DELETE FROM anamnese 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar notificações
DELETE FROM notifications 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar log de notificações
DELETE FROM notification_log 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar configurações de notificações
DELETE FROM notification_settings 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar referências (indicações)
DELETE FROM referrals 
WHERE referrer_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
)
OR referred_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar roles de usuários
DELETE FROM user_roles 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email LIKE '%test%' 
     OR email LIKE '%demo%' 
     OR email LIKE '%exemplo%'
     OR email LIKE '%+test%'
);

-- Deletar perfis
DELETE FROM profiles 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%exemplo%'
   OR email LIKE '%+test%';
```

## 4. Deletar Usuários do Auth (Via API)

Os usuários também precisam ser deletados do Supabase Auth. 
Isso deve ser feito via edge function ou interface do Supabase:

**Opção 1: Via Interface do Supabase**
- Dashboard > Authentication > Users
- Procurar por usuários de teste manualmente
- Deletar um por um

**Opção 2: Via Edge Function** (Recomendado para múltiplos usuários)
Criar uma edge function temporária que lista e deleta usuários de teste:

```typescript
// Exemplo de edge function para limpeza
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Buscar e deletar usuários de teste
const { data: profiles } = await supabaseAdmin
  .from('profiles')
  .select('id, email')
  .or('email.like.%test%,email.like.%demo%')

for (const profile of profiles || []) {
  await supabaseAdmin.auth.admin.deleteUser(profile.id)
  console.log(`Deleted user: ${profile.email}`)
}
```

## 5. Verificação Pós-Limpeza

Após executar, verificar se a limpeza foi bem-sucedida:

```sql
-- Verificar se ainda existem usuários de teste
SELECT count(*) as remaining_test_users 
FROM profiles 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%exemplo%'
   OR email LIKE '%+test%';

-- Deve retornar 0
```

## 6. Notas Importantes

1. **SEMPRE FAÇA BACKUP ANTES**
2. **REVISE OS EMAILS** que serão deletados antes de executar
3. **NÃO EXECUTE** em produção sem aprovação
4. **PRESERVE** usuários reais como `ellymarmonteiro.personal@gmail.com`
5. **DOCUMENTE** a operação de limpeza no audit_log

## 7. Alternativa Segura: Usar WHERE IN com IDs Específicos

Para maior segurança, ao invés de usar LIKE patterns, liste os IDs específicos:

```sql
-- Exemplo com IDs específicos (substitua pelos IDs reais)
DELETE FROM profiles WHERE id IN (
  'uuid-1',
  'uuid-2',
  'uuid-3'
);
```

---

**IMPORTANTE:** Este arquivo é apenas documentação. 
NÃO execute estes comandos sem:
1. Fazer backup completo
2. Confirmar que são dados de teste
3. Obter aprovação explícita do responsável pelo projeto

# SQL para Limpeza de Dados de Teste

⚠️ **ATENÇÃO CRÍTICA: NÃO EXECUTE ESTE SQL SEM CONFIRMAÇÃO EXPLÍCITA!**

Este arquivo contém os comandos SQL para remover dados de teste do banco de dados.
**Só execute após confirmar que são dados de teste e após fazer BACKUP completo.**

---

## 📋 PROCEDIMENTO OBRIGATÓRIO

### 1. Backup Primeiro (OBRIGATÓRIO - NÃO PULE!)

```bash
# Via Lovable Cloud Backend:
1. Abra o backend: <lov-open-backend>
2. Vá para Database > Backups
3. Clique "Create backup now"
4. Aguarde conclusão (pode levar alguns minutos)
5. Anote data/hora do backup: ______________
```

---

### 2. Verificar Dados de Teste (REVISÃO MANUAL)

Execute estas queries para LISTAR e REVISAR o que será deletado:

```sql
-- ==========================================
-- PASSO 2A: Contar usuários de teste
-- ==========================================
SELECT 
  count(*) as total_test_users,
  count(*) FILTER (WHERE email ILIKE '%test%') as test_emails,
  count(*) FILTER (WHERE email ILIKE '%demo%') as demo_emails,
  count(*) FILTER (WHERE email ILIKE '%exemplo%') as exemplo_emails
FROM profiles 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%demo%' 
   OR email ILIKE '%exemplo%'
   OR email ILIKE '%+test%';

-- RESULTADO ESPERADO: Mostrar quantos usuários serão afetados
-- ✅ Anote o número: ______________


-- ==========================================
-- PASSO 2B: Listar usuários de teste para REVISÃO
-- ==========================================
SELECT 
  id, 
  email, 
  full_name, 
  created_at,
  subscription_status
FROM profiles 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%demo%' 
   OR email ILIKE '%exemplo%'
   OR email ILIKE '%+test%'
ORDER BY created_at DESC
LIMIT 100;

-- ⚠️ CRÍTICO: Revise LINHA POR LINHA esta lista!
-- ⚠️ Se encontrar QUALQUER usuário real, NÃO PROSSIGA!
-- ⚠️ Usuário REAL exemplo: ellymarmonteiro.personal@gmail.com


-- ==========================================
-- PASSO 2C: Contar registros relacionados
-- ==========================================
SELECT 
  (SELECT count(*) FROM plans WHERE user_id IN (
    SELECT id FROM profiles WHERE email ILIKE '%test%' OR email ILIKE '%demo%'
  )) as planos,
  (SELECT count(*) FROM evaluations WHERE user_id IN (
    SELECT id FROM profiles WHERE email ILIKE '%test%' OR email ILIKE '%demo%'
  )) as avaliacoes,
  (SELECT count(*) FROM anamnese WHERE user_id IN (
    SELECT id FROM profiles WHERE email ILIKE '%test%' OR email ILIKE '%demo%'
  )) as anamneses,
  (SELECT count(*) FROM notifications WHERE user_id IN (
    SELECT id FROM profiles WHERE email ILIKE '%test%' OR email ILIKE '%demo%'
  )) as notificacoes;

-- ✅ Anote os números:
-- Planos: ______  Avaliações: ______  Anamneses: ______  Notificações: ______
```

---

### 3. SQL de Limpeza (EXECUTAR APENAS APÓS CONFIRMAÇÃO)

⚠️ **ÚLTIMA CHANCE: Você fez backup? Revisou a lista acima?**

Se SIM para ambos, execute o bloco abaixo **UMA ÚNICA VEZ**:

```sql
-- ==========================================
-- INÍCIO DA LIMPEZA - EXECUTAR TODO O BLOCO
-- ==========================================

BEGIN;  -- Inicia transação (permite rollback em caso de erro)

-- Criar lista temporária de IDs a deletar (mais seguro)
CREATE TEMP TABLE IF NOT EXISTS temp_test_user_ids AS
SELECT id 
FROM profiles 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%demo%' 
   OR email ILIKE '%exemplo%'
   OR email ILIKE '%+test%';

-- Log inicial
DO $$
DECLARE
  user_count int;
BEGIN
  SELECT count(*) INTO user_count FROM temp_test_user_ids;
  RAISE NOTICE 'Total de usuários a deletar: %', user_count;
END $$;


-- 1. Deletar exercícios dos planos (junction table)
DELETE FROM plan_exercises 
WHERE plan_id IN (
  SELECT id FROM plans WHERE user_id IN (SELECT id FROM temp_test_user_ids)
);

-- 2. Deletar planos
DELETE FROM plans 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 3. Deletar avaliações
DELETE FROM evaluations 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 4. Deletar anamneses
DELETE FROM anamnese 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 5. Deletar notificações
DELETE FROM notifications 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 6. Deletar log de notificações
DELETE FROM notification_log 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 7. Deletar configurações de notificações
DELETE FROM notification_settings 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 8. Deletar referências (indicações) - tanto como indicador quanto indicado
DELETE FROM referrals 
WHERE referrer_id IN (SELECT id FROM temp_test_user_ids)
   OR referred_id IN (SELECT id FROM temp_test_user_ids);

-- 9. Deletar roles
DELETE FROM user_roles 
WHERE user_id IN (SELECT id FROM temp_test_user_ids);

-- 10. Deletar perfis
DELETE FROM profiles 
WHERE id IN (SELECT id FROM temp_test_user_ids);

-- Limpar tabela temporária
DROP TABLE temp_test_user_ids;

-- Log final
RAISE NOTICE 'Limpeza concluída no banco de dados Supabase';
RAISE NOTICE 'ATENÇÃO: Auth users ainda precisam ser deletados via Admin API!';

COMMIT;  -- Confirma todas as mudanças

-- ==========================================
-- FIM DA LIMPEZA
-- ==========================================
```

**⚠️ Se algo der errado durante execução, digite:**
```sql
ROLLBACK;  -- Desfaz TODAS as mudanças
```

---

### 4. Deletar Usuários do Supabase Auth (CRÍTICO)

O SQL acima remove dados do banco, mas os usuários ainda existem no **Supabase Auth**.
Você PRECISA deletá-los também.

#### Opção A: Via Lovable Cloud Backend (Manual - Recomendado para poucos usuários)

```bash
1. Abra <lov-open-backend>
2. Vá para Authentication > Users
3. Busque por emails com "test", "demo", "exemplo"
4. Para cada usuário de teste:
   - Clique nos três pontos (...)
   - Selecione "Delete user"
   - Confirme
```

#### Opção B: Via Edge Function (Recomendado para muitos usuários)

Criar uma edge function temporária que usa a Admin API:

```typescript
// supabase/functions/cleanup-auth-test-users/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar usuários de teste do Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;

    const testUsers = users?.filter(u => 
      u.email?.includes('test') || 
      u.email?.includes('demo') ||
      u.email?.includes('exemplo')
    ) || [];

    console.log(`Found ${testUsers.length} test users to delete`);

    let deleted = 0;
    for (const user of testUsers) {
      console.log(`Deleting user: ${user.email} (${user.id})`);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        console.error(`Failed to delete ${user.email}:`, deleteError);
      } else {
        deleted++;
        console.log(`✓ Deleted: ${user.email}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        found: testUsers.length,
        deleted: deleted,
        users: testUsers.map(u => ({ email: u.email, id: u.id }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
```

**Para executar:**
```bash
# 1. Criar a função (código acima)
# 2. Deploy automático no Lovable
# 3. Chamar via curl:

curl -X POST \
  https://mhapxuzokpjwrnlaxofj.supabase.co/functions/v1/cleanup-auth-test-users \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

# 4. DELETAR a função após uso (não deixar em produção!)
```

---

### 5. Verificação Pós-Limpeza

Execute para confirmar sucesso:

```sql
-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================

-- Deve retornar 0 em todas as linhas
SELECT 
  'profiles' as tabela,
  count(*) as remaining_test_users 
FROM profiles 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%demo%' 
   OR email ILIKE '%exemplo%'
   OR email ILIKE '%+test%'

UNION ALL

SELECT 
  'plans' as tabela,
  count(*) as remaining_test_plans
FROM plans 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email ILIKE '%test%' OR email ILIKE '%demo%'
)

UNION ALL

SELECT 
  'evaluations' as tabela,
  count(*) as remaining_test_evals
FROM evaluations 
WHERE user_id IN (
  SELECT id FROM profiles 
  WHERE email ILIKE '%test%' OR email ILIKE '%demo%'
);

-- ✅ SUCESSO: Todas as linhas retornam 0
-- ❌ PROBLEMA: Se alguma linha retornar > 0, revisar
```

---

## 📊 Log de Execução (Preencha)

```
Data de execução: ______________
Horário: ______________
Executado por: ______________

BACKUP:
✅ Backup criado em: ______________
✅ Backup verificado: [ ] SIM  [ ] NÃO

REVISÃO:
✅ Lista de usuários revisada: [ ] SIM  [ ] NÃO
✅ Nenhum usuário real na lista: [ ] SIM  [ ] NÃO

EXECUÇÃO:
✅ SQL de limpeza executado: [ ] SIM  [ ] NÃO
✅ Auth users deletados: [ ] SIM  [ ] NÃO
✅ Verificação pós-limpeza: [ ] PASSOU  [ ] FALHOU

RESULTADOS:
- Usuários deletados: ______
- Planos deletados: ______
- Avaliações deletadas: ______
- Anamneses deletadas: ______

PROBLEMAS ENCONTRADOS:
[Descreva qualquer problema aqui]


CONFIRMAÇÃO FINAL:
✅ Sistema voltou ao estado limpo
✅ Apenas dados reais permanecem
✅ Coach principal intacto (ellymarmonteiro.personal@gmail.com)

Assinatura: _______________
```

---

## ⚠️ NOTAS IMPORTANTES

1. **SEMPRE FAÇA BACKUP ANTES** - Sem exceções!
2. **REVISE A LISTA** - Confirme que são dados de teste
3. **PRESERVE USUÁRIOS REAIS** - Especialmente `ellymarmonteiro.personal@gmail.com`
4. **USE TRANSAÇÕES** - O BEGIN/COMMIT permite rollback
5. **DELETE AUTH USERS** - Não esqueça de deletar do Supabase Auth também
6. **DOCUMENTE TUDO** - Preencha o log de execução acima

---

## 🆘 Em Caso de Erro

Se algo der errado:

1. **Se durante execução SQL:**
   ```sql
   ROLLBACK;  -- Desfaz tudo
   ```

2. **Se já commitou:**
   - Restaure o backup criado no Passo 1
   - Via Lovable Cloud > Database > Backups > Restore

3. **Se deletou usuários errados:**
   - Não há como recuperar Auth users deletados
   - Usuários terão que se cadastrar novamente
   - **POR ISSO O BACKUP É OBRIGATÓRIO**

---

## 🔒 Alternativa Segura: Usar IDs Específicos

Para máxima segurança, ao invés de usar patterns ILIKE, liste os IDs explícitos:

```sql
-- Exemplo com IDs específicos (substitua pelos IDs reais)
DELETE FROM profiles WHERE id IN (
  'uuid-do-usuario-teste-1',
  'uuid-do-usuario-teste-2',
  'uuid-do-usuario-teste-3'
);
```

Isso elimina chance de deletar dados errados por acidente.

---

**LEMBRE-SE: Este arquivo é apenas documentação. NÃO execute estes comandos sem:**
1. ✅ Fazer backup completo
2. ✅ Confirmar que são dados de teste
3. ✅ Obter aprovação explícita do responsável pelo projeto
4. ✅ Ler TODO este documento

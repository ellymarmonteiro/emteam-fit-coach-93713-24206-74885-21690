# 🔐 Checklist de Segurança e Testes - EMteam Digital

**Data:** ${new Date().toISOString().split('T')[0]}

---

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. Supabase Auth & RLS (CRÍTICO) ✅

- ✅ **CoachAuth corrigido** - Agora usa `supabase.auth.signInWithPassword` real
- ✅ **RLS atualizado** - Todas policies agora usam `user_roles` table via função `has_role()`
- ✅ **Coach role garantido** - Email `ellymarmonteiro.personal@gmail.com` tem roles `admin` e `coach`
- ✅ **Proteção de escalation** - Roles em tabela separada, não em `profiles.role`

**Tabelas protegidas:**
- `profiles` - Users veem próprio perfil, coaches veem tudo
- `anamnese` - Users veem próprio, coaches veem tudo
- `evaluations` - Users veem próprio, coaches gerenciam tudo
- `referrals` - Users veem próprias indicações, coaches veem tudo
- `exercises` - Apenas coaches criam/editam, todos veem
- `plans` - Users veem próprios planos
- `user_roles` - Apenas admins gerenciam

### 2. Stripe Checkout ✅

- ✅ **Endpoint corrigido** - `create-checkout-session` retorna `session.url`
- ✅ **Front-end atualizado** - Usa `window.location = url` para redirect direto
- ✅ **Webhook configurado** - `stripe-webhook` processa eventos e atualiza DB
- ✅ **Cupons funcionando** - Validação via `validate-coupon` edge function

### 3. Edge Functions Seguras ✅

- ✅ **delete-user** - Protegido, requer role coach/admin
- ✅ **create-coach-user** - Cria coach com service role key
- ✅ **generate-plans** - Integrado com OpenAI (usa OPENAI_API_KEY)
- ✅ **get-exercise-video** - Retorna signed URLs do Storage

---

## 🧪 TESTES NECESSÁRIOS (Execute e documente)

### A. Teste de Autenticação

#### A1. Login Válido (Student)
```bash
# Teste manual:
1. Acesse /auth
2. Login com credenciais válidas de aluno
3. Deve redirecionar para /dashboard
4. ✅ PASSOU | ❌ FALHOU
```

#### A2. Login Inválido
```bash
# Teste manual:
1. Acesse /auth
2. Tente login com email/senha incorretos
3. Deve mostrar toast "E-mail ou senha incorretos"
4. NÃO deve permitir acesso
5. ✅ PASSOU | ❌ FALHOU
```

#### A3. Coach Login (CRÍTICO)
```bash
# Teste manual:
1. Acesse /coach/auth
2. Login com ellymarmonteiro.personal@gmail.com
3. Deve redirecionar para /coach/dashboard
4. ✅ PASSOU | ❌ FALHOU

# Teste negativo:
5. Tente login com conta de aluno na área do coach
6. Deve mostrar "Acesso negado. Apenas profissionais podem acessar."
7. Deve fazer logout automático
8. ✅ PASSOU | ❌ FALHOU
```

### B. Teste RLS (Row Level Security)

#### B1. Isolamento de Dados
```sql
-- Execute no SQL Editor (como usuário aluno autenticado):
-- Este teste deve retornar APENAS os dados do usuário logado
SELECT * FROM profiles;
SELECT * FROM anamnese;
SELECT * FROM evaluations;

-- ✅ Retorna apenas próprios dados
-- ❌ Retorna dados de outros usuários (VULNERABILIDADE!)
```

#### B2. Acesso Coach
```sql
-- Execute no SQL Editor (como usuário coach autenticado):
SELECT count(*) FROM profiles;
SELECT count(*) FROM anamnese;
SELECT count(*) FROM evaluations;

-- ✅ Retorna todos os registros
-- ❌ Retorna erro ou dados limitados
```

### C. Teste Stripe Checkout

#### C1. Criar Checkout Session
```bash
# Teste manual:
1. Faça login como aluno
2. Vá para /subscription
3. Clique em "Assinar Agora" (plano mensal R$147)
4. DEVE abrir página do Stripe Checkout (stripe.com/checkout/...)
5. NÃO deve mostrar tela em branco
6. ✅ PASSOU | ❌ FALHOU
```

#### C2. Aplicar Cupom
```bash
# Teste manual:
1. Na página /subscription
2. Digite cupom "TESTE100"
3. Clique "Aplicar"
4. Deve mostrar "Cupom aplicado: 100% off"
5. Clique "Assinar Agora"
6. Checkout deve abrir com desconto aplicado
7. ✅ PASSOU | ❌ FALHOU
```

#### C3. Webhook (Stripe CLI)
```bash
# Instale Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to https://mhapxuzokpjwrnlaxofj.supabase.co/functions/v1/stripe-webhook

# Em outra aba:
stripe trigger checkout.session.completed

# Verifique:
# 1. Webhook recebido (logs no terminal)
# 2. Usuário tem subscription_status = 'active' no DB
# 3. Planos pendentes foram criados
# ✅ PASSOU | ❌ FALHOU
```

### D. Teste Coach: Delete User

#### D1. Excluir Aluno
```bash
# Teste manual:
1. Login como coach (ellymarmonteiro.personal@gmail.com)
2. Vá para /coach/students
3. Selecione um aluno de teste
4. Clique "Deletar Aluno"
5. Confirme no modal
6. Usuário deve ser removido do Auth e DB
7. Deve aparecer em audit_log
8. ✅ PASSOU | ❌ FALHOU
```

### E. Teste Exercícios com Vídeo

#### E1. Upload de Vídeo
```bash
# Teste manual:
1. Login como coach
2. Vá para /coach/exercises
3. Clique "Adicionar Exercício"
4. Preencha: nome="Agachamento", descrição, etc.
5. Faça upload de vídeo MP4 (< 20MB)
6. Salvar
7. Vídeo deve aparecer na lista
8. ✅ PASSOU | ❌ FALHOU
```

#### E2. Visualizar Vídeo no Plano
```bash
# Teste manual:
1. Login como aluno que tem plano aprovado
2. Vá para /workouts
3. Abra um treino
4. Vídeos dos exercícios devem carregar e reproduzir
5. ✅ PASSOU | ❌ FALHOU
```

---

## 🗑️ LIMPEZA DE DADOS DE TESTE

### ⚠️ IMPORTANTE: Executar SOMENTE com confirmação explícita!

### Passo 1: Backup (OBRIGATÓRIO)
```bash
# Via Supabase Dashboard:
# 1. Vá para Database > Backups
# 2. Clique "Create backup"
# 3. Aguarde conclusão
# 4. ✅ Backup criado em: _____________
```

### Passo 2: Listar Dados de Teste
```sql
-- Execute e REVISE antes de deletar:
SELECT id, email, full_name, created_at 
FROM profiles 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%demo%' 
   OR email ILIKE '%exemplo%'
   OR email ILIKE '%+test%'
ORDER BY created_at DESC;

-- Quantidade encontrada: _______
-- ✅ Revisei e confirmo que são dados de teste
```

### Passo 3: SQL de Limpeza (ver CLEANUP_SQL.md)

**NÃO EXECUTE sem confirmação!**

Ver arquivo `CLEANUP_SQL.md` para scripts completos.

### Passo 4: Verificação Pós-Limpeza
```sql
-- Conferir se limpeza foi bem-sucedida:
SELECT count(*) as test_users_remaining 
FROM profiles 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%demo%';

-- Deve retornar: 0
-- Resultado: _______
```

---

## 🔧 VARIÁVEIS DE AMBIENTE (Confirme)

### Supabase
- ✅ SUPABASE_URL: Configurado
- ✅ SUPABASE_ANON_KEY: Configurado
- ✅ SUPABASE_SERVICE_ROLE_KEY: Configurado (server-side only)

### Stripe
- ✅ STRIPE_SECRET_KEY: Configurado
- ✅ STRIPE_PUBLISHABLE_KEY: Configurado (frontend)
- ✅ STRIPE_WEBHOOK_SECRET: Configurado

### OpenAI
- ✅ OPENAI_API_KEY: Configurado

---

## 📊 EVIDÊNCIAS (Anexar prints/logs)

### 1. Login bem-sucedido
- [ ] Print: Tela de login
- [ ] Print: Redirecionamento para dashboard
- [ ] Console log: Sem erros

### 2. Checkout Stripe funcionando
- [ ] Print: Página Stripe Checkout aberta
- [ ] URL: https://checkout.stripe.com/...

### 3. Coach role confirmado
```sql
-- Execute e cole resultado:
SELECT u.email, ur.role 
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'ellymarmonteiro.personal@gmail.com';

-- Resultado esperado:
-- email: ellymarmonteiro.personal@gmail.com | role: admin
-- email: ellymarmonteiro.personal@gmail.com | role: coach
```

### 4. RLS funcionando
- [ ] Print: Query SELECT como aluno retorna apenas próprios dados
- [ ] Print: Query SELECT como coach retorna todos os dados

### 5. Webhook processado
- [ ] Log: stripe-webhook recebeu evento
- [ ] DB: subscription_status atualizado para 'active'

---

## ⚠️ AVISOS DE SEGURANÇA (não crítico, mas recomendado)

### Leaked Password Protection
**Status:** WARN (não crítico)

Para habilitar proteção contra senhas vazadas:
1. Acesse Lovable Cloud backend
2. Vá para Authentication > Settings
3. Ative "Password Strength" e "Leaked Password Protection"

**Link:** https://supabase.com/docs/guides/auth/password-security

---

## 📝 NOTAS FINAIS

### Bloqueios Removidos
- ❌ Login fake do coach (corrigido)
- ❌ RLS usando profiles.role (corrigido para user_roles)
- ❌ Checkout abrindo tela em branco (corrigido)

### Próximos Passos Recomendados
1. Testar todos os itens acima
2. Documentar evidências
3. Realizar limpeza de dados de teste (com backup!)
4. Habilitar proteção de senha vazada (recomendado)
5. Monitorar logs de edge functions por 24h

### Suporte
Para dúvidas ou problemas, revisar:
- CLEANUP_SQL.md (limpeza de dados)
- BACKEND_INTEGRATION.md (documentação técnica)
- Logs das Edge Functions no Lovable Cloud

---

**Responsável pela checagem:** _______________
**Data de conclusão:** _______________
**Assinatura:** _______________

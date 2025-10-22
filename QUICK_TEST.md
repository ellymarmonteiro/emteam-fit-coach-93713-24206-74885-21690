# 🚀 TESTE RÁPIDO - 5 Minutos

Execute estes testes agora para validar as correções:

---

## ✅ TESTE 1: Login Coach (30 segundos)

```bash
1. Abrir: /coach/auth
2. Email: ellymarmonteiro@icloud.com
3. Senha: jmmjjfje
4. Clicar "Entrar"
```

**Resultado Esperado:**
- ✅ Redirect para /coach/dashboard
- ✅ Painel de coach visível
- ✅ Sem erro de "Acesso negado"

**Status:** [ ] OK  [ ] FALHOU

---

## ✅ TESTE 2: Verificar Roles no Banco (1 minuto)

Execute via SQL Editor do Lovable Cloud:

```sql
SELECT p.email, p.full_name, ur.role 
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE p.email ILIKE '%ellymarmonteiro%';
```

**Resultado Esperado:**
```
email                          | full_name        | role
ellymarmonteiro@icloud.com    | Ellymar Monteiro | admin
ellymarmonteiro@icloud.com    | Ellymar Monteiro | coach
```

**Status:** [ ] OK  [ ] FALHOU

---

## ✅ TESTE 3: Tentar Checkout (2 minutos)

⚠️ **Pré-requisito:** Configurar `VITE_STRIPE_PRICE_ID` com um price ID real do Stripe

```bash
1. Login como aluno qualquer
2. Ir para: /subscription
3. Clicar "Assinar Agora"
4. Observar console do navegador
```

**Resultado Esperado:**
- ✅ Console log: "🚀 Criando checkout session..."
- ✅ Console log: "✅ Checkout session criada com sucesso!"
- ✅ Console log: "Redirecionando para checkout: https://checkout.stripe..."
- ✅ Página Stripe abre

**Se der erro:**
- Verificar logs da edge function em: Lovable Cloud > Functions > create-checkout-session

**Status:** [ ] OK  [ ] FALHOU  [ ] PRICE_ID não configurado

---

## ✅ TESTE 4: Verificar RLS (1 minuto)

Execute via SQL Editor (logado como aluno):

```sql
-- Deve retornar apenas seu próprio perfil
SELECT * FROM profiles;
```

**Resultado Esperado:**
- ✅ Retorna apenas 1 linha (seu perfil)
- ✅ Não retorna outros usuários

**Status:** [ ] OK  [ ] FALHOU

---

## ✅ TESTE 5: Logs de Edge Function (30 segundos)

```bash
1. Abrir: Lovable Cloud Backend
2. Ir para: Functions > create-checkout-session
3. Ver: Logs recentes
```

**Verificar:**
- ✅ Logs com emojis: 🚀 ✅ 📋
- ✅ Detalhes de cada etapa
- ✅ Sem mensagens de erro (❌)

**Status:** [ ] OK  [ ] FALHOU

---

## 📊 RESULTADO FINAL

```
Total de Testes: 5
Passou: ___ / 5
Falhou: ___ / 5

Status: [ ] Todos OK  [ ] Alguns falharam  [ ] Não testado
```

---

## 🆘 SE ALGO FALHAR

### Teste 1 Falhou (Login Coach):
- Verificar se migration foi aplicada
- Rodar query do Teste 2 para confirmar roles
- Limpar cache do navegador

### Teste 3 Falhou (Checkout):
- Configurar VITE_STRIPE_PRICE_ID corretamente
- Verificar STRIPE_SECRET_KEY nos secrets
- Ver logs da edge function

### Teste 4 Falhou (RLS):
- Policies podem não estar ativas
- Verificar com admin user

---

**Após executar:** Preencher status de cada teste e reportar resultados.

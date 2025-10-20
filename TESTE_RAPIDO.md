# 🚀 Teste Rápido - 5 Minutos

Execute estes testes para confirmar que tudo está funcionando:

## 1️⃣ Teste Checkout Stripe (CRÍTICO)

```bash
1. Abra: /subscription
2. Clique "Assinar Agora"
3. ✅ DEVE: Abrir página Stripe (checkout.stripe.com/...)
4. ❌ NÃO DEVE: Mostrar tela em branco
```

**Se falhar:** Verifique console do navegador e cole erro aqui.

---

## 2️⃣ Teste Coach Login (CRÍTICO)

```bash
1. Abra: /coach/auth
2. Login: ellymarmonteiro.personal@gmail.com
3. Senha: [sua senha]
4. ✅ DEVE: Redirecionar para /coach/dashboard
5. ❌ NÃO DEVE: Permitir login sem validação
```

**Teste negativo:**
```bash
6. Tente login com email de aluno na área /coach/auth
7. ✅ DEVE: Mostrar "Acesso negado" e fazer logout
```

---

## 3️⃣ Teste RLS (Verificação rápida)

```sql
-- Execute no SQL Editor:
SELECT count(*) FROM user_roles 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'ellymarmonteiro.personal@gmail.com'
);

-- ✅ Deve retornar: 2 (roles: admin + coach)
-- ❌ Se retornar 0: Roles não foram criadas!
```

---

## 4️⃣ Teste Auth Normal

```bash
1. Crie nova conta: /signup
2. Preencha dados e cadastre
3. Faça login: /auth
4. ✅ DEVE: Redirecionar para /dashboard
5. ✅ DEVE: Ver banner de onboarding
```

---

## 5️⃣ Verificar Edge Functions

```bash
# Via terminal:
curl https://mhapxuzokpjwrnlaxofj.supabase.co/functions/v1/create-checkout-session

# ✅ Deve retornar: {"error":"..."} (esperado, sem auth)
# ❌ Não deve retornar: 404 ou timeout
```

---

## ✅ Checklist Final

- [ ] Stripe Checkout abre corretamente
- [ ] Coach consegue fazer login
- [ ] Aluno NÃO consegue acessar área do coach
- [ ] RLS está protegendo dados (2 roles para coach)
- [ ] Signup/login de aluno funciona
- [ ] Edge functions respondem

**Se todos ✅:** Sistema está funcional e seguro!

**Se algum ❌:** Reveja o erro e consulte SECURITY_CHECKLIST.md

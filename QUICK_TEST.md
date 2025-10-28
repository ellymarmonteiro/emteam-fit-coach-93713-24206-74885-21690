# Teste Rápido do EMteam Digital

## ✅ O que foi implementado

### 1. Design System Completo
- ✅ Cores EMteam: Laranja (#FF6B00), Preto, Cinza
- ✅ Tema escuro como padrão
- ✅ Design responsivo e moderno

### 2. Integração com IA (Lovable AI)
- ✅ Lovable AI habilitado (google/gemini-2.5-flash)
- ✅ Edge function `ai-coach-chat` criada
- ✅ Página de chat com IA (`/chat`)
- ✅ Contexto personalizado baseado em perfil e anamnese

### 3. Estrutura de Navegação
- ✅ Home page com branding EMteam
- ✅ Sistema de autenticação (login/signup)
- ✅ Dashboard do aluno com quick actions
- ✅ Dashboard do coach (já existente)
- ✅ Página de chat com IA

### 4. Banco de Dados (Supabase)
- ✅ Tabelas existentes:
  - profiles (perfis de usuário)
  - anamnese (dados de saúde)
  - evaluations (avaliações físicas)
  - plans (planos de treino/alimentação)
  - exercises (exercícios com vídeos)
  - user_roles (roles: coach/admin)
  - subscriptions (já integrado com Stripe)

### 5. Integrações Ativas
- ✅ Supabase conectado
- ✅ Stripe configurado (para checkout de assinaturas)
- ✅ Lovable AI habilitado
- ✅ OpenAI API Key configurada (caso necessário)

## 🧪 Como Testar

### Teste 1: Acesso à Home
1. Abra a aplicação
2. Verifique que a home exibe:
   - Logo EMteam Digital (círculo laranja com "EM")
   - Botões "Começar Agora" e "Login"
   - Cards de features (Treinos, Nutrição, Acompanhamento)

### Teste 2: Login/Cadastro
1. Clique em "Começar Agora" ou "Login"
2. Faça login com uma conta existente ou cadastre-se
3. Após login:
   - Se aluno → redireciona para `/dashboard`
   - Se coach → redireciona para `/coach/dashboard`

### Teste 3: Chat com IA (Aluno)
1. Faça login como aluno
2. No dashboard, clique no card "Chat com IA"
3. Digite uma mensagem, exemplo: "Como devo fazer exercícios para ganhar massa?"
4. Aguarde resposta da IA
5. A IA deve responder de forma personalizada baseada nos dados do perfil

### Teste 4: Fluxo de Assinatura
1. Acesse `/subscription`
2. Verifique o plano disponível
3. Clique em "Assinar Agora"
4. Você será redirecionado para o checkout do Stripe
5. Após pagamento, o status deve ser atualizado

### Teste 5: Coach Dashboard
1. Faça login como coach (`ellymarmonteiro.personal@gmail.com`)
   - **IMPORTANTE**: O usuário coach precisa ser criado manualmente seguindo `SETUP_COACH.md`
2. Acesse `/coach/dashboard`
3. Verifique:
   - Lista de alunos
   - Planos pendentes
   - Exercícios cadastrados

## 📋 Configurações Pendentes (Manuais)

### 1. Criar Usuário Coach
Siga as instruções em `SETUP_COACH.md`:
1. Criar usuário no Supabase Auth com email `ellymarmonteiro.personal@gmail.com`
2. Executar função `setup_coach_role` com o user_id

### 2. Configurar Stripe Price ID
No arquivo `src/pages/Subscription.tsx` (linha 23):
```typescript
const PRICE_ID = "price_XXXXX"; // Substituir pelo price_id real do Stripe
```

### 3. Configurar Webhook do Stripe (Opcional)
Caso queira usar webhooks:
1. Configurar endpoint no Stripe Dashboard
2. Apontar para a função `stripe-webhook`
3. Adicionar secret do webhook

## 🎯 Próximos Passos

1. **Gerar Planos Automaticamente**
   - A edge function `generate-plans` já existe
   - Integrar com o webhook do Stripe ou botão manual
   - A IA criará treino e dieta baseados na anamnese

2. **Vídeos de Exercícios**
   - Upload de vídeos para storage do Supabase
   - Exibir vídeos no painel de treinos

3. **Notificações Automáticas**
   - Lembretes de treino
   - Reavaliação mensal
   - Mensagens motivacionais

4. **Dashboard do Coach Completo**
   - Ver progresso detalhado de cada aluno
   - Editar planos manualmente
   - Chat interno com alunos

## 🚀 Status Atual

- ✅ Design system configurado com cores EMteam
- ✅ Autenticação funcionando
- ✅ IA integrada e funcional
- ✅ Banco de dados estruturado
- ✅ Stripe conectado
- ⏳ Coach user precisa ser criado manualmente
- ⏳ Price ID do Stripe precisa ser configurado
- ⏳ Planos automáticos precisam ser testados

## 🔧 Troubleshooting

### IA não responde
- Verificar se o Lovable AI está habilitado
- Verificar logs da edge function `ai-coach-chat`
- Confirmar que o usuário está autenticado

### Erro no checkout Stripe
- Verificar se STRIPE_SECRET_KEY está configurada
- Verificar se o price_id está correto
- Verificar logs da função `create-checkout-session`

### Usuário não consegue acessar dashboard
- Verificar se completou cadastro
- Verificar se tem assinatura ativa
- Verificar se preencheu anamnese e avaliação

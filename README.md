# 💪 EMteam Digital - Personal Trainer & Nutricionista Digital

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

> Plataforma completa de treinos e nutrição personalizada com IA, gestão de alunos e sistema de assinaturas.

**Lovable Project:** https://lovable.dev/projects/c3a36488-dbf0-47b7-997f-c8f81885dec5

---

## 🎯 Sobre o Projeto

O **EMteam Digital** é uma plataforma SaaS que oferece treinos personalizados e planos alimentares gerados por inteligência artificial, com acompanhamento profissional de coaches. 

### ✨ Principais Funcionalidades

- 🤖 **Geração de Planos com IA** - Treinos e dietas personalizadas usando OpenAI
- 💳 **Sistema de Assinaturas** - Cobrança recorrente via Stripe (R$49,90/mês)
- 👨‍🏫 **Área do Coach** - Dashboard para gerenciar alunos e aprovar planos
- 📊 **Avaliações Físicas** - Registro de medidas e fotos de progresso
- 🔔 **Notificações** - Sistema de alertas e lembretes in-app
- 🎁 **Programa de Indicações** - Ganhe descontos indicando amigos
- 💬 **Chat com IA** - Assistente para tirar dúvidas sobre treino e nutrição

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/ellymarmonteiro/emteam-fit-coach-93713-24206-74885-21690
cd emteam-fit-coach-93713-24206-74885-21690

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔧 Tecnologias

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **Recharts** - Gráficos

### Backend
- **Supabase (Lovable Cloud)** - Backend completo
  - PostgreSQL (Database)
  - Auth (Autenticação)
  - Storage (Armazenamento)
  - Edge Functions (Serverless)
- **Stripe** - Pagamentos e assinaturas
- **OpenAI** - Geração de planos com IA

---

## 📁 Estrutura do Projeto

```
emteam-fit-coach/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   │   ├── coach/      # Área do coach
│   │   └── onboarding/ # Fluxo de cadastro
│   ├── integrations/    # Integrações (Supabase)
│   └── lib/            # Utilitários
├── supabase/
│   ├── functions/      # Edge Functions
│   │   ├── create-checkout-session/
│   │   ├── stripe-webhook/
│   │   ├── generate-plans/
│   │   └── coach-approve-plan/
│   └── migrations/     # Migrações do banco
└── reports/            # Documentação e relatórios
```

---

## 🧪 Testes

### Credenciais de Teste

**Coach/Admin:**
- Email: `ellymarmonteiro@icloud.com`
- Acesso: `/coach/auth`

**Stripe Test Mode:**
- Cartão: `4242 4242 4242 4242`
- Data: Qualquer data futura
- CVC: Qualquer 3 dígitos

### Roteiro de Testes

Consulte `reports/final-setup.md` para testes E2E completos.

**Teste Rápido:**
1. Crie conta em `/signup`
2. Assine em `/subscription`
3. Complete anamnese em `/onboarding/assessment`
4. Faça avaliação em `/evaluation`
5. Gere plano no `/dashboard`
6. Login como coach e aprove

---

## 💳 Sistema de Pagamentos

**Plano Mensal:** R$ 49,90/mês
- Checkout Stripe
- Cupons de desconto
- Cancelamento fácil

**Price ID:** `price_1SFbTFBOUVbo8M3yBVyFNfwQ`

---

## 🚀 Deploy

### Via Lovable (Recomendado)

1. Acesse [Lovable Project](https://lovable.dev/projects/c3a36488-dbf0-47b7-997f-c8f81885dec5)
2. Clique "Publish" > "Update"
3. Backend já está deployado automaticamente

### Domínio Customizado

- Navigate to Project > Settings > Domains
- Click Connect Domain
- [Documentação](https://docs.lovable.dev/features/custom-domain)

---

## 📖 Documentação Completa

- `reports/analysis.md` - Análise do projeto
- `reports/final-setup.md` - Testes E2E
- `reports/done.md` - Relatório final
- `BACKUP_REPORT.md` - Backup do sistema

---

## 🐛 Troubleshooting

### Problemas Comuns

**Checkout não abre?**
- Verifique console do navegador
- Confirme `VITE_STRIPE_PRICE_ID` configurado

**Webhook não processa?**
- Configure em Stripe Dashboard
- URL: `https://mhapxuzokpjwrnlaxofj.supabase.co/functions/v1/stripe-webhook`

**Planos não geram?**
- Verifique assinatura ativa
- Complete anamnese e avaliação
- Confirme `OPENAI_API_KEY`

Consulte `reports/done.md` para detalhes.

---

## 📞 Suporte

- **Documentação:** Pasta `reports/`
- **Logs:** Lovable Cloud > Functions
- **Lovable Discord:** https://discord.gg/lovable
- **Issues:** GitHub Issues

---

## 🎯 Roadmap

### ✅ Concluído
- Sistema de autenticação
- Integração Stripe
- Geração de planos com IA
- Área do coach
- Sistema de notificações

### 🚧 Planejado
- Coach AI Training
- Check-in diário
- Push notifications
- App mobile

---

## 📝 Licença

MIT License - Veja [LICENSE](LICENSE)

---

## 🌟 Status

✅ **Projeto 100% Funcional**

**Última Atualização:** 2025-01-08

---

<p align="center">
  Desenvolvido com ❤️ por <a href="https://github.com/ellymarmonteiro">Ellymar Monteiro</a>
</p>

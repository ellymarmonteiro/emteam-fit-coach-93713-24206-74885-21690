# Guia de Testes - EMteam Digital

Este documento descreve os testes a serem executados para validar as funcionalidades implementadas.

## 📋 Checklist de Testes

### ✅ 1. Anamnese Completa

**Objetivo:** Validar o fluxo completo de preenchimento da anamnese com todos os 7 blocos.

**Passos:**
1. Acesse `/onboarding/assessment`
2. Preencha o **Bloco A** com dados válidos:
   - Nome: João Silva
   - Data de nascimento: 15/03/1990
   - Sexo: Masculino
   - Altura: 175 cm
   - Peso atual: 85 kg
   - Peso desejado: 75 kg
   - Adicione medidas (opcional)
   - Faça upload de foto de perfil (opcional)
   - Faça upload de fotos do corpo (opcional)
3. Clique em "Salvar e Continuar"
4. Preencha o **Bloco B** (Histórico de Treino):
   - Pratica atividade: Sim
   - Descreva atividades: "Musculação 3x/semana"
   - Tempo de treino: 6-12 meses
   - Lesões: Não
5. Continue para o **Bloco C** (Saúde):
   - Marque condições relevantes (se aplicável)
   - Adicione medicamentos se necessário
6. Continue para o **Bloco D** (Nutrição):
   - Refeições por dia: 4
   - Preferência: Onívoro
   - Consumo de água: 2.5L
7. Continue para o **Bloco E** (Estilo de Vida):
   - Profissão: Desenvolvedor
   - Nível de atividade: Sedentário
   - Horas de sono: 7
   - Nível de estresse: Moderado
8. Continue para o **Bloco F** (Objetivos):
   - Objetivo principal: Emagrecimento
   - Prazo: "3 meses para perder 10kg"
   - Motivação: "Quero melhorar minha saúde"
   - Disponibilidade: "Seg, Qua, Sex - manhã"
9. Continue para o **Bloco G** (Consentimentos):
   - Marque todos os consentimentos necessários
10. Clique em "Concluir Anamnese"

**Resultado Esperado:**
- ✅ Navegação fluida entre blocos
- ✅ Salvamento automático (dados persistem ao recarregar)
- ✅ Validação de campos obrigatórios
- ✅ Tooltips funcionando
- ✅ Upload de fotos com preview
- ✅ Toast de sucesso ao concluir
- ✅ Redirecionamento para `/dashboard`

---

### ✅ 2. Avaliação Física com Cálculos

**Objetivo:** Testar a página de avaliação, cálculos automáticos e upload de fotos.

**Passos:**
1. Acesse `/evaluation`
2. Preencha os dados obrigatórios:
   - Peso: 85 kg
   - Altura: 175 cm
3. Preencha medidas corporais:
   - Pescoço: 38 cm
   - Peito: 95 cm
   - Cintura: 90 cm
   - Quadril: 98 cm
   - Coxa: 55 cm
   - Panturrilha: 38 cm
   - Braço: 35 cm
4. Adicione dados opcionais:
   - Frequência cardíaca: 70 bpm
   - Pressão arterial: 120/80
   - Observações: "Sentindo-me bem, energia alta"
5. Clique em "Calcular Resultados"
6. Faça upload das 3 fotos (frontal, lateral, costas)
7. Clique em "Salvar Avaliação"

**Resultado Esperado:**
- ✅ Cálculos corretos:
  - IMC = 27.8 (Sobrepeso)
  - % Gordura ≈ 18-25% (estimado)
  - Massa Magra ≈ 65-70 kg
- ✅ Card de resultados aparece após cálculo
- ✅ Upload de fotos funciona (max 2MB)
- ✅ Toast de sucesso ao salvar
- ✅ Redirecionamento para `/dashboard`

---

### ✅ 3. Tema Claro / Escuro

**Objetivo:** Validar alternância entre temas e persistência.

**Passos:**
1. Acesse qualquer página do app (ex: `/dashboard`)
2. Localize o botão de Theme Toggle no navbar (ícone de sol/lua)
3. Clique no botão
4. Observe a mudança de tema
5. Recarregue a página (F5)
6. Clique novamente no botão
7. Abra uma nova aba e acesse o app

**Resultado Esperado:**
- ✅ Transição suave entre temas (0.2s)
- ✅ Todos os componentes mudam de cor corretamente
- ✅ Tema persiste após reload
- ✅ Tema persiste em novas abas
- ✅ Ícone do botão muda (sol ↔ lua)
- ✅ Cores legíveis em ambos os temas

**Validar contraste especialmente em:**
- Cards com glassmorphism
- Textos sobre fundos
- Botões primários e secundários
- Inputs e selects

---

### ✅ 4. Notificações - Configuração

**Objetivo:** Testar a página de configurações de notificações.

**Passos:**
1. Acesse `/notifications`
2. **Teste Master Toggle:**
   - Desative "Ativar Notificações"
   - Verifique que todos os outros toggles ficam disabled
   - Reative "Ativar Notificações"
3. **Configure Mensagens Motivacionais:**
   - Ative o toggle
   - Altere o horário para "09:00"
4. **Configure Lembretes de Treino:**
   - Ative o toggle
   - Altere antecedência para 60 minutos
5. **Configure outras notificações:**
   - Ative "Cobrança Suave"
   - Ative "Parabéns por Metas"
   - Ative "Lembrete Mensal"
6. **Teste Período de Silêncio:**
   - Configure 3 dias de silêncio
7. **Revise exemplos de mensagens** (rolando a página)
8. Clique em "Salvar Configurações"

**Resultado Esperado:**
- ✅ Master toggle controla todos os demais
- ✅ Campos condicionais aparecem/desaparecem corretamente
- ✅ Validação de campos numéricos (min/max)
- ✅ Exemplos de mensagens visíveis
- ✅ Toast de sucesso ao salvar
- ✅ Dados salvos no localStorage

---

### ✅ 5. Upload de Foto de Perfil

**Objetivo:** Testar upload, preview e validação de fotos.

**Passos:**
1. Durante o cadastro ou em `/profile`:
2. Clique no componente de upload de foto
3. **Teste foto válida:**
   - Selecione uma imagem JPG < 2MB
   - Verifique o preview
4. **Teste foto inválida:**
   - Tente enviar arquivo > 2MB (deve rejeitar)
   - Tente enviar PDF ou arquivo não-imagem (deve rejeitar)
5. Clique em "Trocar Foto"
6. Envie outra imagem válida

**Resultado Esperado:**
- ✅ Preview circular da foto
- ✅ Rejeição de arquivos > 2MB com toast de erro
- ✅ Rejeição de formatos inválidos
- ✅ Compressão automática para max 500x500px
- ✅ Botão "Trocar Foto" funciona
- ✅ Ícone de câmera aparece ao hover

---

### ✅ 6. Responsividade

**Objetivo:** Garantir que todas as páginas funcionam bem em mobile.

**Passos:**
1. Abra DevTools (F12)
2. Ative modo responsivo (Ctrl+Shift+M)
3. Teste em diferentes tamanhos:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

**Páginas a testar:**
- `/onboarding/assessment` (todos os 7 blocos)
- `/dashboard`
- `/evaluation`
- `/notifications`

**Resultado Esperado:**
- ✅ Layouts adaptam corretamente (grid → stack)
- ✅ Navbar responsivo (mobile menu se necessário)
- ✅ Botões e inputs com tamanho adequado (min 44px altura)
- ✅ Texto legível sem zoom
- ✅ Não há overflow horizontal
- ✅ Cards empilham em mobile
- ✅ Formulários funcionam bem em telas pequenas

---

### ✅ 7. Navegação e Rotas

**Objetivo:** Validar que todas as rotas estão configuradas corretamente.

**Passos:**
1. Teste as seguintes rotas manualmente:
   - `/` (Home)
   - `/auth` (Login)
   - `/onboarding/gender` (Seleção de sexo)
   - `/onboarding/assessment` (Anamnese)
   - `/dashboard` (Dashboard principal)
   - `/workouts` (Treinos)
   - `/nutrition` (Nutrição)
   - `/measurements` (Medidas)
   - `/evaluation` (Avaliação física)
   - `/notifications` (Notificações)
   - `/profile` (Perfil)
   - `/referrals` (Indicações)
   - `/subscription` (Assinatura)
   - `/exams` (Exames)

2. Teste navegação via navbar
3. Teste navegação via cards do dashboard
4. Teste rota inexistente (ex: `/rota-invalida`)

**Resultado Esperado:**
- ✅ Todas as rotas carregam corretamente
- ✅ Links do navbar funcionam
- ✅ Cards do dashboard redirecionam corretamente
- ✅ Rota inexistente mostra página 404
- ✅ Botão "Voltar" funciona nas páginas

---

### ✅ 8. Performance e Otimização

**Objetivo:** Verificar tempos de carregamento e otimizações.

**Passos:**
1. Abra Chrome DevTools → Lighthouse
2. Execute audit em modo Desktop
3. Execute audit em modo Mobile
4. Verifique Network tab:
   - Quantidade de requests
   - Tamanho total transferido
   - Tempo de load

**Resultado Esperado:**
- ✅ Performance score > 80
- ✅ Accessibility score > 90
- ✅ Best Practices score > 90
- ✅ SEO score > 90
- ✅ First Contentful Paint < 2s
- ✅ Time to Interactive < 3.5s
- ✅ Imagens otimizadas (lazy loading)

---

### ✅ 9. Validação de Formulários

**Objetivo:** Testar validações em todos os formulários.

**Passos:**
1. **Anamnese:**
   - Tente avançar Bloco A sem preencher campos obrigatórios
   - Digite altura/peso inválidos (negativos, muito altos)
   - Teste datas inválidas

2. **Avaliação:**
   - Tente salvar sem peso/altura
   - Digite valores negativos
   - Tente calcular sem medidas mínimas

3. **Notificações:**
   - Tente valores inválidos em "minutos de antecedência"
   - Teste horário inválido

**Resultado Esperado:**
- ✅ Toast de erro aparece com mensagem clara
- ✅ Campos obrigatórios são destacados
- ✅ Não permite valores inválidos
- ✅ Validação ocorre no submit
- ✅ Mensagens de erro são amigáveis

---

### ✅ 10. Salvamento Automático (Draft)

**Objetivo:** Validar que dados são salvos automaticamente durante preenchimento.

**Passos:**
1. Acesse `/onboarding/assessment`
2. Preencha metade do Bloco A
3. **Recarregue a página** (F5)
4. Verifique que os dados permanecem
5. Continue preenchendo
6. Navegue para outra aba
7. Volte e recarregue

**Resultado Esperado:**
- ✅ Dados salvos automaticamente no localStorage
- ✅ Dados persistem após reload
- ✅ Indicador "Salvo automaticamente" visível
- ✅ Dados são limpos após conclusão

---

## 🐛 Bugs Comuns a Verificar

- [ ] Foto de perfil não aparece após upload
- [ ] Tema não persiste após reload
- [ ] Cálculo de IMC incorreto
- [ ] Toast não desaparece automaticamente
- [ ] Upload aceita arquivos > 2MB
- [ ] Salvamento automático não funciona
- [ ] Validação não bloqueia submit
- [ ] Links quebrados no navbar
- [ ] Overflow horizontal em mobile
- [ ] Contraste baixo em modo claro

---

## 📊 Matriz de Compatibilidade

| Funcionalidade | Chrome | Firefox | Safari | Edge | Mobile |
|----------------|--------|---------|--------|------|--------|
| Anamnese       | ✅     | ✅      | ✅     | ✅   | ✅     |
| Avaliação      | ✅     | ✅      | ✅     | ✅   | ✅     |
| Notificações   | ✅     | ✅      | ✅     | ✅   | ✅     |
| Upload Fotos   | ✅     | ✅      | ✅     | ✅   | ⚠️     |
| Tema Toggle    | ✅     | ✅      | ✅     | ✅   | ✅     |

⚠️ = Funciona mas pode ter limitações

---

## 📝 Relatório de Testes

Após executar todos os testes, preencha:

**Data:** __________  
**Testador:** __________  
**Versão:** __________

**Resumo:**
- ✅ Testes passados: ___/10
- ❌ Testes falhados: ___/10
- ⚠️ Issues encontrados: ___

**Observações:**
_________________________________
_________________________________
_________________________________

---

**Última atualização:** 2025-10-17  
**Versão do guia:** 1.0.0

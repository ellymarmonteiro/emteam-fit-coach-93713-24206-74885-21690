# Documentação de Integração Backend - EMteam Digital

Este documento descreve os endpoints de backend necessários para ativar as funcionalidades implementadas no frontend.

## 📋 Sumário

1. [Anamnese](#anamnese)
2. [Avaliações Físicas](#avaliações-físicas)
3. [Notificações](#notificações)
4. [Upload de Fotos](#upload-de-fotos)

---

## 🩺 Anamnese

### POST `/api/anamnese`
Salva os dados completos da anamnese do usuário.

**Body:**
```json
{
  "userId": "string",
  "fullName": "string",
  "birthDate": "string (ISO date)",
  "gender": "male | female | other",
  "height": "number",
  "currentWeight": "number",
  "targetWeight": "number",
  "measurements": {
    "neck": "number",
    "chest": "number",
    "waist": "number",
    "hip": "number",
    "thigh": "number",
    "calf": "number",
    "arm": "number"
  },
  "isActive": "yes | no",
  "trainingDuration": "string",
  "hasInjuries": "yes | no",
  "injuries": "string",
  "hypertension": "boolean",
  "diabetes": "boolean",
  "cardiovascular": "boolean",
  "kidney": "boolean",
  "medications": "string",
  "allergies": "string",
  "intolerances": "string",
  "mealsPerDay": "string",
  "dietPreference": "string",
  "waterIntake": "number",
  "supplements": "string",
  "profession": "string",
  "activityLevel": "string",
  "sleepHours": "number",
  "stressLevel": "string",
  "mainGoal": "string",
  "targetTimeline": "string",
  "motivation": "string",
  "availability": "string",
  "termsAccepted": "boolean",
  "photoConsent": "boolean",
  "notificationsConsent": "boolean",
  "createdAt": "timestamp"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "anamneseId": "string",
  "message": "Anamnese salva com sucesso"
}
```

---

## 📊 Avaliações Físicas

### POST `/api/evaluation`
Cria uma nova avaliação física com medidas e cálculos.

**Body:**
```json
{
  "userId": "string",
  "date": "string (ISO date)",
  "measurements": {
    "weight": "number",
    "height": "number",
    "neck": "number",
    "chest": "number",
    "waist": "number",
    "hip": "number",
    "thigh": "number",
    "calf": "number",
    "arm": "number",
    "heartRate": "number (optional)",
    "bloodPressure": "string (optional)"
  },
  "photos": {
    "front": "string (URL or base64)",
    "side": "string (URL or base64)",
    "back": "string (URL or base64)"
  },
  "calculatedResults": {
    "bmi": "number",
    "bodyFatPercentage": "number",
    "leanMass": "number",
    "bmiCategory": "string"
  },
  "notes": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "evaluationId": "string",
  "message": "Avaliação salva com sucesso"
}
```

### GET `/api/evaluation/:userId`
Retorna todas as avaliações de um usuário.

**Response:** `200 OK`
```json
{
  "evaluations": [
    {
      "id": "string",
      "date": "string",
      "measurements": { /* ... */ },
      "calculatedResults": { /* ... */ },
      "photos": { /* ... */ }
    }
  ]
}
```

### GET `/api/evaluation/:userId/latest`
Retorna a avaliação mais recente.

**Response:** `200 OK`
```json
{
  "evaluation": {
    "id": "string",
    "date": "string",
    "measurements": { /* ... */ },
    "calculatedResults": { /* ... */ }
  }
}
```

---

## 🔔 Notificações

### POST `/api/notifications/schedule`
Configura as preferências de notificação do usuário.

**Body:**
```json
{
  "userId": "string",
  "settings": {
    "enableAll": "boolean",
    "dailyMotivation": "boolean",
    "dailyMotivationTime": "string (HH:mm)",
    "workoutReminder": "boolean",
    "workoutReminderMinutes": "number",
    "missedWorkout": "boolean",
    "goalCelebration": "boolean",
    "monthlyWeighIn": "boolean",
    "silenceDays": "number"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Configurações salvas com sucesso"
}
```

### GET `/api/notifications/settings/:userId`
Retorna as configurações de notificação do usuário.

**Response:** `200 OK`
```json
{
  "settings": {
    "enableAll": "boolean",
    "dailyMotivation": "boolean",
    /* ... demais configurações */
  }
}
```

### POST `/api/notifications/send`
Envia uma notificação específica (usado internamente pelo sistema).

**Body:**
```json
{
  "userId": "string",
  "type": "motivational | reminder | missedWorkout | celebration",
  "message": "string",
  "scheduledFor": "string (ISO timestamp)"
}
```

---

## 📸 Upload de Fotos

### POST `/api/upload/profile`
Upload de foto de perfil.

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
```
photo: File (max 2MB, JPG/PNG)
userId: string
```

**Response:** `200 OK`
```json
{
  "success": true,
  "photoUrl": "string (URL da foto)",
  "message": "Foto enviada com sucesso"
}
```

### POST `/api/upload/evaluation`
Upload de fotos de avaliação.

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
```
photos: File[] (max 3 files, 2MB each)
userId: string
evaluationId: string
position: "front" | "side" | "back"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "photoUrls": {
    "front": "string",
    "side": "string",
    "back": "string"
  }
}
```

---

## 🔄 Cron Jobs / Tarefas Agendadas

### Job: `check-missed-workouts`
**Frequência:** Diário (23:30)

**Função:** Verifica usuários que não registraram treino no dia programado e envia notificação de cobrança suave (máx 2x por semana).

### Job: `send-daily-motivation`
**Frequência:** Diário (horário configurado pelo usuário)

**Função:** Envia mensagem motivacional diária para usuários que ativaram essa opção.

### Job: `send-workout-reminders`
**Frequência:** A cada 15 minutos

**Função:** Verifica treinos agendados e envia lembretes com a antecedência configurada.

### Job: `monthly-weigh-in-reminder`
**Frequência:** Mensal (1º dia do mês, 9:00)

**Função:** Envia lembrete para fazer avaliação mensal.

---

## 🔌 Como Integrar Push Notifications

### Opção 1: Firebase Cloud Messaging (FCM)

1. Crie projeto no Firebase Console
2. Adicione as credenciais no backend:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   ```

3. No frontend, inicialize o FCM:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getMessaging, getToken } from 'firebase/messaging';
   
   const messaging = getMessaging(app);
   const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
   // Enviar token para o backend
   ```

### Opção 2: OneSignal

1. Crie conta no OneSignal
2. Configure as credenciais:
   ```env
   ONESIGNAL_APP_ID=your-app-id
   ONESIGNAL_REST_API_KEY=your-api-key
   ```

3. No frontend:
   ```javascript
   window.OneSignal = window.OneSignal || [];
   OneSignal.push(function() {
     OneSignal.init({
       appId: "YOUR_APP_ID",
     });
   });
   ```

### Opção 3: Expo Push Notifications (para mobile)

1. No projeto React Native/Expo:
   ```javascript
   import * as Notifications from 'expo-notifications';
   
   const token = await Notifications.getExpoPushTokenAsync();
   // Enviar token para o backend
   ```

---

## 📝 Banco de Dados - Schema Sugerido

### Tabela: `anamneses`
```sql
CREATE TABLE anamneses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(20),
  height DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  measurements JSONB,
  training_history JSONB,
  health_data JSONB,
  nutrition_data JSONB,
  lifestyle_data JSONB,
  goals JSONB,
  consents JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: `evaluations`
```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  measurements JSONB NOT NULL,
  calculated_results JSONB NOT NULL,
  photos JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evaluations_user_date ON evaluations(user_id, date DESC);
```

### Tabela: `notification_settings`
```sql
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  settings JSONB NOT NULL,
  device_tokens JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: `notification_log`
```sql
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent'
);

CREATE INDEX idx_notification_log_user ON notification_log(user_id, sent_at DESC);
```

---

## 🧪 Testes Recomendados

1. **Teste de Anamnese Completa**
   - Preencher todos os 7 blocos
   - Validar salvamento automático
   - Verificar dados salvos no banco

2. **Teste de Avaliação**
   - Inserir medidas válidas
   - Verificar cálculo de IMC e % gordura
   - Upload de fotos
   - Validar dados salvos

3. **Teste de Notificações**
   - Ativar/desativar cada tipo
   - Configurar horários
   - Simular envio (logs)

4. **Teste de Tema**
   - Alternar entre claro/escuro
   - Verificar persistência (localStorage + backend)

5. **Teste de Upload**
   - Fotos > 2MB (deve rejeitar)
   - Formatos inválidos (deve rejeitar)
   - Compressão automática

---

## 📚 Mensagens de Notificação (10 variações)

### Motivacionais Diárias
1. "Bom dia! Hoje é dia de cuidar de você — bora treinar 20 minutos? 💪"
2. "Você está mais forte do que ontem. Continue assim! 🔥"
3. "Cada passo conta. Vamos juntos nessa jornada! ✨"
4. "Lembre-se: consistência é a chave do sucesso! 🗝️"
5. "Seu corpo agradece cada treino. Vamos lá! 💙"
6. "Hoje é um ótimo dia para se superar! 🚀"
7. "Pequenos progressos são grandes vitórias! 🏆"
8. "Você é capaz de muito mais do que imagina! ⭐"
9. "Transformação acontece um dia de cada vez! 🌱"
10. "Seu eu do futuro vai te agradecer! 🙏"

### Lembretes de Treino
1. "Seu treino está agendado para daqui a 30 minutos! Se prepare! ⏰"
2. "Hora do treino! Você consegue! 💪"
3. "Faltam 30 minutos! Separe sua roupa e se hidrate! 💧"
4. "Seu horário de treino está chegando! Bora! 🔥"
5. "Daqui a pouco é hora! Vista-se e mentalize o treino! 🧠"
6. "Prepare-se: seu treino é em breve! ⏳"
7. "Está quase na hora! Alongue-se e beba água! 🤸"
8. "Faltam minutos! Coloque sua playlist favorita! 🎵"
9. "Seu treino te aguarda! Vamos nessa! 🏃"
10. "Quase lá! Mentalize um ótimo treino! 🎯"

### Cobrança Suave
1. "Percebemos que você não treinou hoje — tudo bem? Quer remarcar? 😊"
2. "Sentimos sua falta no treino de hoje. Como você está? 💙"
3. "O treino ficou para depois hoje? Sem problemas, remarque quando puder! 📅"
4. "Dias difíceis acontecem. Que tal um treino leve amanhã? 🤗"
5. "Não conseguiu treinar hoje? Avise seu coach, estamos aqui! 💬"
6. "Tudo bem perder um treino. O importante é voltar! 🔄"
7. "Sentimos sua falta hoje! Remarque e volte ainda mais forte! 💪"
8. "Pausa no treino? Sem estresse, a gente entende! ☺️"
9. "Treino cancelado? Ajuste sua agenda, estamos aqui! 📆"
10. "Não rolou hoje? Tranquilo! Planeje o próximo! 📝"

### Celebrações
1. "Parabéns! Você atingiu sua meta de peso! 🎉🎊"
2. "Meta alcançada! Seu esforço está valendo a pena! 🏆"
3. "Incrível! Você chegou onde queria! Continue assim! 🌟"
4. "Objetivo conquistado! Que orgulho! 🥳"
5. "Você fez isso! Celebre essa vitória! 🍾"
6. "Meta batida! Seu empenho trouxe resultados! 💯"
7. "Sucesso! Você merece essa conquista! 👏"
8. "Resultado atingido! Estamos orgulhosos! ❤️"
9. "Você conseguiu! Hora de comemorar! 🎈"
10. "Meta cumprida! Defina a próxima! 🎯"

---

## 🔐 Segurança

- Todas as rotas de API devem exigir autenticação (JWT ou similar)
- Validar todos os inputs no backend
- Limitar tamanho de uploads (2MB por foto)
- Sanitizar dados antes de salvar no banco
- Implementar rate limiting para evitar spam
- Criptografar dados sensíveis (medicamentos, alergias)
- HTTPS obrigatório em produção

---

## 📞 Suporte

Em caso de dúvidas sobre a implementação backend, consulte a documentação do Lovable Cloud ou entre em contato com o time de desenvolvimento.

**Endpoints de teste:** Use ferramentas como Postman ou Insomnia para testar os endpoints antes da integração completa.

---

**Data da última atualização:** 2025-10-17  
**Versão:** 1.0.0

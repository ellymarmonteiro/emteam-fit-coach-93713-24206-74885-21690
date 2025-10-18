import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Award, Calendar, BellOff } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface NotificationSettings {
  enableAll: boolean;
  dailyMotivation: boolean;
  dailyMotivationTime: string;
  workoutReminder: boolean;
  workoutReminderMinutes: number;
  missedWorkout: boolean;
  goalCelebration: boolean;
  monthlyWeighIn: boolean;
  silenceDays: number;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>({
    enableAll: true,
    dailyMotivation: true,
    dailyMotivationTime: "08:00",
    workoutReminder: true,
    workoutReminderMinutes: 30,
    missedWorkout: true,
    goalCelebration: true,
    monthlyWeighIn: true,
    silenceDays: 0
  });

  const handleSave = () => {
    // TODO: Save to backend via /api/notifications/schedule
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast.success("Configurações de notificações salvas!");
  };

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Example notification messages
  const exampleMessages = {
    motivational: [
      "Bom dia! Hoje é dia de cuidar de você — bora treinar 20 minutos? 💪",
      "Você está mais forte do que ontem. Continue assim! 🔥",
      "Cada passo conta. Vamos juntos nessa jornada! ✨"
    ],
    reminder: [
      "Seu treino está agendado para daqui a 30 minutos! Se prepare! ⏰",
      "Hora do treino! Você consegue! 💪"
    ],
    missedWorkout: [
      "Percebemos que você não treinou hoje — tudo bem? Quer remarcar? 😊",
      "Sentimos sua falta no treino de hoje. Como você está? 💙"
    ],
    celebration: [
      "Parabéns! Você atingiu sua meta de peso! 🎉🎊",
      "Meta alcançada! Seu esforço está valendo a pena! 🏆"
    ]
  };

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="w-8 h-8 text-primary" />
              Notificações e Lembretes
            </h1>
            <p className="text-muted-foreground">Configure seus lembretes e mensagens motivacionais</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Voltar
          </Button>
        </div>

        {/* Master Toggle */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.enableAll ? (
                <Bell className="w-6 h-6 text-primary" />
              ) : (
                <BellOff className="w-6 h-6 text-muted-foreground" />
              )}
              <div>
                <Label className="text-lg font-semibold">Ativar Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Habilitar/desabilitar todas as notificações
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enableAll}
              onCheckedChange={(checked) => updateSetting('enableAll', checked)}
            />
          </div>
        </Card>

        {/* Notification Types */}
        <Card className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-bold">Tipos de Notificações</h2>

          {/* Daily Motivation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <Label className="font-semibold">Mensagens Motivacionais Diárias</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba uma mensagem inspiradora todo dia
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.dailyMotivation}
                onCheckedChange={(checked) => updateSetting('dailyMotivation', checked)}
                disabled={!settings.enableAll}
              />
            </div>
            {settings.dailyMotivation && settings.enableAll && (
              <div className="ml-8 space-y-2">
                <Label htmlFor="motivationTime">Horário da mensagem</Label>
                <Input
                  id="motivationTime"
                  type="time"
                  value={settings.dailyMotivationTime}
                  onChange={(e) => updateSetting('dailyMotivationTime', e.target.value)}
                  className="max-w-xs"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Workout Reminder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary" />
                <div>
                  <Label className="font-semibold">Lembrete de Treino</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba um lembrete antes do seu horário de treino
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.workoutReminder}
                onCheckedChange={(checked) => updateSetting('workoutReminder', checked)}
                disabled={!settings.enableAll}
              />
            </div>
            {settings.workoutReminder && settings.enableAll && (
              <div className="ml-8 space-y-2">
                <Label htmlFor="reminderMinutes">Avisar com antecedência (minutos)</Label>
                <Input
                  id="reminderMinutes"
                  type="number"
                  min="15"
                  max="120"
                  step="15"
                  value={settings.workoutReminderMinutes}
                  onChange={(e) => updateSetting('workoutReminderMinutes', parseInt(e.target.value))}
                  className="max-w-xs"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Missed Workout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-accent" />
              <div>
                <Label className="font-semibold">Cobrança Suave por Falta</Label>
                <p className="text-sm text-muted-foreground">
                  Mensagem gentil quando você não treinar no dia programado
                </p>
              </div>
            </div>
            <Switch
              checked={settings.missedWorkout}
              onCheckedChange={(checked) => updateSetting('missedWorkout', checked)}
              disabled={!settings.enableAll}
            />
          </div>

          <Separator />

          {/* Goal Celebration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-primary" />
              <div>
                <Label className="font-semibold">Parabéns por Metas</Label>
                <p className="text-sm text-muted-foreground">
                  Celebre quando atingir seus objetivos de peso ou gordura
                </p>
              </div>
            </div>
            <Switch
              checked={settings.goalCelebration}
              onCheckedChange={(checked) => updateSetting('goalCelebration', checked)}
              disabled={!settings.enableAll}
            />
          </div>

          <Separator />

          {/* Monthly Weigh-in */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-secondary" />
              <div>
                <Label className="font-semibold">Lembrete de Pesagem Mensal</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um lembrete para fazer sua avaliação mensal
                </p>
              </div>
            </div>
            <Switch
              checked={settings.monthlyWeighIn}
              onCheckedChange={(checked) => updateSetting('monthlyWeighIn', checked)}
              disabled={!settings.enableAll}
            />
          </div>
        </Card>

        {/* Silence Period */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Período de Silêncio</h2>
          <div className="space-y-2">
            <Label htmlFor="silenceDays">Silenciar notificações por (dias)</Label>
            <Input
              id="silenceDays"
              type="number"
              min="0"
              max="30"
              value={settings.silenceDays}
              onChange={(e) => updateSetting('silenceDays', parseInt(e.target.value))}
              className="max-w-xs"
              disabled={!settings.enableAll}
            />
            <p className="text-sm text-muted-foreground">
              Útil se você precisar de uma pausa das notificações
            </p>
          </div>
        </Card>

        {/* Example Messages */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Exemplos de Mensagens</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-primary">Motivacionais</Label>
              <ul className="mt-2 space-y-2">
                {exampleMessages.motivational.map((msg, i) => (
                  <li key={i} className="text-sm p-3 bg-primary/5 rounded-lg border border-primary/20">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="text-sm font-semibold text-secondary">Lembretes</Label>
              <ul className="mt-2 space-y-2">
                {exampleMessages.reminder.map((msg, i) => (
                  <li key={i} className="text-sm p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="text-sm font-semibold text-accent">Cobrança Suave</Label>
              <ul className="mt-2 space-y-2">
                {exampleMessages.missedWorkout.map((msg, i) => (
                  <li key={i} className="text-sm p-3 bg-accent/5 rounded-lg border border-accent/20">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="text-sm font-semibold text-primary">Celebrações</Label>
              <ul className="mt-2 space-y-2">
                {exampleMessages.celebration.map((msg, i) => (
                  <li key={i} className="text-sm p-3 bg-primary/5 rounded-lg border border-primary/20">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4 italic">
            * Temos mais de 10 variações de cada tipo de mensagem para evitar repetição
          </p>
        </Card>

        {/* Technical Info */}
        <Card className="glass-card p-6 bg-muted/20">
          <h3 className="font-semibold mb-2">Informação Técnica</h3>
          <p className="text-sm text-muted-foreground">
            As notificações estão configuradas no frontend. Para ativar notificações push reais, 
            será necessário integrar com Firebase Cloud Messaging, OneSignal ou Expo Push Notifications.
            Os endpoints de backend estão prontos em <code className="bg-card px-1 py-0.5 rounded">/api/notifications/schedule</code>.
          </p>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gradient-primary">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

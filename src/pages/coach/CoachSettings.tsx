import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Lock } from "lucide-react";
import { toast } from "sonner";
import CoachNavbar from "@/components/CoachNavbar";

const CoachSettings = () => {
  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Configurações</h1>
          </div>
          <p className="text-muted-foreground">Gerencie suas preferências e integrações</p>
        </div>

        {/* Profile Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coach-name">Nome Completo</Label>
                <Input id="coach-name" defaultValue="Prof. Carlos Santos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach-email">E-mail</Label>
                <Input id="coach-email" type="email" defaultValue="carlos@emteam.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach-phone">Telefone</Label>
                <Input id="coach-phone" defaultValue="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach-cref">CREF</Label>
                <Input id="coach-cref" defaultValue="123456-G/SP" />
              </div>
            </div>
            <Button onClick={handleSave} className="gradient-primary">
              Salvar Informações
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={handleSave} variant="outline">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Future Integrations */}
        <Card className="glass-card border-muted/50">
          <CardHeader>
            <CardTitle>Integrações Futuras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 opacity-60">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input disabled placeholder="sk-..." />
                <p className="text-xs text-muted-foreground">
                  Será habilitado futuramente para personalização da IA
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 opacity-60">
              <div className="space-y-2">
                <Label>Stripe API Key</Label>
                <Input disabled placeholder="sk_live_..." />
                <p className="text-xs text-muted-foreground">
                  Será habilitado para gestão de pagamentos
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 opacity-60">
              <div className="space-y-2">
                <Label>Supabase Connection</Label>
                <Input disabled placeholder="https://..." />
                <p className="text-xs text-muted-foreground">
                  Será configurado para banco de dados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default CoachSettings;

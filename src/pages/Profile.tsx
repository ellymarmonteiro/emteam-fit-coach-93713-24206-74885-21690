import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Meu Perfil</h1>
            </div>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gradient-primary">
              Editar Perfil
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl bg-gradient-primary">JS</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      defaultValue="João Silva"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="joao.silva@email.com"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      defaultValue="(11) 98765-4321"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth">Data de Nascimento</Label>
                    <Input
                      id="birth"
                      type="date"
                      defaultValue="1998-05-15"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte um pouco sobre você..."
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                    rows={3}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="gradient-primary flex-1">
                      Salvar Alterações
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Membro desde</CardTitle>
              <Calendar className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Janeiro 2025</div>
              <p className="text-xs text-muted-foreground">4 meses de jornada</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Treinos Totais</CardTitle>
              <User className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">Treinos concluídos</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">60%</div>
              <p className="text-xs text-muted-foreground">Do objetivo alcançado</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Assinatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="font-semibold">Plano EMteam Digital</p>
                <p className="text-sm text-muted-foreground">R$ 49,90/mês</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-500 font-semibold">
                Ativo
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Próxima cobrança em <span className="font-semibold">30/05/2025</span>
            </p>
            <Button variant="outline" className="w-full">
              Gerenciar Assinatura
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Profile;

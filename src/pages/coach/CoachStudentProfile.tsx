import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, Calendar, Target, TrendingUp, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CoachNavbar from "@/components/CoachNavbar";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CoachStudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleting, setDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const handleDeleteUser = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { 
          user_id: id,
          reason: deleteReason || "Cancelamento solicitado pelo coach"
        }
      });

      if (error) throw error;

      toast.success("Usuário deletado com sucesso!");
      navigate("/coach/students");
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      toast.error(error.message || "Erro ao deletar usuário");
    } finally {
      setDeleting(false);
    }
  };

  // Mock student data - in real app would fetch from API
  const student = {
    id: parseInt(id || "1"),
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    birthDate: "15/03/1990",
    weight: 78,
    height: 175,
    goal: "Emagrecimento",
    status: "active",
    startDate: "01/01/2025",
    anamnese: {
      objetivo: "Perder peso e ganhar massa muscular",
      restricoes: "Nenhuma restrição alimentar",
      lesoes: "Sem lesões no momento",
      experiencia: "Intermediário - treina há 2 anos",
      disponibilidade: "5x por semana",
    },
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/coach/students")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Alunos
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-3xl gradient-primary text-white">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{student.name}</h1>
                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                  {student.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Aluno desde {student.startDate}
              </p>
            </div>

            <Button 
              className="gradient-primary"
              onClick={() => navigate(`/coach/student/${student.id}/edit`)}
            >
              Editar Plano
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar Aluno
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <p>Tem certeza que deseja deletar o cadastro de <strong>{student.name}</strong>?</p>
                    <p className="text-destructive font-semibold">Esta ação é IRREVERSÍVEL e vai:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Remover o usuário completamente</li>
                      <li>Deletar todos os planos e avaliações</li>
                      <li>Apagar histórico e dados pessoais</li>
                    </ul>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Motivo (opcional):</Label>
                      <Input
                        id="reason"
                        placeholder="Ex: Solicitação do aluno, inadimplência..."
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {deleting ? "Deletando..." : "Sim, Deletar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-semibold">{student.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-semibold">{student.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-semibold">{student.birthDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Physical Data */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Dados Físicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Peso Atual</p>
                  <p className="text-2xl font-bold">{student.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Altura</p>
                  <p className="text-2xl font-bold">{student.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">IMC</p>
                  <p className="text-2xl font-bold">
                    {((student.weight / Math.pow(student.height / 100, 2))).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Objetivo</p>
                  <Badge className="text-base px-3 py-1">{student.goal}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anamnese */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Anamnese Completa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Objetivo Principal</p>
                <p className="text-muted-foreground">{student.anamnese.objetivo}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Restrições Alimentares</p>
                <p className="text-muted-foreground">{student.anamnese.restricoes}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Lesões ou Limitações</p>
                <p className="text-muted-foreground">{student.anamnese.lesoes}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Experiência com Treino</p>
                <p className="text-muted-foreground">{student.anamnese.experiencia}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Disponibilidade</p>
                <p className="text-muted-foreground">{student.anamnese.disponibilidade}</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Treino</p>
                <p className="text-muted-foreground">
                  Treino ABC - Hipertrofia e emagrecimento (5x por semana)
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Dieta</p>
                <p className="text-muted-foreground">
                  2000 kcal/dia - Déficit calórico moderado (40% carbo, 30% proteína, 30% gordura)
                </p>
              </div>
              <Button 
                className="gradient-primary w-full md:w-auto"
                onClick={() => navigate(`/coach/student/${student.id}/edit`)}
              >
                Editar Plano Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachStudentProfile;

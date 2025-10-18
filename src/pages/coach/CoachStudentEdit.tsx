import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Dumbbell, Apple } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CoachNavbar from "@/components/CoachNavbar";
import { useState } from "react";

const CoachStudentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // Mock student data
  const studentName = "João Silva";

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Plano de ${studentName} atualizado com sucesso!`);
      navigate(`/coach/student/${id}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(`/coach/student/${id}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Perfil
          </Button>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Editar Plano</h1>
            <p className="text-muted-foreground">
              Personalize o treino e dieta de {studentName}
            </p>
          </div>

          <form onSubmit={handleSavePlan} className="space-y-6">
            {/* Workout Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  Plano de Treino
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workout-name">Nome do Treino</Label>
                  <Input
                    id="workout-name"
                    defaultValue="Treino ABC - Hipertrofia e emagrecimento"
                    placeholder="Ex: Treino ABC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workout-frequency">Frequência Semanal</Label>
                  <Input
                    id="workout-frequency"
                    defaultValue="5x por semana"
                    placeholder="Ex: 5x por semana"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workout-description">Descrição do Treino</Label>
                  <Textarea
                    id="workout-description"
                    rows={8}
                    defaultValue={`Treino A - Peito e Tríceps
- Supino reto 4x12
- Supino inclinado 4x12
- Crucifixo 3x15
- Tríceps testa 3x12
- Tríceps corda 3x15

Treino B - Costas e Bíceps
- Puxada frontal 4x12
- Remada curvada 4x12
- Remada unilateral 3x12
- Rosca direta 3x12
- Rosca martelo 3x12

Treino C - Pernas e Ombros
- Agachamento 4x12
- Leg press 4x15
- Cadeira extensora 3x15
- Desenvolvimento 4x12
- Elevação lateral 3x15`}
                    placeholder="Descreva o treino completo..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workout-notes">Observações</Label>
                  <Textarea
                    id="workout-notes"
                    rows={3}
                    defaultValue="Foco em hipertrofia com volume moderado. Aumentar cargas progressivamente."
                    placeholder="Adicione observações importantes..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-primary" />
                  Plano Alimentar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calorias Diárias</Label>
                    <Input
                      id="calories"
                      type="number"
                      defaultValue="2000"
                      placeholder="Ex: 2000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meals">Número de Refeições</Label>
                    <Input
                      id="meals"
                      type="number"
                      defaultValue="5"
                      placeholder="Ex: 5"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carboidratos (%)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      defaultValue="40"
                      placeholder="Ex: 40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protein">Proteínas (%)</Label>
                    <Input
                      id="protein"
                      type="number"
                      defaultValue="30"
                      placeholder="Ex: 30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fat">Gorduras (%)</Label>
                    <Input
                      id="fat"
                      type="number"
                      defaultValue="30"
                      placeholder="Ex: 30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet-description">Plano Alimentar Completo</Label>
                  <Textarea
                    id="diet-description"
                    rows={10}
                    defaultValue={`Café da Manhã (7h00)
- 2 ovos mexidos
- 2 fatias de pão integral
- 1 banana
- Café sem açúcar

Lanche da Manhã (10h00)
- 1 iogurte grego
- 1 porção de castanhas

Almoço (13h00)
- 150g de frango grelhado
- 4 colheres de arroz integral
- Salada verde à vontade
- 1 concha de feijão

Lanche da Tarde (16h00)
- Whey protein
- 1 fruta

Jantar (19h00)
- 150g de peixe
- Legumes grelhados
- Salada verde`}
                    placeholder="Descreva o plano alimentar completo..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet-notes">Observações Nutricionais</Label>
                  <Textarea
                    id="diet-notes"
                    rows={3}
                    defaultValue="Déficit calórico moderado para perda de gordura mantendo massa muscular."
                    placeholder="Adicione observações sobre a dieta..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/coach/student/${id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="gradient-primary" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoachStudentEdit;

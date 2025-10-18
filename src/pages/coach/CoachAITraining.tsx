import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import CoachNavbar from "@/components/CoachNavbar";

const CoachAITraining = () => {
  const handleSave = () => {
    toast.success("Método salvo com sucesso!");
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Treinar IA</h1>
          </div>
          <p className="text-muted-foreground">Configure seus métodos de treino e nutrição</p>
        </div>

        {/* Info Alert */}
        <Card className="glass-card border-secondary/20 bg-secondary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Recurso em Desenvolvimento</h3>
                <p className="text-sm text-muted-foreground">
                  Aqui você poderá treinar a IA futuramente com seus próprios métodos de treino e dieta.
                  Os campos abaixo são apenas visuais e não estão funcionais ainda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Method */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Método de Treino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="training-philosophy">Filosofia de Treino</Label>
              <Textarea
                id="training-philosophy"
                placeholder="Descreva sua abordagem e filosofia de treino... Ex: Foco em movimentos compostos, progressão linear, etc."
                rows={6}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-principles">Princípios Fundamentais</Label>
              <Textarea
                id="training-principles"
                placeholder="Liste seus princípios fundamentais... Ex: Técnica perfeita antes de carga, volume antes de intensidade, etc."
                rows={6}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-variations">Variações e Adaptações</Label>
              <Textarea
                id="training-variations"
                placeholder="Como você adapta treinos para diferentes níveis e objetivos..."
                rows={6}
                disabled
                className="bg-muted/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Method */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Método Nutricional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nutrition-philosophy">Filosofia Nutricional</Label>
              <Textarea
                id="nutrition-philosophy"
                placeholder="Descreva sua abordagem nutricional... Ex: Dieta flexível, foco em alimentos naturais, etc."
                rows={6}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="macro-distribution">Distribuição de Macros</Label>
              <Textarea
                id="macro-distribution"
                placeholder="Como você calcula e distribui macronutrientes..."
                rows={6}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-timing">Timing de Refeições</Label>
              <Textarea
                id="meal-timing"
                placeholder="Suas recomendações sobre horários e frequência de refeições..."
                rows={6}
                disabled
                className="bg-muted/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled>
            Resetar
          </Button>
          <Button onClick={handleSave} className="gradient-primary" disabled>
            <Save className="w-4 h-4 mr-2" />
            Salvar Método
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CoachAITraining;

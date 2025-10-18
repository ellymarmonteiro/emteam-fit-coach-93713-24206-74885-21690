import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dumbbell } from "lucide-react";
import Navbar from "@/components/Navbar";

const workoutPlan = [
  {
    day: "Segunda-feira",
    name: "Treino A - Peito e Tríceps",
    exercises: [
      { name: "Supino Reto", sets: "4x10", notes: "Descanso: 90s" },
      { name: "Supino Inclinado", sets: "3x12", notes: "Descanso: 60s" },
      { name: "Crucifixo", sets: "3x15", notes: "Descanso: 60s" },
      { name: "Tríceps Testa", sets: "3x12", notes: "Descanso: 60s" },
      { name: "Tríceps Corda", sets: "3x15", notes: "Descanso: 45s" },
    ],
  },
  {
    day: "Terça-feira",
    name: "Treino B - Costas e Bíceps",
    exercises: [
      { name: "Barra Fixa", sets: "4x8", notes: "Use auxílio se necessário" },
      { name: "Remada Curvada", sets: "4x10", notes: "Descanso: 90s" },
      { name: "Pulldown", sets: "3x12", notes: "Descanso: 60s" },
      { name: "Rosca Direta", sets: "3x12", notes: "Descanso: 60s" },
      { name: "Rosca Martelo", sets: "3x15", notes: "Descanso: 45s" },
    ],
  },
  {
    day: "Quarta-feira",
    name: "Descanso ou Cardio Leve",
    exercises: [],
  },
  {
    day: "Quinta-feira",
    name: "Treino C - Pernas",
    exercises: [
      { name: "Agachamento Livre", sets: "4x10", notes: "Descanso: 2min" },
      { name: "Leg Press", sets: "4x12", notes: "Descanso: 90s" },
      { name: "Cadeira Extensora", sets: "3x15", notes: "Descanso: 60s" },
      { name: "Cadeira Flexora", sets: "3x15", notes: "Descanso: 60s" },
      { name: "Panturrilha", sets: "4x20", notes: "Descanso: 45s" },
    ],
  },
  {
    day: "Sexta-feira",
    name: "Treino D - Ombros e Abdômen",
    exercises: [
      { name: "Desenvolvimento", sets: "4x10", notes: "Descanso: 90s" },
      { name: "Elevação Lateral", sets: "3x15", notes: "Descanso: 60s" },
      { name: "Elevação Frontal", sets: "3x12", notes: "Descanso: 60s" },
      { name: "Abdominal Supra", sets: "3x20", notes: "Descanso: 30s" },
      { name: "Prancha", sets: "3x60s", notes: "Descanso: 45s" },
    ],
  },
];

const Workouts = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Meus Treinos</h1>
          </div>
          <p className="text-muted-foreground">Seu plano de treino personalizado</p>
        </div>

        {/* Workout Plan */}
        <Accordion type="single" collapsible className="space-y-4">
          {workoutPlan.map((workout, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-0">
              <Card className="glass-card">
                <AccordionTrigger className="hover:no-underline px-6 py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <h3 className="text-xl font-semibold">{workout.day}</h3>
                      <p className="text-sm text-muted-foreground">{workout.name}</p>
                    </div>
                    {workout.exercises.length > 0 && (
                      <Badge variant="secondary">{workout.exercises.length} exercícios</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {workout.exercises.length > 0 ? (
                    <div className="px-6 pb-4 space-y-3">
                      {workout.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{exercise.notes}</p>
                            </div>
                            <Badge className="gradient-primary">{exercise.sets}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 pb-4">
                      <p className="text-muted-foreground text-center py-8">
                        Dia de descanso ou cardio leve 🌟
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Notes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Observações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Sempre faça aquecimento antes de iniciar os treinos</p>
            <p>• Mantenha a técnica correta em todos os exercícios</p>
            <p>• Hidrate-se durante o treino</p>
            <p>• Respeite os tempos de descanso indicados</p>
            <p>• Em caso de dor, pare o exercício e consulte um profissional</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Workouts;

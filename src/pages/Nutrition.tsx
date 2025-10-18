import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Apple, Coffee, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import Navbar from "@/components/Navbar";

const mealPlan = [
  {
    meal: "Café da Manhã",
    icon: Coffee,
    time: "07:00",
    foods: [
      { name: "Aveia", amount: "50g" },
      { name: "Banana", amount: "1 unidade" },
      { name: "Pasta de amendoim", amount: "1 colher de sopa" },
      { name: "Leite desnatado", amount: "200ml" },
    ],
    notes: "Prepare a aveia com leite. Adicione banana em rodelas e pasta de amendoim.",
  },
  {
    meal: "Lanche da Manhã",
    icon: Sunrise,
    time: "10:00",
    foods: [
      { name: "Iogurte grego", amount: "150g" },
      { name: "Granola", amount: "30g" },
      { name: "Mel", amount: "1 colher de chá" },
    ],
    notes: "Misture o iogurte com a granola e finalize com mel.",
  },
  {
    meal: "Almoço",
    icon: Sun,
    time: "12:30",
    foods: [
      { name: "Arroz integral", amount: "100g (cozido)" },
      { name: "Feijão", amount: "80g" },
      { name: "Peito de frango grelhado", amount: "150g" },
      { name: "Brócolis", amount: "100g" },
      { name: "Salada verde", amount: "À vontade" },
      { name: "Azeite extra virgem", amount: "1 colher de sopa" },
    ],
    notes: "Tempere a salada com limão e azeite. Evite frituras.",
  },
  {
    meal: "Lanche da Tarde",
    icon: Sunset,
    time: "16:00",
    foods: [
      { name: "Batata doce", amount: "150g (cozida)" },
      { name: "Atum em conserva", amount: "1 lata" },
    ],
    notes: "Drene bem o atum. Pode adicionar ervas a gosto.",
  },
  {
    meal: "Jantar",
    icon: Moon,
    time: "19:30",
    foods: [
      { name: "Salmão grelhado", amount: "150g" },
      { name: "Batata inglesa", amount: "100g (cozida)" },
      { name: "Aspargos", amount: "100g" },
      { name: "Salada mista", amount: "À vontade" },
    ],
    notes: "Tempere o salmão com limão e ervas. Prefira cozimento no vapor.",
  },
  {
    meal: "Ceia",
    icon: Moon,
    time: "22:00",
    foods: [
      { name: "Queijo cottage", amount: "100g" },
      { name: "Castanhas", amount: "10 unidades" },
    ],
    notes: "Refeição leve para não atrapalhar o sono.",
  },
];

const Nutrition = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Apple className="w-8 h-8 text-secondary" />
            <h1 className="text-4xl font-bold">Meu Plano Alimentar</h1>
          </div>
          <p className="text-muted-foreground">Seu plano nutricional personalizado</p>
        </div>

        {/* Meal Plan */}
        <Accordion type="single" collapsible className="space-y-4">
          {mealPlan.map((meal, index) => {
            const Icon = meal.icon;
            return (
              <AccordionItem key={index} value={`meal-${index}`} className="border-0">
                <Card className="glass-card">
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="flex items-center gap-4 w-full pr-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-xl font-semibold">{meal.meal}</h3>
                        <p className="text-sm text-muted-foreground">{meal.time}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-4 space-y-4">
                      <div className="space-y-2">
                        {meal.foods.map((food, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/50"
                          >
                            <span className="font-medium">{food.name}</span>
                            <span className="text-primary font-semibold">{food.amount}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Observação:</span> {meal.notes}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Nutritional Guidelines */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Orientações Nutricionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Beba pelo menos 2,5 litros de água por dia</p>
            <p>• Evite alimentos processados e frituras</p>
            <p>• Prefira temperos naturais</p>
            <p>• Mantenha os horários das refeições regulares</p>
            <p>• Mastigue bem os alimentos</p>
            <p>• Em caso de dúvidas, consulte seu nutricionista</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Nutrition;

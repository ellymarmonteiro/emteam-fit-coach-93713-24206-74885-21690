import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CoachNavbar from "@/components/CoachNavbar";
import { useState, useEffect } from "react";

// Mock data for different students
const studentsData: Record<string, any> = {
  joao: {
    name: "João Silva",
    initialWeight: 85,
    currentWeight: 78,
    goal: 75,
    weightData: [
      { date: "Jan", weight: 85 },
      { date: "Fev", weight: 83 },
      { date: "Mar", weight: 81 },
      { date: "Abr", weight: 79 },
      { date: "Mai", weight: 78 },
    ],
  },
  maria: {
    name: "Maria Santos",
    initialWeight: 70,
    currentWeight: 65,
    goal: 62,
    weightData: [
      { date: "Jan", weight: 70 },
      { date: "Fev", weight: 68 },
      { date: "Mar", weight: 67 },
      { date: "Abr", weight: 66 },
      { date: "Mai", weight: 65 },
    ],
  },
  pedro: {
    name: "Pedro Costa",
    initialWeight: 90,
    currentWeight: 85,
    goal: 80,
    weightData: [
      { date: "Jan", weight: 90 },
      { date: "Fev", weight: 88 },
      { date: "Mar", weight: 87 },
      { date: "Abr", weight: 86 },
      { date: "Mai", weight: 85 },
    ],
  },
  ana: {
    name: "Ana Oliveira",
    initialWeight: 60,
    currentWeight: 58,
    goal: 55,
    weightData: [
      { date: "Jan", weight: 60 },
      { date: "Fev", weight: 59 },
      { date: "Mar", weight: 59 },
      { date: "Abr", weight: 58 },
      { date: "Mai", weight: 58 },
    ],
  },
};

const CoachProgress = () => {
  const [selectedStudent, setSelectedStudent] = useState("joao");
  const [studentData, setStudentData] = useState(studentsData.joao);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading when student changes
    setIsLoading(true);
    setTimeout(() => {
      setStudentData(studentsData[selectedStudent]);
      setIsLoading(false);
    }, 300);
  }, [selectedStudent]);

  const lossTotal = studentData.initialWeight - studentData.currentWeight;
  const progressPercent = Math.round(
    ((studentData.initialWeight - studentData.currentWeight) / 
    (studentData.initialWeight - studentData.goal)) * 100
  );

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Evolução dos Alunos</h1>
            </div>
            <p className="text-muted-foreground">Acompanhe o progresso de cada aluno</p>
          </div>

          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="joao">João Silva</SelectItem>
              <SelectItem value="maria">Maria Santos</SelectItem>
              <SelectItem value="pedro">Pedro Costa</SelectItem>
              <SelectItem value="ana">Ana Oliveira</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student Stats */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-4 animate-fade-in">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Peso Inicial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.initialWeight} kg</div>
                  <p className="text-xs text-muted-foreground">Janeiro 2025</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.currentWeight} kg</div>
                  <p className="text-xs text-muted-foreground">Maio 2025</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Perda Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">-{lossTotal} kg</div>
                  <p className="text-xs text-muted-foreground">Em 4 meses</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Meta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.goal} kg</div>
                  <p className="text-xs text-muted-foreground">{progressPercent}% alcançado</p>
                </CardContent>
              </Card>
            </div>

            {/* Weight Chart */}
            <Card className="glass-card animate-fade-in">
              <CardHeader>
                <CardTitle>Evolução de Peso</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={studentData.weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 20%)" />
                <XAxis dataKey="date" stroke="hsl(240 5% 65%)" />
                <YAxis stroke="hsl(240 5% 65%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 8% 12%)",
                    border: "1px solid hsl(240 6% 20%)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(263, 70%, 60%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(263, 70%, 60%)", r: 6 }}
                />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Measurements History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Histórico de Medidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Peso</th>
                    <th className="text-left p-3">% Gordura</th>
                    <th className="text-left p-3">Peito</th>
                    <th className="text-left p-3">Cintura</th>
                    <th className="text-left p-3">Quadril</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="p-3">15/05/2025</td>
                    <td className="p-3">78 kg</td>
                    <td className="p-3">18%</td>
                    <td className="p-3">98 cm</td>
                    <td className="p-3">82 cm</td>
                    <td className="p-3">95 cm</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">15/04/2025</td>
                    <td className="p-3">80 kg</td>
                    <td className="p-3">19%</td>
                    <td className="p-3">99 cm</td>
                    <td className="p-3">84 cm</td>
                    <td className="p-3">96 cm</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">15/03/2025</td>
                    <td className="p-3">81 kg</td>
                    <td className="p-3">20%</td>
                    <td className="p-3">100 cm</td>
                    <td className="p-3">86 cm</td>
                    <td className="p-3">97 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Training Adherence */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Adesão ao Treino</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Semana 1</span>
                  <span className="font-semibold">5/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: "100%" }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Semana 2</span>
                  <span className="font-semibold">4/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: "80%" }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Semana 3</span>
                  <span className="font-semibold">5/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: "100%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notas do Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Excelente progresso no último mês</p>
              <p>• Aumentar carga nos exercícios de peito</p>
              <p>• Considerar ajuste na dieta para manter déficit</p>
              <p>• Adicionar mais cardio se estabilizar o peso</p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CoachProgress;

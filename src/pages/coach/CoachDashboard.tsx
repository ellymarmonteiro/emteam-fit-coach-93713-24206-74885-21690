import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Activity, Star, ClipboardList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CoachNavbar from "@/components/CoachNavbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const mockData = [
  { month: "Jan", students: 15 },
  { month: "Fev", students: 20 },
  { month: "Mar", students: 25 },
  { month: "Abr", students: 28 },
  { month: "Mai", students: 32 },
];

const CoachDashboard = () => {
  const navigate = useNavigate();
  const [pendingPlansCount, setPendingPlansCount] = useState(0);

  useEffect(() => {
    loadPendingPlansCount();
  }, []);

  const loadPendingPlansCount = async () => {
    const { count } = await supabase
      .from('plans')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    setPendingPlansCount(count || 0);
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Dashboard do Coach</h1>
          <p className="text-muted-foreground">Gerencie seus alunos e métodos</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card 
            className="glass-card cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/coach/students')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+4 este mês</p>
            </CardContent>
          </Card>

          <Card 
            className="glass-card cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/coach/students?filter=active')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <Activity className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">87.5% de adesão</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Média de Progresso</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">Metas alcançadas</p>
            </CardContent>
          </Card>

          <Card 
            className="glass-card cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/coach/pending-plans')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Planos Pendentes</CardTitle>
              <ClipboardList className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPlansCount}</div>
              <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
              <Star className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">De 5.0 estrelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Crescimento de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 20%)" />
                <XAxis dataKey="month" stroke="hsl(240 5% 65%)" />
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
                  dataKey="students"
                  stroke="hsl(263, 70%, 60%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(263, 70%, 60%)", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/coach/students">
            <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
              <CardHeader>
                <Users className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Gerenciar Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Veja e edite informações dos seus alunos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/coach/ai-training">
            <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
              <CardHeader>
                <Activity className="w-12 h-12 mb-4 text-secondary" />
                <CardTitle>Treinar IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure seus métodos personalizados</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/coach/progress">
            <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
              <CardHeader>
                <TrendingUp className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Evolução</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Acompanhe o progresso dos alunos</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CoachDashboard;

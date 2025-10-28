import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Apple, TrendingUp, Users, User, Gift, ClipboardCheck, Bell, AlertCircle, Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "@/components/Navbar";
import { PlanStatus } from "@/components/PlanStatus";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const mockData = [
  { date: "Jan", weight: 85 },
  { date: "Fev", weight: 83 },
  { date: "Mar", weight: 81 },
  { date: "Abr", weight: 79 },
  { date: "Mai", weight: 78 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [hasAnamnese, setHasAnamnese] = useState(false);
  const [hasEvaluation, setHasEvaluation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verificar status da assinatura
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      setSubscriptionStatus(profile?.subscription_status || null);

      // Verificar anamnese
      const { data: anamnese } = await supabase
        .from('anamnese')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasAnamnese(!!anamnese);

      // Verificar avaliação
      const { data: evaluation } = await supabase
        .from('evaluations')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasEvaluation(!!evaluation);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const needsOnboarding = subscriptionStatus !== 'active' || !hasAnamnese || !hasEvaluation;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
        {/* Banner de Orientação Pós-Cadastro */}
        {needsOnboarding && !loading && (
          <div className="max-w-7xl mx-auto mb-6">
            <Card className="glass-card border-2 border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">🎯 Complete seu Perfil</h2>
                    <p className="text-muted-foreground">
                      Para começar a treinar com planos personalizados, você precisa completar estas etapas:
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {subscriptionStatus !== 'active' && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-destructive font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Assinar o Plano</p>
                        <p className="text-sm text-muted-foreground">Necessário para gerar seus treinos personalizados</p>
                      </div>
                      <Button onClick={() => navigate('/subscription')} className="gradient-primary">
                        Assinar Agora
                      </Button>
                    </div>
                  )}
                  
                  {!hasAnamnese && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Preencher Anamnese</p>
                        <p className="text-sm text-muted-foreground">Informações sobre sua saúde e objetivos</p>
                      </div>
                      <Button onClick={() => navigate('/onboarding/assessment')} variant="outline">
                        Preencher
                      </Button>
                    </div>
                  )}
                  
                  {!hasEvaluation && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-secondary font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Fazer Avaliação Inicial</p>
                        <p className="text-sm text-muted-foreground">Medidas e fotos de referência</p>
                      </div>
                      <Button onClick={() => navigate('/evaluation')} variant="outline">
                        Avaliar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e acesse seus planos</p>
          </div>

          {/* Stats Grid */}
          <PlanStatus />

          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
                <TrendingUp className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78 kg</div>
                <p className="text-xs text-muted-foreground">Meta: 75 kg</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Treinos Semana</CardTitle>
                <Activity className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4/5</div>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Dias de Streak</CardTitle>
                <TrendingUp className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Continue assim!</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assinatura</CardTitle>
                <Gift className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Ativa</div>
                <p className="text-xs text-muted-foreground">Renovação em 15 dias</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Evolução de Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData}>
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

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Quick Actions */}
            <Link to="/chat">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Chat com IA</h3>
                  <p className="text-sm text-muted-foreground">
                    Converse sobre treinos e alimentação
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/workouts">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader>
                  <Activity className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Meus Treinos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Acesse seus treinos personalizados</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nutrition">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader>
                  <Apple className="w-12 h-12 mb-4 text-secondary" />
                  <CardTitle>Meu Plano Alimentar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Veja seu plano nutricional</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/referrals">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader>
                  <Users className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Indicações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Ganhe descontos indicando amigos</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/subscription">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader>
                  <Gift className="w-12 h-12 mb-4 text-secondary" />
                  <CardTitle>Minha Assinatura</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gerencie sua assinatura e pagamentos</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Bottom Navigation */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/measurements">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Minhas Medidas</h3>
                    <p className="text-sm text-muted-foreground">Acompanhe suas medidas</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/evaluation">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <ClipboardCheck className="w-8 h-8 text-secondary" />
                  <div>
                    <h3 className="font-semibold">Avaliação Física</h3>
                    <p className="text-sm text-muted-foreground">Registre sua evolução</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/notifications">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <Bell className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Notificações</h3>
                    <p className="text-sm text-muted-foreground">Configure lembretes</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile">
              <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <User className="w-8 h-8 text-secondary" />
                  <div>
                    <h3 className="font-semibold">Meu Perfil</h3>
                    <p className="text-sm text-muted-foreground">Gerencie suas informações</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

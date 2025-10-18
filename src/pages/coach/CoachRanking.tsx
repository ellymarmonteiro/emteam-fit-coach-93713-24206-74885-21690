import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target } from "lucide-react";
import { useState, useEffect } from "react";
import CoachNavbar from "@/components/CoachNavbar";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RankingStudent {
  id: string;
  full_name: string;
  goal: string;
  progress_percentage: number;
  last_evaluation: string;
  weight_change: number;
  bmi_change: number;
}

const CoachRanking = () => {
  const [ranking, setRanking] = useState<RankingStudent[]>([]);
  const [periodFilter, setPeriodFilter] = useState(30);
  const [goalFilter, setGoalFilter] = useState("all");

  useEffect(() => {
    loadRanking();
  }, [periodFilter, goalFilter]);

  const loadRanking = async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodFilter);

    let query = supabase
      .from('evaluations')
      .select(`
        user_id,
        weight,
        bmi,
        goal,
        created_at,
        profiles!inner (
          id,
          full_name
        )
      `)
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false });

    const { data } = await query;

    if (data) {
      // Group by user and calculate progress
      const userMap = new Map();
      
      data.forEach((evaluation: any) => {
        const userId = evaluation.user_id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            full_name: evaluation.profiles.full_name,
            goal: evaluation.goal,
            evaluations: []
          });
        }
        userMap.get(userId).evaluations.push(evaluation);
      });

      // Calculate progress for each user
      const rankingData: RankingStudent[] = [];
      userMap.forEach((user) => {
        if (user.evaluations.length >= 2) {
          const latest = user.evaluations[0];
          const oldest = user.evaluations[user.evaluations.length - 1];
          
          const weightChange = oldest.weight - latest.weight;
          const bmiChange = oldest.bmi - latest.bmi;
          
          // Calculate progress based on goal
          let progressPercentage = 0;
          if (user.goal === 'weight_loss' || user.goal === 'conditioning') {
            progressPercentage = weightChange > 0 ? (weightChange / oldest.weight) * 100 : 0;
          } else if (user.goal === 'muscle_gain') {
            progressPercentage = weightChange < 0 ? Math.abs((weightChange / oldest.weight) * 100) : 0;
          }

          if (goalFilter === "all" || user.goal === goalFilter) {
            rankingData.push({
              id: user.id,
              full_name: user.full_name,
              goal: user.goal,
              progress_percentage: Math.round(progressPercentage * 10) / 10,
              last_evaluation: latest.created_at,
              weight_change: Math.round(weightChange * 10) / 10,
              bmi_change: Math.round(bmiChange * 10) / 10
            });
          }
        }
      });

      // Sort by progress
      rankingData.sort((a, b) => b.progress_percentage - a.progress_percentage);
      setRanking(rankingData);
    }
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      weight_loss: 'Emagrecimento',
      muscle_gain: 'Ganho de Massa',
      conditioning: 'Condicionamento',
      maintenance: 'Manutenção'
    };
    return labels[goal] || goal;
  };

  const getMedalColor = (position: number) => {
    if (position === 0) return "text-yellow-500";
    if (position === 1) return "text-gray-400";
    if (position === 2) return "text-orange-500";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Ranking de Evolução</h1>
            </div>
            <p className="text-muted-foreground">
              Acompanhe o progresso dos alunos com melhor desempenho
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriodFilter(7)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    periodFilter === 7 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  7 dias
                </button>
                <button
                  onClick={() => setPeriodFilter(30)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    periodFilter === 30 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  30 dias
                </button>
                <button
                  onClick={() => setPeriodFilter(90)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    periodFilter === 90 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  90 dias
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objetivo</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGoalFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    goalFilter === "all" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setGoalFilter("weight_loss")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    goalFilter === "weight_loss" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Emagrecimento
                </button>
                <button
                  onClick={() => setGoalFilter("muscle_gain")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    goalFilter === "muscle_gain" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Hipertrofia
                </button>
                <button
                  onClick={() => setGoalFilter("conditioning")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    goalFilter === "conditioning" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Condicionamento
                </button>
              </div>
            </div>
          </div>

          {/* Ranking List */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ranking.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index < 3 ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Trophy className={`w-5 h-5 ${getMedalColor(index)}`} />
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="gradient-primary text-white">
                        {student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{student.full_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span>{getGoalLabel(student.goal)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">
                        +{student.progress_percentage}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.weight_change > 0 ? `-${student.weight_change}kg` : `+${Math.abs(student.weight_change)}kg`}
                      </p>
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <p>Última avaliação:</p>
                      <p>{format(new Date(student.last_evaluation), "dd/MM/yyyy", { locale: ptBR })}</p>
                    </div>
                  </div>
                ))}
                {ranking.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum dado disponível para o período selecionado. Os alunos precisam ter pelo menos 2 avaliações para aparecer no ranking.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachRanking;

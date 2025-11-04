import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, Calendar, CheckCircle, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Plan {
  id: string;
  user_id: string;
  type: string;
  content: any;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const CoachPendingPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadPendingPlans();
  }, []);

  const loadPendingPlans = async () => {
    try {
      // Buscar planos pendentes
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      // Buscar perfis dos usuários
      if (plansData && plansData.length > 0) {
        const userIds = [...new Set(plansData.map(p => p.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combinar dados
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        const combinedData = plansData.map(plan => ({
          ...plan,
          profiles: profilesMap.get(plan.user_id) || { full_name: 'Desconhecido', email: '' }
        }));

        setPlans(combinedData as any);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error('Erro ao carregar planos pendentes:', error);
      toast.error('Erro ao carregar planos pendentes');
    } finally {
      setLoading(false);
    }
  };

  const approvePlan = async (planId: string, userId: string) => {
    try {
      console.log('Aprovando plano:', planId);
      
      const { data, error } = await supabase.functions.invoke('coach-approve-plan', {
        body: { 
          plan_id: planId,
          action: 'approve'
        }
      });

      if (error) {
        console.error('Erro ao aprovar plano:', error);
        throw error;
      }

      console.log('Plano aprovado com sucesso:', data);
      toast.success('✅ Plano aprovado com sucesso!');
      
      // Aguardar um pouco antes de recarregar
      setTimeout(() => {
        loadPendingPlans();
        setSelectedPlan(null);
      }, 500);
    } catch (error: any) {
      console.error('Erro ao aprovar plano:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      toast.error(`Erro ao aprovar plano: ${errorMessage}`);
    }
  };

  const renderPlanContent = (plan: Plan) => {
    if (plan.type === 'workout') {
      const content = plan.content as any;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Objetivo</p>
              <p className="font-semibold">{content.objetivo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frequência</p>
              <p className="font-semibold">{content.frequencia}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Treinos da Semana</h4>
            {content.treinos?.map((treino: any, idx: number) => (
              <Card key={idx} className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {treino.dia} - {treino.foco}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {treino.exercicios?.map((ex: any, exIdx: number) => (
                      <div key={exIdx} className="text-sm p-2 bg-muted/50 rounded">
                        <span className="font-medium">{ex.nome}</span>
                        <span className="text-muted-foreground ml-2">
                          {ex.series}x{ex.repeticoes} - {ex.descanso}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {content.observacoes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Observações</h4>
                <p className="text-sm text-muted-foreground">{content.observacoes}</p>
              </div>
            </>
          )}
        </div>
      );
    } else {
      const content = plan.content as any;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Objetivo</p>
              <p className="font-semibold">{content.objetivo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Calorias Diárias</p>
              <p className="font-semibold">{content.calorias_diarias}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Refeições</h4>
            {content.refeicoes?.map((refeicao: any, idx: number) => (
              <Card key={idx} className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{refeicao.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {refeicao.opcoes?.map((opcao: string, opIdx: number) => (
                      <p key={opIdx} className="text-sm">• {opcao}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {content.observacoes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Observações</h4>
                <p className="text-sm text-muted-foreground">{content.observacoes}</p>
              </div>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-primary" />
              Planos Pendentes de Aprovação
            </h1>
            <p className="text-muted-foreground">Revise e aprove os planos gerados para seus alunos</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/coach/dashboard")}>
            Voltar
          </Button>
        </div>

        {loading ? (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Carregando planos...</p>
          </Card>
        ) : plans.length === 0 ? (
          <Card className="glass-card p-8 text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tudo em dia!</h3>
            <p className="text-muted-foreground">Não há planos pendentes de aprovação no momento.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Lista de Planos</h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`glass-card cursor-pointer hover:border-primary/50 transition-colors ${
                        selectedPlan?.id === plan.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{plan.profiles.full_name}</p>
                            <p className="text-sm text-muted-foreground">{plan.profiles.email}</p>
                          </div>
                          <Badge variant={plan.type === 'workout' ? 'default' : 'secondary'}>
                            {plan.type === 'workout' ? 'Treino' : 'Nutrição'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Criado em {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              {selectedPlan ? (
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedPlan.profiles.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedPlan.type === 'workout' ? 'Plano de Treino' : 'Plano Alimentar'}
                        </p>
                      </div>
                      <Badge>{selectedPlan.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] mb-4">
                      {renderPlanContent(selectedPlan)}
                    </ScrollArea>
                    
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gradient-primary"
                        onClick={() => approvePlan(selectedPlan.id, selectedPlan.user_id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar e Liberar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/coach/student/${selectedPlan.user_id}/edit`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card p-8 text-center h-full flex items-center justify-center">
                  <div>
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecione um plano para visualizar os detalhes
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachPendingPlans;
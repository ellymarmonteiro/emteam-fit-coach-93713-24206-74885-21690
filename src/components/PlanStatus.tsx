import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const PlanStatus = () => {
  const [planStatus, setPlanStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanStatus();
  }, []);

  const loadPlanStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_status')
        .eq('id', user.id)
        .single();

      setPlanStatus(profile?.plan_status || null);
    } catch (error) {
      console.error('Erro ao carregar status do plano:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (planStatus === 'pending') {
    return (
      <Card className="glass-card border-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-secondary" />
            Planos em Preparação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2 animate-pulse" />
            <div>
              <p className="font-medium">Seu plano está sendo criado!</p>
              <p className="text-sm text-muted-foreground">
                Nosso sistema está gerando seus planos personalizados de treino e alimentação.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2 animate-pulse" />
            <div>
              <p className="font-medium">Aprovação do Coach</p>
              <p className="text-sm text-muted-foreground">
                Após a geração, seu coach irá revisar e aprovar seus planos.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-2" />
            <div>
              <p className="font-medium text-muted-foreground">Liberação</p>
              <p className="text-sm text-muted-foreground">
                Você receberá uma notificação assim que estiver pronto! 💪
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-sm text-center">
              ⏱️ <strong>Prazo:</strong> Seus planos serão liberados em até 48 horas após a confirmação da assinatura.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (planStatus === 'approved') {
    return (
      <Card className="glass-card border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            Planos Liberados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            🎉 Seus planos foram aprovados e estão prontos para uso!
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <FileText className="w-8 h-8 text-primary mb-2" />
              <h4 className="font-semibold mb-1">Plano de Treino</h4>
              <p className="text-sm text-muted-foreground">
                Acesse seus treinos personalizados
              </p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <FileText className="w-8 h-8 text-secondary mb-2" />
              <h4 className="font-semibold mb-1">Plano Alimentar</h4>
              <p className="text-sm text-muted-foreground">
                Veja seu plano nutricional
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
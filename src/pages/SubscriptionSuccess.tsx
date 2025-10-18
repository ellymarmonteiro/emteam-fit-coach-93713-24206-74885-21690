import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        toast.error("Sessão não encontrada");
        navigate("/subscription");
        return;
      }

      try {
        // Verificar se o usuário está logado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Usuário não encontrado");
          navigate("/auth");
          return;
        }

        // Verificar status da assinatura no perfil
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar assinatura:', error);
          throw error;
        }

        if (profile && profile.subscription_status === 'active') {
          setVerified(true);
          toast.success("Assinatura confirmada com sucesso!");
        } else {
          // Aguardar webhook processar
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        toast.error("Erro ao verificar pagamento. Redirecionando...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams, navigate]);

  if (loading || !verified) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-bold">Processando pagamento...</h2>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos seu pagamento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Card */}
        <Card className="glass-card border-2 border-green-500/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-3xl">Pagamento Confirmado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg">
                Sua assinatura foi ativada com sucesso! 🎉
              </p>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold mb-2">O que acontece agora?</h3>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li>✓ Sua assinatura está ativa</li>
                  <li>🤖 A IA está gerando seus planos personalizados</li>
                  <li>👨‍⚕️ Um coach irá revisar e aprovar em até 48h</li>
                  <li>📱 Você receberá uma notificação quando estiver pronto</li>
                  <li>💪 Então poderá começar seu treino!</li>
                </ul>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Enquanto isso, você pode:</p>
                <ul className="text-left space-y-1">
                  <li>• Completar seu perfil e anamnese</li>
                  <li>• Fazer sua primeira avaliação física</li>
                  <li>• Explorar o dashboard</li>
                  <li>• Indicar amigos e ganhar descontos</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full gradient-primary text-lg py-6"
            >
              Ir para o Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-card bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Precisa de ajuda?</h3>
            <p className="text-muted-foreground">
              Entre em contato através da página de suporte ou acesse nossas notificações para acompanhar o status dos seus planos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;

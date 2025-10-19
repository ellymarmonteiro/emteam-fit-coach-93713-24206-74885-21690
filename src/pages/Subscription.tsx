import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Crown, Gift, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Price ID do produto no Stripe (deve ser configurado no painel do Stripe)
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1234567890';

const Subscription = () => {
  const [coupon, setCoupon] = useState("");
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponInfo, setCouponInfo] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [discountRemaining, setDiscountRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, discount_remaining')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSubscriptionStatus(profile.subscription_status);
        setDiscountRemaining(profile.discount_remaining || 0);
      }
    } catch (error) {
      console.error('Erro ao carregar status da assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }

    setValidatingCoupon(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { coupon_code: coupon.trim() }
      });

      if (error) throw error;

      if (data.valid) {
        setCouponValid(true);
        setCouponInfo(data);
        const discount = data.percent_off 
          ? `${data.percent_off}% de desconto` 
          : `R$ ${(data.amount_off / 100).toFixed(2)} de desconto`;
        toast.success(`Cupom válido! ${discount}`);
      } else {
        setCouponValid(false);
        setCouponInfo(null);
        toast.error("Cupom inválido ou expirado");
      }
    } catch (error) {
      console.error('Erro ao validar cupom:', error);
      toast.error("Erro ao validar cupom. Tente novamente.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubscribe = async () => {
    setProcessingCheckout(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para assinar");
        navigate("/auth");
        return;
      }

      // Criar checkout session no Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          user_id: user.id,
          price_id: STRIPE_PRICE_ID,
          coupon_code: couponValid ? coupon.trim() : null,
        }
      });

      if (error) throw error;

      if (data && data.url) {
        // Log para debug
        console.log('Redirecionando para checkout:', data.url);
        
        // Redirecionar para o Stripe Checkout na mesma janela
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada pelo servidor');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      setProcessingCheckout(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Assinatura cancelada com sucesso");
      setSubscriptionStatus('cancelled');
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast.error("Erro ao cancelar assinatura. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // Se já tem assinatura ativa, mostrar gerenciamento
  if (subscriptionStatus === 'active') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Crown className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Gerenciar Assinatura</h1>
            <p className="text-muted-foreground">Gerencie sua assinatura e pagamentos</p>
          </div>

          {/* Status Card */}
          <Card className="glass-card border-2 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-primary" />
                Assinatura Ativa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">Plano Mensal</p>
                    <p className="text-sm text-muted-foreground">Renovação automática mensal</p>
                  </div>
                  <p className="text-2xl font-bold">R$ 49,90<span className="text-sm text-muted-foreground">/mês</span></p>
                </div>

                {discountRemaining > 0 && (
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <Gift className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-semibold">Desconto Ativo</p>
                      <p className="text-sm text-muted-foreground">
                        🎁 Você tem R$10 de desconto ativo nas próximas {discountRemaining} cobrança{discountRemaining > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Treinos personalizados baseados em IA</p>
                  <p>✓ Planos alimentares sob medida</p>
                  <p>✓ Acompanhamento de progresso em tempo real</p>
                  <p>✓ Avaliações físicas mensais</p>
                  <p>✓ Suporte especializado</p>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="pt-4 border-t border-border">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Cancelar Assinatura
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        Cancelar Assinatura?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>Tem certeza que deseja cancelar sua assinatura?</p>
                        <p className="font-semibold">Você perderá acesso a:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Treinos personalizados</li>
                          <li>Planos alimentares</li>
                          <li>Acompanhamento de progresso</li>
                          <li>Suporte do coach</li>
                        </ul>
                        <p className="text-destructive font-semibold mt-4">Esta ação não pode ser desfeita.</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Não, manter assinatura</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
                        Sim, cancelar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Se assinatura foi cancelada
  if (subscriptionStatus === 'cancelled') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="glass-card border-2 border-destructive/50">
            <CardHeader className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <CardTitle>Assinatura Cancelada</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Sua assinatura foi cancelada. Para continuar aproveitando todos os benefícios, assine novamente.
              </p>
              <Button onClick={() => window.location.reload()} className="w-full gradient-primary">
                Assinar Novamente
              </Button>
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Página de assinatura original para novos usuários
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Crown className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Assine o EMteam Digital</h1>
          <p className="text-muted-foreground">Transforme seu corpo com acompanhamento profissional</p>
        </div>

        {/* Plan Card */}
        <Card className="glass-card border-2 border-primary/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">Plano Mensal</CardTitle>
            <div className="mt-4">
              <span className="text-5xl font-bold">R$ 49,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>Treinos personalizados baseados em IA</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>Planos alimentares sob medida</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>Acompanhamento de progresso em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>Avaliações físicas mensais</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>Suporte especializado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>Acesso ilimitado ao aplicativo</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-secondary" />
                <Label htmlFor="coupon">Tem um cupom de desconto?</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Digite seu cupom (ex: TESTE100)"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setCouponValid(null);
                    setCouponInfo(null);
                  }}
                  className={
                    couponValid === true 
                      ? "border-green-500" 
                      : couponValid === false 
                      ? "border-red-500" 
                      : ""
                  }
                />
                <Button 
                  onClick={handleApplyCoupon} 
                  variant="outline"
                  disabled={validatingCoupon || !coupon.trim()}
                >
                  {validatingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              </div>
              {couponValid === true && couponInfo && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Cupom aplicado: {couponInfo.percent_off 
                    ? `${couponInfo.percent_off}% de desconto` 
                    : `R$ ${(couponInfo.amount_off / 100).toFixed(2)} de desconto`}
                </p>
              )}
              {couponValid === false && (
                <p className="text-sm text-red-600 mt-2">
                  ✗ Cupom inválido ou expirado
                </p>
              )}
            </div>

            {/* Subscribe Button */}
            <Button 
              onClick={handleSubscribe} 
              className="w-full gradient-primary text-lg py-6"
              disabled={processingCheckout}
            >
              {processingCheckout ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Assinar Agora"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Você será cobrado R$ 49,90 mensalmente. Cancele quando quiser.
            </p>
          </CardContent>
        </Card>

        {/* Guarantee */}
        <Card className="glass-card bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Garantia de 7 Dias</h3>
            <p className="text-muted-foreground">
              Não está satisfeito? Cancele dentro de 7 dias e receba 100% do seu dinheiro de volta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;

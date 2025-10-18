import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Gift, Copy, Check, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const Referrals = () => {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    discount: 0
  });

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user profile with referral code
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code, discount_remaining')
      .eq('id', user.id)
      .single();

    if (profile) {
      setReferralCode(profile.referral_code);
      const link = `${window.location.origin}/signup?indicador=${profile.referral_code}`;
      setReferralLink(link);

      // Get referrals
      const { data: referralData } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:referred_id (
            full_name,
            subscription_status
          )
        `)
        .eq('referrer_id', user.id);

      if (referralData) {
        setReferrals(referralData);
        const activeCount = referralData.filter(r => r.status === 'active').length;
        setStats({
          total: referralData.length,
          active: activeCount,
          discount: (profile.discount_remaining || 0) * 10
        });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EMteam Digital - Indicação',
          text: 'Junte-se ao EMteam Digital e ganhe R$10 de desconto!',
          url: referralLink
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Indicações</h1>
          </div>
          <p className="text-muted-foreground">Ganhe descontos indicando amigos</p>
        </div>

        {/* Referral Link Card */}
        <Card className="glass-card border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Indique e Ganhe 💰</CardTitle>
            <p className="text-sm text-muted-foreground">
              Convide seus amigos para o app e ganhem juntos! Cada amigo que se cadastrar pelo seu link recebe R$10 de desconto por 2 meses, e você também ganha R$10 de desconto por 2 meses na sua assinatura.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Seu link de indicação:</Label>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopy} size="lg" variant="outline">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
                <Button onClick={handleShare} size="lg" className="gradient-primary">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {stats.discount > 0 && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-center text-primary">
                  🎁 Você tem R${stats.discount} de desconto ativo nas próximas {stats.discount / 10} cobranças
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pessoas Indicadas</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total de indicações</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assinaram</CardTitle>
              <Check className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Indicações ativas</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Desconto Ativo</CardTitle>
              <Gift className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">R$ {stats.discount}</div>
              <p className="text-xs text-muted-foreground">Economize nas próximas cobranças</p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Compartilhe seu código</h4>
                  <p className="text-sm text-muted-foreground">
                    Envie seu código de indicação para amigos e familiares
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Eles assinam o plano</h4>
                  <p className="text-sm text-muted-foreground">
                    Quando seu amigo assinar usando seu código
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Você ganha desconto</h4>
                  <p className="text-sm text-muted-foreground">
                    R$ 10 de desconto durante 2 meses para cada indicação confirmada
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-center">
                Máximo de 5 indicações ativas por aluno
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referred Friends List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Suas Indicações</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não tem indicações. Compartilhe seu link para começar!
              </p>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div 
                    key={referral.id} 
                    className={`flex justify-between items-center p-4 rounded-lg bg-muted/30 border border-border/50 ${
                      referral.status !== 'active' ? 'opacity-60' : ''
                    }`}
                  >
                    <div>
                      <p className="font-medium">{referral.referred?.full_name || 'Nome não disponível'}</p>
                      <p className="text-sm text-muted-foreground">
                        {referral.status === 'active' ? 'Assinante ativo' : 'Pendente'}
                      </p>
                    </div>
                    <span className={referral.status === 'active' ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
                      {referral.status === 'active' ? 'R$ 10 OFF' : 'Aguardando'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Referrals;

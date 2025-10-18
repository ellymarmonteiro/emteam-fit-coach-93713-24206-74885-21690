import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import CoachNavbar from "@/components/CoachNavbar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CoachReferrals = () => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    const { data } = await supabase
      .from('referrals')
      .select(`
        *,
        referrer:referrer_id (
          id,
          full_name,
          email,
          discount_remaining
        ),
        referred:referred_id (
          id,
          full_name,
          email,
          subscription_status,
          discount_remaining
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setReferrals(data);
    }
  };

  const filteredReferrals = referrals.filter(r => {
    if (filter === "all") return true;
    if (filter === "active") return r.status === 'active';
    if (filter === "inactive") return r.status === 'inactive';
    return true;
  });

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Sistema de Indicações</h1>
            </div>
            <p className="text-muted-foreground">
              Acompanhe todas as indicações realizadas pelos alunos
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Indicações</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{referrals.length}</div>
                <p className="text-xs text-muted-foreground">Todas as indicações</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Indicações Ativas</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">
                  {referrals.filter(r => r.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Assinaturas ativas</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {referrals.filter(r => {
                    const date = new Date(r.created_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Novas indicações</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "active" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "inactive" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Inativas
            </button>
          </div>

          {/* Referrals List */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Lista de Indicações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Indicador</th>
                      <th className="text-left p-4 font-medium">Indicado</th>
                      <th className="text-left p-4 font-medium">Data</th>
                      <th className="text-left p-4 font-medium">Status Assinatura</th>
                      <th className="text-left p-4 font-medium">Desconto Indicador</th>
                      <th className="text-left p-4 font-medium">Desconto Indicado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.map((referral) => (
                      <tr key={referral.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{referral.referrer?.full_name}</p>
                            <p className="text-sm text-muted-foreground">{referral.referrer?.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{referral.referred?.full_name}</p>
                            <p className="text-sm text-muted-foreground">{referral.referred?.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          {format(new Date(referral.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            referral.referred?.subscription_status === 'active' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {referral.referred?.subscription_status === 'active' ? 'Ativa' : 'Pendente'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-green-500 font-semibold">
                            R$ {(referral.referrer?.discount_remaining || 0) * 10}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-green-500 font-semibold">
                            R$ {(referral.referred?.discount_remaining || 0) * 10}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredReferrals.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma indicação encontrada
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

export default CoachReferrals;

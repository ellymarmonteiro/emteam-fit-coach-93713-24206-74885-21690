import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [referrerCode, setReferrerCode] = useState("");

  useEffect(() => {
    const referralCode = searchParams.get("indicador");
    if (referralCode) {
      setReferrerCode(referralCode);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find referrer if code exists
      let referrerId = null;
      if (referrerCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referrerCode)
          .single();
        
        if (referrer) {
          referrerId = referrer.id;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            referred_by: referrerId
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este e-mail já está cadastrado");
        } else {
          toast.error("Erro ao criar conta");
        }
        return;
      }

      if (data.user) {
        // Update profile with referral info
        if (referrerId) {
          await supabase
            .from('profiles')
            .update({ referred_by: referrerId })
            .eq('id', data.user.id);
        }

        toast.success("Conta criada com sucesso!");
        toast.info("Você já pode fazer login");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Activity className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center gradient-primary bg-clip-text text-transparent">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Preencha seus dados para começar
          </CardDescription>
          {referrerCode && (
            <div className="text-center p-2 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">
                🎉 Você foi indicado! Ganhe R$10 de desconto nas próximas 2 mensalidades
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input 
                id="fullName" 
                placeholder="Seu nome completo" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(00) 00000-0000" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Mínimo 6 caracteres" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required 
              />
            </div>
            {referrerCode && (
              <div className="space-y-2">
                <Label htmlFor="referralCode">Código de Indicação</Label>
                <Input 
                  id="referralCode" 
                  value={referrerCode}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}
            <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

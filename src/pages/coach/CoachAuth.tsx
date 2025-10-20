import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CoachAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['coach', 'admin']);
        
        if (roles && roles.length > 0) {
          navigate("/coach/dashboard");
        } else {
          toast.error("Acesso negado. Apenas profissionais podem acessar.");
          await supabase.auth.signOut();
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message === "Invalid login credentials" 
          ? "E-mail ou senha incorretos" 
          : "Erro ao fazer login");
        return;
      }

      if (data.user) {
        // Verificar se o usuário tem role de coach ou admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .in('role', ['coach', 'admin']);
        
        if (!roles || roles.length === 0) {
          toast.error("Acesso negado. Apenas profissionais podem acessar.");
          await supabase.auth.signOut();
          return;
        }

        toast.success("Login realizado com sucesso!");
        navigate("/coach/dashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center gradient-primary bg-clip-text text-transparent">
            Área do Profissional
          </CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coach-email">E-mail</Label>
              <Input 
                id="coach-email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coach-password">Senha</Label>
              <Input 
                id="coach-password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar como Coach"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachAuth;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, Users, Brain, TrendingUp, Settings, LogOut, Gift, Trophy, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const CoachNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/coach/dashboard" className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            EMteam Digital - Coach
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/coach/dashboard"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/coach/students"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/students") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Users className="w-4 h-4" />
              Alunos
            </Link>
            <Link
              to="/coach/progress"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/progress") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Evolução
            </Link>
            <Link
              to="/coach/ai-training"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/ai-training") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Brain className="w-4 h-4" />
              Treinar IA
            </Link>
            <Link
              to="/coach/referrals"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/referrals") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Gift className="w-4 h-4" />
              Indicações
            </Link>
            <Link
              to="/coach/ranking"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/ranking") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Ranking
            </Link>
            <Link
              to="/coach/exercises"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/exercises") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              Exercícios
            </Link>
            <Link
              to="/coach/settings"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/coach/settings") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CoachNavbar;

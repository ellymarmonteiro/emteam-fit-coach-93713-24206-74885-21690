import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, Activity, Apple, TrendingUp, Users, User, Gift, FileText, LogOut, Bell, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            EMteam Digital
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/workouts") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Activity className="w-4 h-4" />
              Treinos
            </Link>
            <Link
              to="/nutrition"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/nutrition") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Apple className="w-4 h-4" />
              Nutrição
            </Link>
            <Link
              to="/measurements"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/measurements") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Medidas
            </Link>
            <Link
              to="/evaluation"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/evaluation") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              Avaliação
            </Link>
            <Link
              to="/notifications"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/notifications") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notificações
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
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

export default Navbar;

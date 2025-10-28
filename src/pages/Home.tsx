import { Button } from "@/components/ui/button";
import { Activity, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 gradient-dark opacity-50"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">EM</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary">
                EMteam Digital
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma de acompanhamento fitness com IA personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary text-lg px-8 py-6 animate-glow-pulse">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Treinos Inteligentes</h3>
              <p className="text-muted-foreground">
                Planos de treino personalizados baseados em seus objetivos, nível de experiência e equipamentos disponíveis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300 animation-delay-100">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Nutrição Personalizada</h3>
              <p className="text-muted-foreground">
                Planos alimentares desenvolvidos especialmente para você, respeitando suas preferências e restrições.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300 animation-delay-200">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Acompanhamento Real</h3>
              <p className="text-muted-foreground">
                Monitore seu progresso com gráficos e métricas detalhadas. Veja sua evolução em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© 2025 EMteam Digital. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link to="/coach/auth" className="text-muted-foreground hover:text-primary transition-colors">
                Área do Coach
              </Link>
              <Link to="/subscription" className="text-muted-foreground hover:text-primary transition-colors">
                Assinatura
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

const Gender = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("");

  const handleContinue = () => {
    if (selected) {
      navigate("/onboarding/assessment");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <UserCircle className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Qual é o seu sexo?</h1>
          <p className="text-muted-foreground">
            Esta informação nos ajuda a personalizar melhor seu plano
          </p>

          <div className="grid md:grid-cols-3 gap-4 py-8">
            <button
              onClick={() => setSelected("masculino")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selected === "masculino"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="text-xl font-semibold">Masculino</p>
            </button>
            <button
              onClick={() => setSelected("feminino")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selected === "feminino"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="text-xl font-semibold">Feminino</p>
            </button>
            <button
              onClick={() => setSelected("outro")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selected === "outro"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="text-xl font-semibold">Outro</p>
            </button>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selected}
            className="gradient-primary px-8"
            size="lg"
          >
            Continuar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Gender;

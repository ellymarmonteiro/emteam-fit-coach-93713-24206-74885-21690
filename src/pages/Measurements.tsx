import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Measurements = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Medidas atualizadas com sucesso!");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Ruler className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Minhas Medidas</h1>
            </div>
            <p className="text-muted-foreground">Acompanhe suas medidas corporais</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          )}
        </div>

        {/* Current Measurements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Última Medição - 15/05/2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  defaultValue="78"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  defaultValue="175"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bf">% Gordura</Label>
                <Input
                  id="bf"
                  type="number"
                  defaultValue="18"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chest">Peito (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  defaultValue="98"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  defaultValue="82"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hips">Quadril (cm)</Label>
                <Input
                  id="hips"
                  type="number"
                  defaultValue="95"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thigh">Coxa (cm)</Label>
                <Input
                  id="thigh"
                  type="number"
                  defaultValue="56"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arm">Braço (cm)</Label>
                <Input
                  id="arm"
                  type="number"
                  defaultValue="36"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calf">Panturrilha (cm)</Label>
                <Input
                  id="calf"
                  type="number"
                  defaultValue="38"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} className="gradient-primary flex-1">
                  Salvar Medidas
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Histórico de Medições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">15/05/2025</p>
                    <p className="text-sm text-muted-foreground">Peso: 78kg | BF: 18%</p>
                  </div>
                  <span className="text-green-500 font-semibold">-2kg</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">15/04/2025</p>
                    <p className="text-sm text-muted-foreground">Peso: 80kg | BF: 19%</p>
                  </div>
                  <span className="text-green-500 font-semibold">-1kg</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">15/03/2025</p>
                    <p className="text-sm text-muted-foreground">Peso: 81kg | BF: 20%</p>
                  </div>
                  <span className="text-green-500 font-semibold">-2kg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Measurements;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Upload, Calculator, TrendingUp, Camera } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Measurements {
  weight: string;
  height: string;
  neck: string;
  chest: string;
  waist: string;
  hip: string;
  thigh: string;
  calf: string;
  arm: string;
  heartRate: string;
  bloodPressure: string;
  notes: string;
}

interface CalculatedResults {
  bmi: number;
  bodyFatPercentage: number;
  leanMass: number;
  bmiCategory: string;
}

const Evaluation = () => {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<Measurements>({
    weight: "",
    height: "",
    neck: "",
    chest: "",
    waist: "",
    hip: "",
    thigh: "",
    calf: "",
    arm: "",
    heartRate: "",
    bloodPressure: "",
    notes: ""
  });
  
  const [photos, setPhotos] = useState<{ front?: File; side?: File; back?: File }>({});
  const [results, setResults] = useState<CalculatedResults | null>(null);

  const handleInputChange = (field: keyof Measurements, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (position: 'front' | 'side' | 'back', file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A foto deve ter no máximo 2MB");
      return;
    }
    setPhotos(prev => ({ ...prev, [position]: file }));
    toast.success(`Foto ${position === 'front' ? 'frontal' : position === 'side' ? 'lateral' : 'de costas'} carregada`);
  };

  const calculateResults = () => {
    const weight = parseFloat(measurements.weight);
    const height = parseFloat(measurements.height) / 100; // cm to meters
    const waist = parseFloat(measurements.waist);
    const neck = parseFloat(measurements.neck);
    const hip = parseFloat(measurements.hip);

    if (!weight || !height) {
      toast.error("Peso e altura são obrigatórios");
      return;
    }

    // Calculate BMI
    const bmi = weight / (height * height);

    // Determine BMI category
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Abaixo do peso";
    else if (bmi < 25) bmiCategory = "Peso normal";
    else if (bmi < 30) bmiCategory = "Sobrepeso";
    else bmiCategory = "Obesidade";

    // Estimate body fat percentage using US Navy method
    let bodyFatPercentage = 0;
    if (waist && neck && hip) {
      // Simplified formula for estimation (assuming male, adjust as needed)
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height * 100)) - 450;
      bodyFatPercentage = Math.max(5, Math.min(50, bodyFatPercentage)); // Clamp between reasonable values
    }

    // Calculate lean mass
    const leanMass = weight * (1 - bodyFatPercentage / 100);

    setResults({
      bmi: parseFloat(bmi.toFixed(1)),
      bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(1)),
      leanMass: parseFloat(leanMass.toFixed(1)),
      bmiCategory
    });

    toast.success("Cálculos realizados com sucesso!");
  };

  const handleSaveEvaluation = () => {
    if (!measurements.weight || !measurements.height) {
      toast.error("Peso e altura são obrigatórios");
      return;
    }

    // TODO: Save to backend
    toast.success("Avaliação salva com sucesso!");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Avaliação Física</h1>
            <p className="text-muted-foreground">Registre suas medidas e acompanhe sua evolução</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Voltar
          </Button>
        </div>

        {/* Current Date */}
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="font-semibold">Data da Avaliação:</span>
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </Card>

        {/* Measurements Form */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Medidas Corporais
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 75.5"
                value={measurements.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm) *</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 175"
                value={measurements.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neck">Pescoço (cm)</Label>
              <Input
                id="neck"
                type="number"
                step="0.1"
                placeholder="Ex: 38"
                value={measurements.neck}
                onChange={(e) => handleInputChange("neck", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chest">Peito (cm)</Label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                placeholder="Ex: 95"
                value={measurements.chest}
                onChange={(e) => handleInputChange("chest", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist">Cintura (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                placeholder="Ex: 85"
                value={measurements.waist}
                onChange={(e) => handleInputChange("waist", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hip">Quadril (cm)</Label>
              <Input
                id="hip"
                type="number"
                step="0.1"
                placeholder="Ex: 98"
                value={measurements.hip}
                onChange={(e) => handleInputChange("hip", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thigh">Coxa (cm)</Label>
              <Input
                id="thigh"
                type="number"
                step="0.1"
                placeholder="Ex: 55"
                value={measurements.thigh}
                onChange={(e) => handleInputChange("thigh", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calf">Panturrilha (cm)</Label>
              <Input
                id="calf"
                type="number"
                step="0.1"
                placeholder="Ex: 38"
                value={measurements.calf}
                onChange={(e) => handleInputChange("calf", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arm">Braço (cm)</Label>
              <Input
                id="arm"
                type="number"
                step="0.1"
                placeholder="Ex: 35"
                value={measurements.arm}
                onChange={(e) => handleInputChange("arm", e.target.value)}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="font-semibold mb-4">Dados Adicionais (Opcional)</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate">Frequência Cardíaca em Repouso (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="Ex: 70"
                value={measurements.heartRate}
                onChange={(e) => handleInputChange("heartRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Pressão Arterial</Label>
              <Input
                id="bloodPressure"
                type="text"
                placeholder="Ex: 120/80"
                value={measurements.bloodPressure}
                onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Anote qualquer observação relevante sobre sua condição física, como você se sentiu, etc."
              rows={3}
              value={measurements.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          <Button onClick={calculateResults} className="mt-4 gradient-primary">
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Resultados
          </Button>
        </Card>

        {/* Photos Upload */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Fotos de Evolução
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tire fotos com roupas justas, boa iluminação e mantenha a mesma distância da câmera
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {['front', 'side', 'back'].map((position) => (
              <div key={position} className="space-y-2">
                <Label>
                  {position === 'front' ? 'Frontal' : position === 'side' ? 'Lateral' : 'Costas'}
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(position as 'front' | 'side' | 'back', file);
                    }}
                    className="hidden"
                    id={`photo-${position}`}
                  />
                  <label htmlFor={`photo-${position}`} className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {photos[position as keyof typeof photos] ? 'Foto carregada' : 'Clique para enviar'}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Results */}
        {results && (
          <Card className="glass-card p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Resultados</h2>
            
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Método utilizado:</strong> Fórmula da Marinha dos EUA (US Navy) para estimativa de gordura corporal.
                Este é um cálculo estimado e não substitui avaliações profissionais.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">IMC</p>
                <p className="text-2xl font-bold text-primary">{results.bmi}</p>
                <p className="text-xs text-muted-foreground mt-1">{results.bmiCategory}</p>
              </div>

              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-sm text-muted-foreground">% Gordura</p>
                <p className="text-2xl font-bold text-secondary">{results.bodyFatPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">Estimado</p>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground">Massa Magra</p>
                <p className="text-2xl font-bold text-accent">{results.leanMass} kg</p>
                <p className="text-xs text-muted-foreground mt-1">Estimada</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Peso Total</p>
                <p className="text-2xl font-bold">{measurements.weight} kg</p>
                <p className="text-xs text-muted-foreground mt-1">Atual</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Recomendações Iniciais</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Continue acompanhando suas medidas mensalmente</li>
                <li>• Tire fotos na mesma posição e iluminação para comparação</li>
                <li>• Consulte seu profissional para um plano personalizado</li>
                <li>• Mantenha uma alimentação equilibrada e hidratação adequada</li>
              </ul>
            </div>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancelar
          </Button>
          <Button onClick={handleSaveEvaluation} className="gradient-primary">
            Salvar Avaliação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, HelpCircle, Camera } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Assessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form data state
  const [formData, setFormData] = useState({
    // Block A - Personal & Anthropometric
    fullName: "",
    birthDate: "",
    gender: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    measurements: {
      neck: "",
      chest: "",
      waist: "",
      hip: "",
      thigh: "",
      calf: "",
      arm: ""
    },
    profilePhoto: null as File | null,
    bodyPhotos: { front: null as File | null, side: null as File | null, back: null as File | null },

    // Block B - Training History
    isActive: "",
    currentActivities: "",
    trainingDuration: "",
    hasInjuries: "",
    injuries: "",
    surgeries: "",
    hasPain: "",
    painDetails: "",

    // Block C - Health
    hypertension: false,
    diabetes: false,
    cardiovascular: false,
    kidney: false,
    medications: "",
    allergies: "",
    intolerances: "",

    // Block D - Nutrition
    mealsPerDay: "",
    mealTimes: "",
    dietPreference: "",
    dislikedFoods: "",
    alcoholConsumption: "",
    waterIntake: "",
    supplements: "",
    dietHistory: "",

    // Block E - Lifestyle
    profession: "",
    workHours: "",
    activityLevel: "",
    sleepHours: "",
    stressLevel: "",
    hasChildren: "",
    childrenImpact: "",
    frequentTravel: "",

    // Block F - Goals
    mainGoal: "",
    targetTimeline: "",
    motivation: "",
    availability: "",

    // Block G - Consents
    termsAccepted: false,
    photoConsent: false,
    notificationsConsent: false
  });

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('anamneseData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anamneseData', JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    // Validate required fields per step
    if (!validateStep(step)) return;
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.birthDate || !formData.gender || !formData.height || !formData.currentWeight || !formData.targetWeight) {
          toast.error("Por favor, preencha todos os campos obrigatórios");
          return false;
        }
        break;
      case 2:
        if (!formData.isActive || !formData.trainingDuration) {
          toast.error("Por favor, preencha todos os campos obrigatórios");
          return false;
        }
        break;
      case 7:
        if (!formData.termsAccepted) {
          toast.error("Você deve aceitar os termos de uso para continuar");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;
    toast.success("Anamnese concluída! Gerando seu plano...");
    localStorage.removeItem('anamneseData'); // Clear saved data
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const TooltipInfo = ({ text }: { text: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-4xl glass-card p-8">
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Etapa {step} de {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Welcome Message */}
          {step === 1 && (
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20 mb-6">
              <h2 className="text-2xl font-bold mb-2">Olá, bem-vindo(a)! 👋</h2>
              <p className="text-muted-foreground">
                Queremos te conhecer melhor para criar um plano seguro e eficiente. 
                Responda com sinceridade — tudo é confidencial e será usado apenas para personalizar sua experiência.
              </p>
            </div>
          )}

          {/* BLOCK A - Personal & Anthropometric Data */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco A — Dados Pessoais e Antropométricos</h2>
                <p className="text-muted-foreground">Informações básicas sobre você</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    Data de Nascimento *
                    <TooltipInfo text="Precisamos da sua idade para calcular necessidades calóricas e adaptar o treino" />
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo *</Label>
                  <Select value={formData.gender} onValueChange={(val) => updateField('gender', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">
                    Altura (cm) *
                    <TooltipInfo text="Sua altura em centímetros. Exemplo: 175 cm" />
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    placeholder="Ex: 175"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentWeight">
                    Peso Atual (kg) *
                    <TooltipInfo text="Seu peso atual para calcular IMC e necessidades calóricas" />
                  </Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    value={formData.currentWeight}
                    onChange={(e) => updateField('currentWeight', e.target.value)}
                    placeholder="Ex: 75.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetWeight">
                    Peso Desejado (kg) *
                    <TooltipInfo text="O peso que você gostaria de atingir" />
                  </Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    value={formData.targetWeight}
                    onChange={(e) => updateField('targetWeight', e.target.value)}
                    placeholder="Ex: 70"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg">
                    Medidas Iniciais (Opcional)
                    <TooltipInfo text="Essas medidas nos ajudam a acompanhar sua evolução de forma mais precisa" />
                  </Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Inserir Medidas</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Medidas Corporais</DialogTitle>
                      </DialogHeader>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {Object.entries({
                          neck: "Pescoço",
                          chest: "Peito",
                          waist: "Cintura",
                          hip: "Quadril",
                          thigh: "Coxa",
                          calf: "Panturrilha",
                          arm: "Braço (relaxado)"
                        }).map(([key, label]) => (
                          <div key={key} className="space-y-2">
                            <Label>{label} (cm)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={(formData.measurements as any)[key]}
                              onChange={(e) => updateNestedField('measurements', key, e.target.value)}
                              placeholder={`Ex: ${key === 'neck' ? '38' : key === 'chest' ? '95' : '85'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-lg">
                  Foto de Perfil (Opcional, mas recomendado)
                  <TooltipInfo text="Uma foto ajuda a criar uma conexão mais pessoal com seu profissional" />
                </Label>
                <ProfilePhotoUpload
                  onPhotoChange={(file) => updateField('profilePhoto', file)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-lg">
                  Fotos do Corpo (Opcional)
                  <Camera className="inline-block w-5 h-5 ml-2 text-primary" />
                </Label>
                <p className="text-sm text-muted-foreground">
                  <strong>Como tirar boas fotos:</strong> Use roupas justas (shorts e top/sem camisa), 
                  mantenha 2-3 metros de distância da câmera, boa iluminação natural, fundo neutro.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {['front', 'side', 'back'].map((position) => (
                    <div key={position} className="space-y-2">
                      <Label>{position === 'front' ? 'Frontal' : position === 'side' ? 'Lateral' : 'Costas'}</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateNestedField('bodyPhotos', position, file);
                            toast.success(`Foto ${position === 'front' ? 'frontal' : position === 'side' ? 'lateral' : 'de costas'} adicionada`);
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BLOCK B - Training History */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco B — Histórico de Treino e Limitações</h2>
                <p className="text-muted-foreground">Conte-nos sobre sua experiência com exercícios</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="isActive">
                    Você pratica atividade física hoje? *
                    <TooltipInfo text="Queremos saber se você está ativo atualmente para adaptar a intensidade inicial" />
                  </Label>
                  <Select value={formData.isActive} onValueChange={(val) => updateField('isActive', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="no">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.isActive === 'yes' && (
                  <div className="space-y-2">
                    <Label htmlFor="currentActivities">Descreva suas atividades atuais</Label>
                    <Textarea
                      id="currentActivities"
                      value={formData.currentActivities}
                      onChange={(e) => updateField('currentActivities', e.target.value)}
                      placeholder="Ex: Musculação 3x/semana, corrida aos fins de semana, duração média 45min, intensidade moderada..."
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="trainingDuration">Há quanto tempo treina? *</Label>
                  <Select value={formData.trainingDuration} onValueChange={(val) => updateField('trainingDuration', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Nunca treinei</SelectItem>
                      <SelectItem value="0-6months">0-6 meses</SelectItem>
                      <SelectItem value="6-12months">6-12 meses</SelectItem>
                      <SelectItem value="1-2years">1-2 anos</SelectItem>
                      <SelectItem value="2plus">Mais de 2 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hasInjuries">
                      Você tem ou já teve lesões? *
                      <TooltipInfo text="Lesões prévias podem impactar o tipo de exercício recomendado" />
                    </Label>
                    <Select value={formData.hasInjuries} onValueChange={(val) => updateField('hasInjuries', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">Não</SelectItem>
                        <SelectItem value="yes">Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.hasInjuries === 'yes' && (
                    <div className="space-y-2">
                      <Label htmlFor="injuries">Descreva suas lesões</Label>
                      <Textarea
                        id="injuries"
                        value={formData.injuries}
                        onChange={(e) => updateField('injuries', e.target.value)}
                        placeholder="Local da lesão, quando ocorreu, tratamento realizado... Ex: Lesão no joelho direito em 2020, fiz fisioterapia por 6 meses"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surgeries">
                    Cirurgias e histórico médico relevante
                    <TooltipInfo text="Cirurgias podem ter implicações na escolha dos exercícios" />
                  </Label>
                  <Textarea
                    id="surgeries"
                    value={formData.surgeries}
                    onChange={(e) => updateField('surgeries', e.target.value)}
                    placeholder="Ex: Apendicectomia em 2015, cirurgia no ombro em 2018..."
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hasPain">Você sente alguma dor atualmente?</Label>
                    <Select value={formData.hasPain} onValueChange={(val) => updateField('hasPain', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">Não</SelectItem>
                        <SelectItem value="yes">Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.hasPain === 'yes' && (
                    <div className="space-y-2">
                      <Label htmlFor="painDetails">Onde dói e qual a intensidade?</Label>
                      <Textarea
                        id="painDetails"
                        value={formData.painDetails}
                        onChange={(e) => updateField('painDetails', e.target.value)}
                        placeholder="Ex: Dor lombar ao acordar, escala 4/10, melhora com alongamento..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BLOCK C - Health */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco C — Saúde Geral e Medicação</h2>
                <p className="text-muted-foreground">Informações importantes para sua segurança</p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Você tem alguma das seguintes condições?
                  <TooltipInfo text="Essas informações são essenciais para criar um treino seguro" />
                </Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hypertension"
                      checked={formData.hypertension}
                      onCheckedChange={(checked) => updateField('hypertension', checked)}
                    />
                    <Label htmlFor="hypertension" className="font-normal cursor-pointer">
                      Hipertensão (pressão alta)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diabetes"
                      checked={formData.diabetes}
                      onCheckedChange={(checked) => updateField('diabetes', checked)}
                    />
                    <Label htmlFor="diabetes" className="font-normal cursor-pointer">
                      Diabetes
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cardiovascular"
                      checked={formData.cardiovascular}
                      onCheckedChange={(checked) => updateField('cardiovascular', checked)}
                    />
                    <Label htmlFor="cardiovascular" className="font-normal cursor-pointer">
                      Doenças cardiovasculares
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="kidney"
                      checked={formData.kidney}
                      onCheckedChange={(checked) => updateField('kidney', checked)}
                    />
                    <Label htmlFor="kidney" className="font-normal cursor-pointer">
                      Problemas renais
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="medications">
                    Uso de medicamentos
                    <TooltipInfo text="Alguns medicamentos podem interagir com exercícios ou suplementos" />
                  </Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => updateField('medications', e.target.value)}
                    placeholder="Liste os medicamentos que você usa regularmente, dosagem e frequência. Ex: Losartana 50mg 1x/dia..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">
                    Alergias alimentares
                    <TooltipInfo text="Importante para evitar esses alimentos no seu plano nutricional" />
                  </Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => updateField('allergies', e.target.value)}
                    placeholder="Ex: Alergia a amendoim (reação grave), alergia a camarão..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intolerances">Intolerâncias (lactose, glúten, etc.)</Label>
                  <Textarea
                    id="intolerances"
                    value={formData.intolerances}
                    onChange={(e) => updateField('intolerances', e.target.value)}
                    placeholder="Ex: Intolerância à lactose (desconforto gástrico), sensibilidade ao glúten..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BLOCK D - Nutrition */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco D — Nutrição e Hábitos Alimentares</h2>
                <p className="text-muted-foreground">Como você se alimenta hoje?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mealsPerDay">
                    Quantas refeições você faz por dia?
                    <TooltipInfo text="Isso nos ajuda a distribuir as calorias ao longo do dia" />
                  </Label>
                  <Select value={formData.mealsPerDay} onValueChange={(val) => updateField('mealsPerDay', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 refeições</SelectItem>
                      <SelectItem value="3">3 refeições</SelectItem>
                      <SelectItem value="4">4 refeições</SelectItem>
                      <SelectItem value="5">5 refeições</SelectItem>
                      <SelectItem value="6">6 refeições</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealTimes">Horários típicos</Label>
                  <Input
                    id="mealTimes"
                    value={formData.mealTimes}
                    onChange={(e) => updateField('mealTimes', e.target.value)}
                    placeholder="Ex: 7h, 12h, 19h"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietPreference">
                    Preferência alimentar
                    <TooltipInfo text="Respeitaremos suas escolhas alimentares no plano nutricional" />
                  </Label>
                  <Select value={formData.dietPreference} onValueChange={(val) => updateField('dietPreference', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Onívoro (como de tudo)</SelectItem>
                      <SelectItem value="vegetarian">Vegetariano</SelectItem>
                      <SelectItem value="vegan">Vegano</SelectItem>
                      <SelectItem value="keto">Cetogênico (low carb)</SelectItem>
                      <SelectItem value="flexible">Flexível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterIntake">
                    Consumo de água (litros/dia)
                    <TooltipInfo text="Hidratação é fundamental para performance e recuperação" />
                  </Label>
                  <Input
                    id="waterIntake"
                    type="number"
                    step="0.5"
                    value={formData.waterIntake}
                    onChange={(e) => updateField('waterIntake', e.target.value)}
                    placeholder="Ex: 2.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikedFoods">
                  Alimentos que você não consome ou não gosta
                  <TooltipInfo text="Vamos evitar esses alimentos no seu plano" />
                </Label>
                <Textarea
                  id="dislikedFoods"
                  value={formData.dislikedFoods}
                  onChange={(e) => updateField('dislikedFoods', e.target.value)}
                  placeholder="Ex: Não gosto de brócolis, evito carne vermelha, não como frutos do mar..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcoholConsumption">Consumo de álcool (frequência)</Label>
                <Input
                  id="alcoholConsumption"
                  value={formData.alcoholConsumption}
                  onChange={(e) => updateField('alcoholConsumption', e.target.value)}
                  placeholder="Ex: Socialmente aos fins de semana, raramente, nunca..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplements">
                  Suplementos que você usa atualmente
                  <TooltipInfo text="Vamos considerar isso no seu plano nutricional" />
                </Label>
                <Textarea
                  id="supplements"
                  value={formData.supplements}
                  onChange={(e) => updateField('supplements', e.target.value)}
                  placeholder="Ex: Whey protein após treino, creatina 5g/dia, multivitamínico..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietHistory">
                  Histórico de dietas (o que já tentou e como foi)
                  <TooltipInfo text="Entender o que funcionou ou não ajuda a personalizar melhor" />
                </Label>
                <Textarea
                  id="dietHistory"
                  value={formData.dietHistory}
                  onChange={(e) => updateField('dietHistory', e.target.value)}
                  placeholder="Ex: Já fiz low carb e perdi 5kg mas recuperei depois, tentei jejum intermitente mas passei mal..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* BLOCK E - Lifestyle */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco E — Rotina e Estilo de Vida</h2>
                <p className="text-muted-foreground">Como é seu dia a dia?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">
                    Profissão
                    <TooltipInfo text="Entender sua rotina de trabalho ajuda a ajustar o horário de treino" />
                  </Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => updateField('profession', e.target.value)}
                    placeholder="Ex: Desenvolvedor, Professor, Enfermeiro..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workHours">Carga horária diária (horas)</Label>
                  <Input
                    id="workHours"
                    type="number"
                    value={formData.workHours}
                    onChange={(e) => updateField('workHours', e.target.value)}
                    placeholder="Ex: 8"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel">
                    Nível de atividade no trabalho
                    <TooltipInfo text="Isso impacta seu gasto calórico diário" />
                  </Label>
                  <Select value={formData.activityLevel} onValueChange={(val) => updateField('activityLevel', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentário (sentado maior parte do dia)</SelectItem>
                      <SelectItem value="light">Levemente ativo (caminho um pouco)</SelectItem>
                      <SelectItem value="moderate">Moderadamente ativo (em pé frequentemente)</SelectItem>
                      <SelectItem value="active">Muito ativo (trabalho físico)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleepHours">
                    Horas de sono por noite (média)
                    <TooltipInfo text="Sono adequado é essencial para recuperação e resultados" />
                  </Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    step="0.5"
                    value={formData.sleepHours}
                    onChange={(e) => updateField('sleepHours', e.target.value)}
                    placeholder="Ex: 7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stressLevel">
                    Nível de estresse
                    <TooltipInfo text="Estresse alto pode impactar recuperação e progresso" />
                  </Label>
                  <Select value={formData.stressLevel} onValueChange={(val) => updateField('stressLevel', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixo</SelectItem>
                      <SelectItem value="moderate">Moderado</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hasChildren">
                    Você tem filhos ou responsabilidades familiares que impactam seu horário de treinos?
                  </Label>
                  <Select value={formData.hasChildren} onValueChange={(val) => updateField('hasChildren', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Não</SelectItem>
                      <SelectItem value="yes">Sim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.hasChildren === 'yes' && (
                  <div className="space-y-2">
                    <Label htmlFor="childrenImpact">Como isso impacta sua disponibilidade?</Label>
                    <Textarea
                      id="childrenImpact"
                      value={formData.childrenImpact}
                      onChange={(e) => updateField('childrenImpact', e.target.value)}
                      placeholder="Ex: Tenho 2 filhos pequenos, só consigo treinar depois das 20h..."
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequentTravel">Você viaja com frequência?</Label>
                <Select value={formData.frequentTravel} onValueChange={(val) => updateField('frequentTravel', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="sometimes">Às vezes</SelectItem>
                    <SelectItem value="frequently">Frequentemente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* BLOCK F - Goals */}
          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco F — Objetivos e Motivação</h2>
                <p className="text-muted-foreground">O que te trouxe até aqui?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mainGoal">
                    Objetivo principal
                    <TooltipInfo text="Qual é o resultado mais importante que você quer alcançar?" />
                  </Label>
                  <Select value={formData.mainGoal} onValueChange={(val) => updateField('mainGoal', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Emagrecimento (perder gordura)</SelectItem>
                      <SelectItem value="muscle-gain">Hipertrofia (ganhar massa muscular)</SelectItem>
                      <SelectItem value="definition">Definição muscular</SelectItem>
                      <SelectItem value="conditioning">Condicionamento físico</SelectItem>
                      <SelectItem value="health">Saúde e bem-estar geral</SelectItem>
                      <SelectItem value="performance">Performance esportiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetTimeline">
                    Prazo desejado
                    <TooltipInfo text="Em quanto tempo você gostaria de ver resultados significativos?" />
                  </Label>
                  <Input
                    id="targetTimeline"
                    value={formData.targetTimeline}
                    onChange={(e) => updateField('targetTimeline', e.target.value)}
                    placeholder="Ex: Em 3 meses quero perder 5kg, em 6 meses quero ganhar 3kg de massa..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Por que agora? O que te motiva?
                    <TooltipInfo text="Entender sua motivação nos ajuda a te apoiar melhor" />
                  </Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => updateField('motivation', e.target.value)}
                    placeholder="Ex: Quero me sentir mais disposto, melhorar minha saúde, preparar para um evento, recuperar autoestima..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">
                    Disponibilidade: dias e horários preferidos para treinar
                    <TooltipInfo text="Vamos montar um plano que se encaixe na sua rotina" />
                  </Label>
                  <Textarea
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => updateField('availability', e.target.value)}
                    placeholder="Ex: Segunda, quarta e sexta pela manhã (6h-7h), sábado à tarde..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BLOCK G - Consents */}
          {step === 7 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bloco G — Consentimentos</h2>
                <p className="text-muted-foreground">Últimos detalhes antes de começar</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => updateField('termsAccepted', checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="termsAccepted" className="font-normal cursor-pointer">
                      <span className="font-semibold">Aceito os termos de uso e política de privacidade *</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Li e concordo com os <a href="#" className="text-primary underline">termos de uso</a> e <a href="#" className="text-primary underline">política de privacidade</a> da plataforma.
                      </p>
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="photoConsent"
                    checked={formData.photoConsent}
                    onCheckedChange={(checked) => updateField('photoConsent', checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="photoConsent" className="font-normal cursor-pointer">
                      <span className="font-semibold">Autorizo uso das fotos para avaliação</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Autorizo que minhas fotos sejam visualizadas pelo profissional responsável pelo meu acompanhamento para fins de avaliação e acompanhamento da evolução. As fotos são confidenciais e não serão compartilhadas.
                      </p>
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="notificationsConsent"
                    checked={formData.notificationsConsent}
                    onCheckedChange={(checked) => updateField('notificationsConsent', checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="notificationsConsent" className="font-normal cursor-pointer">
                      <span className="font-semibold">Autorizo envio de notificações e lembretes</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Desejo receber lembretes de treino, mensagens motivacionais e notificações sobre meu progresso. Posso desativar a qualquer momento nas configurações.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-6">
                <p className="text-sm">
                  <strong>Quase lá!</strong> Ao concluir, seu profissional receberá todas essas informações e iniciará a análise para criar seu plano personalizado. Você receberá uma notificação quando estiver pronto.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} className="gradient-primary">
                Salvar e Continuar
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gradient-primary" disabled={!formData.termsAccepted}>
                Concluir Anamnese
              </Button>
            )}
          </div>

          {/* Auto-save indicator */}
          <p className="text-xs text-center text-muted-foreground">
            ✓ Suas respostas são salvas automaticamente
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Assessment;

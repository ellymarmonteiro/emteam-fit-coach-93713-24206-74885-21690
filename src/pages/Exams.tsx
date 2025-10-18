import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Exams = () => {
  const handleUpload = () => {
    toast.success("Arquivo enviado com sucesso!");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Meus Exames</h1>
          </div>
          <p className="text-muted-foreground">Envie seus exames laboratoriais (opcional)</p>
        </div>

        {/* Info Card */}
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-foreground">
              Envie seus exames laboratoriais para ajudar na personalização do seu plano. 
              Esta etapa é <span className="font-semibold text-primary">opcional</span>, mas 
              pode fornecer informações valiosas para otimizar seus resultados.
            </p>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Enviar Novo Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Arraste seus arquivos aqui</h3>
              <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar</p>
              <Button onClick={handleUpload} className="gradient-primary">
                Selecionar Arquivo
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Exams */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Exames Sugeridos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Hemograma Completo</h4>
                    <p className="text-sm text-muted-foreground">Avaliação geral da saúde</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Glicemia</h4>
                    <p className="text-sm text-muted-foreground">Nível de açúcar no sangue</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Colesterol Total e Frações</h4>
                    <p className="text-sm text-muted-foreground">Perfil lipídico</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">TSH e T4 Livre</h4>
                    <p className="text-sm text-muted-foreground">Função da tireoide</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Testosterona Total</h4>
                    <p className="text-sm text-muted-foreground">Hormônio importante para treino</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Vitamina D</h4>
                    <p className="text-sm text-muted-foreground">Importante para saúde óssea</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Exams */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Exames Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Nenhum exame enviado ainda
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Exams;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Video, Trash2, Edit, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CoachNavbar from "@/components/CoachNavbar";

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  equipment: string[];
  video_path: string | null;
  muscle_groups: string[];
}

const CoachExercises = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "strength",
    level: "beginner",
    equipment: [] as string[],
    muscle_groups: [] as string[],
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
    loadExercises();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/coach/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles?.some(r => r.role === "coach" || r.role === "admin")) {
      toast.error("Acesso negado");
      navigate("/");
    }
  };

  const loadExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error("Erro ao carregar exercícios:", error);
      toast.error("Erro ao carregar exercícios");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      let videoPath = editingExercise?.video_path || null;

      // Upload do vídeo se fornecido
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('exercise-videos')
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        videoPath = filePath;
      }

      const exerciseData = {
        ...formData,
        video_path: videoPath,
        created_by: user.id,
      };

      if (editingExercise) {
        const { error } = await supabase
          .from("exercises")
          .update(exerciseData)
          .eq("id", editingExercise.id);

        if (error) throw error;
        toast.success("Exercício atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("exercises")
          .insert(exerciseData);

        if (error) throw error;
        toast.success("Exercício criado com sucesso!");
      }

      setDialogOpen(false);
      resetForm();
      loadExercises();
    } catch (error: any) {
      console.error("Erro ao salvar exercício:", error);
      toast.error(error.message || "Erro ao salvar exercício");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este exercício?")) return;

    try {
      const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Exercício deletado com sucesso!");
      loadExercises();
    } catch (error) {
      console.error("Erro ao deletar exercício:", error);
      toast.error("Erro ao deletar exercício");
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      level: exercise.level,
      equipment: exercise.equipment,
      muscle_groups: exercise.muscle_groups,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "strength",
      level: "beginner",
      equipment: [],
      muscle_groups: [],
    });
    setVideoFile(null);
    setEditingExercise(null);
  };

  const getVideoUrl = (videoPath: string | null) => {
    if (!videoPath) return null;
    const { data } = supabase.storage
      .from('exercise-videos')
      .getPublicUrl(videoPath);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <CoachNavbar />
        <div className="p-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Banco de Exercícios</h1>
              <p className="text-muted-foreground">Gerencie os exercícios disponíveis</p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Exercício
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingExercise ? "Editar Exercício" : "Novo Exercício"}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Exercício *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strength">Força</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="flexibility">Flexibilidade</SelectItem>
                          <SelectItem value="mobility">Mobilidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="level">Nível</Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Iniciante</SelectItem>
                          <SelectItem value="intermediate">Intermediário</SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="video">Vídeo/GIF (até 20MB)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="video"
                        type="file"
                        accept="video/*,image/gif"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={uploading}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Exercícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(exercise)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(exercise.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {exercise.video_path && (
                    <div className="mb-3 rounded-lg overflow-hidden bg-muted">
                      <video
                        src={getVideoUrl(exercise.video_path) || ""}
                        controls
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  {!exercise.video_path && (
                    <div className="mb-3 rounded-lg overflow-hidden bg-muted h-40 flex items-center justify-center">
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exercise.description || "Sem descrição"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                      {exercise.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/10">
                      {exercise.level}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {exercises.length === 0 && (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum exercício cadastrado ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Clique em "Novo Exercício" para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachExercises;

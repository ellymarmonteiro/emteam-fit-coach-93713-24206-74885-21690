import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, User, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CoachNavbar from "@/components/CoachNavbar";

const students = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    weight: 78,
    goal: "Emagrecimento",
    status: "active",
    progress: 60,
    trend: "up",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    weight: 65,
    goal: "Hipertrofia",
    status: "active",
    progress: 75,
    trend: "up",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    weight: 85,
    goal: "Condicionamento",
    status: "active",
    progress: 45,
    trend: "stable",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    weight: 58,
    goal: "Hipertrofia",
    status: "inactive",
    progress: 30,
    trend: "down",
  },
];

const CoachStudents = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check URL params for filter
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'active') {
      setFilter('active');
    }
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || (filter === 'active' && student.status === 'active');
    return matchesSearch && matchesFilter;
  });

  const handleViewProfile = (studentId: number) => {
    navigate(`/coach/student/${studentId}`);
  };

  const handleEditPlan = (studentId: number, studentName: string) => {
    navigate(`/coach/student/${studentId}/edit`);
    toast.success(`Editando plano de ${studentName}`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen">
      <CoachNavbar />
      <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Alunos</h1>
            <p className="text-muted-foreground">Gerencie seus alunos e acompanhe o progresso</p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={student.status === "active" ? "default" : "secondary"}
                    className={student.status === "active" ? "bg-green-500" : ""}
                  >
                    {student.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Peso Atual</p>
                    <p className="font-semibold">{student.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Objetivo</p>
                    <p className="font-semibold">{student.goal}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(student.trend)}
                      <span className="font-semibold">{student.progress}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewProfile(student.id)}
                  >
                    Ver Perfil
                  </Button>
                  <Button 
                    className="flex-1 gradient-primary"
                    onClick={() => handleEditPlan(student.id, student.name)}
                  >
                    Editar Plano
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum aluno encontrado
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
};

export default CoachStudents;

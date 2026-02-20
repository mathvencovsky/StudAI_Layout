import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus } from "lucide-react";
import { useMyPlan } from "@/hooks/user-plan/use-my-plan";

export function ProgramasPage() {
  const { data: plan, isLoading } = useMyPlan();

  const tracks = plan?.tracks ? JSON.parse(plan.tracks as any) : [];
  const modulesProgress = plan?.modulesProgress ? JSON.parse(plan.modulesProgress as any) : [];

  const totalEstimated = modulesProgress.reduce((sum: number, m: any) => sum + m.estimatedHours, 0);
  const totalCompleted = modulesProgress.reduce((sum: number, m: any) => sum + m.completedHours, 0);
  const progressPercentage = totalEstimated > 0 ? Math.round((totalCompleted / totalEstimated) * 100) : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Programas</h1>
          <p className="text-muted-foreground">Trilhas e programas ativos</p>
        </div>
        <Link to="/explorar">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Programa
          </Button>
        </Link>
      </div>

      {!plan || tracks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum programa ativo</h3>
            <p className="text-muted-foreground mb-4">
              Explore trilhas e adicione ao seu plano
            </p>
            <Link to="/explorar">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Explorar Trilhas
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Programa Ativo</CardTitle>
              <CardDescription>
                {tracks.length} trilha{tracks.length !== 1 ? "s" : ""} no seu plano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso Geral</span>
                  <span className="text-muted-foreground">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Horas Concluídas</p>
                  <p className="text-2xl font-bold">{totalCompleted.toFixed(1)}h</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Horas Restantes</p>
                  <p className="text-2xl font-bold">
                    {Math.max(0, totalEstimated - totalCompleted).toFixed(1)}h
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Módulos</p>
                  <p className="text-2xl font-bold">{modulesProgress.length}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link to="/trilha" className="flex-1">
                  <Button className="w-full">Ver Detalhes do Plano</Button>
                </Link>
                <Link to="/estudar" className="flex-1">
                  <Button variant="outline" className="w-full">Estudar com IA</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {tracks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trilhas no Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tracks.map((track: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Trilha {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          Adicionada em {new Date(track.addedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Link to="/explorar/$trackId" params={{ trackId: track.trackId }}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

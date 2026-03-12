import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { Plus, FileText, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import type { AdminModule } from '@/types/admin-track';

interface ModuleEditorProps {
  module: AdminModule;
}

export function ModuleEditor({ module }: ModuleEditorProps) {
  const selectLesson = useAdminTrackStore((state) => state.selectLesson);
  const addLesson = useAdminTrackStore((state) => state.addLesson);

  const handleAddLesson = () => {
    addLesson(module.id, {
      moduleId: module.id,
      title: 'Nova Aula',
      description: '',
      estimatedMinutes: 0,
      order: module.lessons.length,
      contentBlocks: [],
      status: 'draft',
      isComplete: false,
    });
  };

  const getStatusIcon = (lesson: any) => {
    if (lesson.isComplete) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (lesson.contentBlocks.length === 0) {
      return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const completedLessons = module.lessons.filter((l) => l.isComplete).length;
  const progressPercentage =
    module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{module.title}</h1>
          <Badge variant={module.isComplete ? 'default' : 'secondary'}>
            {module.isComplete ? 'Completo' : 'Incompleto'}
          </Badge>
        </div>
        <p className="text-muted-foreground">{module.description || 'Sem descrição'}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{module.lessons.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedLessons} completas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{module.estimatedMinutes}</div>
            <p className="text-xs text-muted-foreground">
              minutos estimados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <p className="text-xs text-muted-foreground">
              completude
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aulas neste Módulo</CardTitle>
              <CardDescription>
                Clique em uma aula para editar seu conteúdo
              </CardDescription>
            </div>
            <Button onClick={handleAddLesson}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Aula
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {module.lessons.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm font-medium mb-2">Nenhuma aula ainda</p>
              <p className="text-xs text-muted-foreground mb-4">
                Adicione a primeira aula para começar
              </p>
              <Button onClick={handleAddLesson} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Aula
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {module.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => selectLesson(lesson.id)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{lesson.title}</h3>
                      {getStatusIcon(lesson)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {lesson.description || 'Sem descrição'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{lesson.estimatedMinutes} min</span>
                      <span>•</span>
                      <span>{lesson.contentBlocks.length} blocos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {lesson.contentBlocks.some((b) => b.type === 'video') && (
                      <Badge variant="outline" className="text-xs">
                        Vídeo
                      </Badge>
                    )}
                    {lesson.contentBlocks.some((b) => b.type === 'quiz') && (
                      <Badge variant="outline" className="text-xs">
                        Quiz
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

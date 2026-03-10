import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type { AdminTrack } from '@/types/admin-track';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrackOverviewProps {
  track: AdminTrack;
}

export function TrackOverview({ track }: TrackOverviewProps) {
  const totalModules = track.modules.length;
  const totalLessons = track.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalBlocks = track.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((acc2, l) => acc2 + l.contentBlocks.length, 0),
    0
  );

  const completedModules = track.modules.filter((m) => m.isComplete).length;
  const completionPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  // Calcular pendências
  const issues: Array<{
    type: 'error' | 'warning';
    message: string;
    path: string;
  }> = [];
  
  track.modules.forEach((module, moduleIndex) => {
    if (module.lessons.length === 0) {
      issues.push({
        type: 'warning' as const,
        message: `Módulo ${moduleIndex + 1}: Sem aulas`,
        path: `modules[${moduleIndex}]`,
      });
    }

    module.lessons.forEach((lesson, lessonIndex) => {
      if (lesson.contentBlocks.length === 0) {
        issues.push({
          type: 'warning' as const,
          message: `Módulo ${moduleIndex + 1} > Aula ${lessonIndex + 1}: Sem conteúdo`,
          path: `modules[${moduleIndex}].lessons[${lessonIndex}]`,
        });
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
        <p className="text-muted-foreground">{track.description || 'Sem descrição'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Módulos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModules}</div>
            <p className="text-xs text-muted-foreground">
              {completedModules} completos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              {track.modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.isComplete).length, 0)} completas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlocks}</div>
            <p className="text-xs text-muted-foreground">
              Conteúdos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{track.estimatedHours}h</div>
            <p className="text-xs text-muted-foreground">
              Estimada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso de Completude</CardTitle>
          <CardDescription>
            Acompanhe o progresso de criação da trilha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completude</span>
              <span className="font-medium">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {completedModules} de {totalModules} módulos completos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      {issues.length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Pendências ({issues.length})</CardTitle>
            </div>
            <CardDescription>
              Itens que precisam de atenção antes de publicar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {issues.slice(0, 5).map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-950"
                >
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{issue.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{issue.path}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ir para item
                  </Button>
                </div>
              ))}
              {issues.length > 5 && (
                <Button variant="outline" className="w-full">
                  Ver todas as {issues.length} pendências
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {issues.length === 0 && (
        <Card className="border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">Trilha pronta para publicação!</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Todos os módulos e aulas estão completos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Edições</CardTitle>
          <CardDescription>
            Histórico recente de modificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                {format(track.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
              <span>Trilha editada por {track.updatedBy}</span>
            </div>
            {track.publishedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">
                  {format(track.publishedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
                <span>Trilha publicada por {track.publishedBy}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-1">Nível</p>
              <Badge variant="secondary" className="capitalize">
                {track.level === 'beginner' && 'Iniciante'}
                {track.level === 'intermediate' && 'Intermediário'}
                {track.level === 'advanced' && 'Avançado'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <Badge variant={track.status === 'published' ? 'default' : 'secondary'}>
                {track.status === 'published' && 'Publicado'}
                {track.status === 'draft' && 'Rascunho'}
                {track.status === 'archived' && 'Arquivado'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Versão</p>
              <p className="text-sm text-muted-foreground">v{track.version}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {track.tags.length > 0 ? (
                  track.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma tag</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

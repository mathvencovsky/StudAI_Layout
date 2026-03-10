import { Clock, Trophy, CheckCircle, Play, Lock, Target, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { LearningLayout } from "../layout/learning-layout";
import { ContentContainer } from "../layout/content-container";
import { ContextualBreadcrumb } from "../ui/contextual-breadcrumb";
import { ProgressBar } from "../ui/progress-bar";

import type { Track, Module, Lesson } from "@/types/learning";

interface ModulePageProps {
  track: Track;
  module: Module;
  onLessonSelect: (lessonId: string) => void;
  onModuleSelect: (moduleId: string) => void;
  onStartModule: () => void;
  onContinueModule: () => void;
  isLoading?: boolean;
}

export function ModulePage({
  track,
  module,
  onLessonSelect,
  onModuleSelect,
  onStartModule,
  onContinueModule,
  isLoading = false
}: ModulePageProps) {
  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.isLocked) return 'locked';
    if (lesson.progress.isCompleted) return 'completed';
    if (lesson.progress.isStarted) return 'in-progress';
    return 'available';
  };

  const getLessonIcon = (lesson: Lesson) => {
    const status = getLessonStatus(lesson);
    switch (status) {
      case 'locked': return Lock;
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      default: return Play;
    }
  };

  const getLessonIconColor = (lesson: Lesson) => {
    const status = getLessonStatus(lesson);
    switch (status) {
      case 'locked': return 'text-muted-foreground';
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const nextLesson = module.lessons.find(lesson => 
    !lesson.progress.isCompleted && !lesson.isLocked
  );

  const totalEstimatedTime = module.lessons.reduce((acc, lesson) => acc + lesson.estimatedMinutes, 0);
  const totalXP = module.lessons.reduce((acc, lesson) => acc + lesson.xpReward, 0);

  return (
    <LearningLayout
      track={track}
      onLessonSelect={onLessonSelect}
      onModuleSelect={onModuleSelect}
    >
      <ContentContainer className="space-y-8">
        {/* Breadcrumb */}
        <ContextualBreadcrumb
          track={track}
          module={module}
        />

        {/* Module Header */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  MÓDULO {module.order}
                </Badge>
                <h1 className="text-4xl font-bold">{module.title}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  {module.description}
                </p>
              </div>
              
              {/* Module Stats */}
              <Card className="w-64">
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">
                        {Math.round(module.progress.percentComplete)}%
                      </span>
                    </div>
                    
                    <ProgressBar
                      current={module.progress.completedLessons}
                      total={module.lessons.length}
                      variant="module"
                      size="sm"
                      showLabel={false}
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Aulas</span>
                      <span className="font-medium">
                        {module.progress.completedLessons} de {module.lessons.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tempo estimado</span>
                      <span className="font-medium">{Math.round(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}min</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">XP total</span>
                      <span className="font-medium text-yellow-600">🏆 {totalXP} XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Module Objectives */}
            {module.objectives.length > 0 && (
              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <Target className="h-5 w-5" />
                    <span>Objetivos do Módulo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    {module.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {module.progress.completedLessons === 0 ? (
              <Button
                size="lg"
                onClick={onStartModule}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-5 w-5 mr-2" />
                {isLoading ? "Iniciando..." : "Iniciar Módulo"}
              </Button>
            ) : !module.progress.isCompleted ? (
              <Button
                size="lg"
                onClick={onContinueModule}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-5 w-5 mr-2" />
                {isLoading ? "Carregando..." : "Continuar de onde parei"}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={onContinueModule}
                disabled={isLoading}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {isLoading ? "Carregando..." : "Revisar Módulo"}
              </Button>
            )}

            {nextLesson && (
              <div className="text-sm text-muted-foreground">
                Próxima aula: <span className="font-medium">{nextLesson.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Aulas do Módulo</h2>
          
          <div className="space-y-3">
            {module.lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson);
              const Icon = getLessonIcon(lesson);
              const iconColor = getLessonIconColor(lesson);
              
              const handleLessonAction = (e: React.MouseEvent) => {
                e.stopPropagation();
                
                if (status === 'locked') return;
                
                // Navigate to lesson
                onLessonSelect(lesson.id);
                
                // Show appropriate feedback
                if (status === 'available') {
                  toast.success(`🎬 Iniciando aula "${lesson.title}"`);
                } else if (status === 'in-progress') {
                  toast.success(`📚 Continuando aula "${lesson.title}"`);
                } else if (status === 'completed') {
                  toast.success(`✅ Revisando aula "${lesson.title}"`);
                }
              };
              
              return (
                <Card
                  key={lesson.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md cursor-pointer",
                    status === 'completed' && "border-green-200 bg-green-50/30 dark:bg-green-950/10",
                    status === 'in-progress' && "border-blue-200 bg-blue-50/30 dark:bg-blue-950/10",
                    status === 'locked' && "opacity-60"
                  )}
                  onClick={() => !lesson.isLocked && onLessonSelect(lesson.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Lesson Number and Icon */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                          status === 'completed' && "border-green-500 bg-green-500 text-white",
                          status === 'in-progress' && "border-blue-500 bg-blue-500 text-white",
                          status === 'available' && "border-muted-foreground text-muted-foreground",
                          status === 'locked' && "border-muted-foreground/50 text-muted-foreground/50"
                        )}>
                          {status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        
                        {index < module.lessons.length - 1 && (
                          <div className={cn(
                            "w-0.5 h-12 bg-border",
                            status === 'completed' && "bg-green-300"
                          )} />
                        )}
                      </div>

                      {/* Lesson Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              {lesson.description}
                            </p>
                            
                            {/* Lesson Meta */}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.estimatedMinutes} min</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4" />
                                <span>+{lesson.xpReward} XP</span>
                              </div>
                              
                              {lesson.checkpoints.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Target className="h-4 w-4" />
                                  <span>{lesson.checkpoints.length} checkpoints</span>
                                </div>
                              )}
                              
                              {lesson.exercises.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Play className="h-4 w-4" />
                                  <span>{lesson.exercises.length} exercícios</span>
                                </div>
                              )}
                            </div>

                            {/* Progress Bar for In-Progress Lessons */}
                            {status === 'in-progress' && lesson.progress.videoProgress > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progresso</span>
                                  <span>{Math.round(lesson.progress.videoProgress)}%</span>
                                </div>
                                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${lesson.progress.videoProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="ml-4">
                            <Button
                              variant={status === 'completed' ? 'outline' : 'default'}
                              size="sm"
                              onClick={handleLessonAction}
                              disabled={status === 'locked' || isLoading}
                              className={cn(
                                status === 'completed' && "border-green-200 text-green-700 hover:bg-green-50",
                                status === 'in-progress' && "bg-blue-600 hover:bg-blue-700 text-white"
                              )}
                            >
                              <Icon className={cn("h-4 w-4 mr-2", iconColor)} />
                              {status === 'locked' && 'Bloqueada'}
                              {status === 'available' && (isLoading ? 'Carregando...' : 'Iniciar')}
                              {status === 'in-progress' && (isLoading ? 'Carregando...' : 'Continuar')}
                              {status === 'completed' && (isLoading ? 'Carregando...' : 'Revisar')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Module Assessment */}
        {module.finalAssessment && (
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
                <Star className="h-5 w-5" />
                <span>Avaliação Final do Módulo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-purple-700 dark:text-purple-300">
                  {module.finalAssessment.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-purple-600 dark:text-purple-400">
                    <span>📝 {module.finalAssessment.questions.length} questões</span>
                    <span>🏆 +{module.finalAssessment.xpReward} XP</span>
                    {module.finalAssessment.timeLimit && (
                      <span>⏱ {module.finalAssessment.timeLimit} min</span>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    disabled={module.progress.completedLessons < module.lessons.length}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    {module.progress.completedLessons < module.lessons.length 
                      ? 'Complete todas as aulas primeiro'
                      : 'Fazer Avaliação'
                    }
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </ContentContainer>
    </LearningLayout>
  );
}
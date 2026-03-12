import { useState } from "react";
import { toast } from "sonner";
import { 
  Play, CheckCircle, Lock, Clock, Trophy, Target, Users, Star, 
  TrendingUp, Calendar, Award, Flame, BookOpen 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LearningLayout } from "../layout/learning-layout";
import { ContentContainer } from "../layout/content-container";
import { ProgressBar } from "../ui/progress-bar";

import type { Track, Module } from "@/types/learning";

interface TrackPageProps {
  track: Track;
  onLessonSelect: (lessonId: string) => void;
  onModuleSelect: (moduleId: string) => void;
  onStartTrack: () => void;
  onContinueTrack: () => void;
  isLoading?: boolean;
}

export function TrackPage({
  track,
  onLessonSelect,
  onModuleSelect,
  onStartTrack,
  onContinueTrack,
  isLoading = false
}: TrackPageProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getModuleStatus = (module: Module) => {
    if (module.isLocked) return 'locked';
    if (module.progress.isCompleted) return 'completed';
    if (module.progress.completedLessons > 0) return 'in-progress';
    return 'available';
  };

  const getModuleIcon = (module: Module) => {
    const status = getModuleStatus(module);
    switch (status) {
      case 'locked': return Lock;
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      default: return BookOpen;
    }
  };

  const nextModule = track.modules.find(module => 
    !module.progress.isCompleted && !module.isLocked
  );

  const totalLessons = track.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = track.modules.reduce((acc, module) => acc + module.progress.completedLessons, 0);
  const totalEstimatedHours = Math.round(track.estimatedHours);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  return (
    <LearningLayout
      track={track}
      onLessonSelect={onLessonSelect}
      onModuleSelect={onModuleSelect}
    >
      <ContentContainer className="space-y-8">
        {/* Track Header */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Badge className={cn("text-xs border", getDifficultyColor(track.difficulty))}>
                    {getDifficultyLabel(track.difficulty)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    TRILHA DE APRENDIZADO
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold">{track.title}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  {track.description}
                </p>
              </div>

              {/* Track Stats */}
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>12.847 alunos</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8/5.0</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{totalEstimatedHours}h de conteúdo</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>{track.totalXP} XP total</span>
                </div>
                
                {track.certificate && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Certificado incluso</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Card */}
            <Card className="w-80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar
                  current={completedLessons}
                  total={totalLessons}
                  variant="track"
                  size="md"
                />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-lg">{track.progress.xpEarned}</div>
                    <div className="text-muted-foreground">XP Ganhos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{Math.round(track.progress.timeSpent / 60)}h</div>
                    <div className="text-muted-foreground">Estudadas</div>
                  </div>
                </div>
                
                {track.progress.currentStreak > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{track.progress.currentStreak} dias de sequência</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {track.progress.completedLessons === 0 ? (
              <Button
                size="lg"
                onClick={onStartTrack}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-5 w-5 mr-2" />
                {isLoading ? "Iniciando..." : "Iniciar Trilha"}
              </Button>
            ) : track.progress.percentComplete < 100 ? (
              <Button
                size="lg"
                onClick={onContinueTrack}
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
                onClick={onContinueTrack}
                disabled={isLoading}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {isLoading ? "Carregando..." : "Revisar Trilha"}
              </Button>
            )}

            {nextModule && (
              <div className="text-sm text-muted-foreground">
                Próximo módulo: <span className="font-medium">{nextModule.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Progress Map */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Mapa de Progresso da Trilha
              </h3>
              
              <div className="flex items-center justify-between">
                {track.modules.map((module, index) => {
                  const status = getModuleStatus(module);
                  const Icon = getModuleIcon(module);
                  
                  return (
                    <div key={module.id} className="flex items-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className={cn(
                          "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                          status === 'completed' && "border-green-500 bg-green-500 text-white",
                          status === 'in-progress' && "border-blue-500 bg-blue-500 text-white",
                          status === 'available' && "border-blue-300 bg-blue-100 text-blue-600",
                          status === 'locked' && "border-gray-300 bg-gray-100 text-gray-400"
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs font-medium">
                            {status === 'completed' && '✅'}
                            {status === 'in-progress' && '🔄'}
                            {status === 'available' && '⏳'}
                            {status === 'locked' && '🔒'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Módulo {index + 1}
                          </div>
                          <div className="text-xs font-medium max-w-20 truncate">
                            {module.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({Math.round(module.progress.percentComplete)}%)
                          </div>
                        </div>
                      </div>
                      
                      {index < track.modules.length - 1 && (
                        <div className={cn(
                          "w-16 h-0.5 mx-2",
                          status === 'completed' ? "bg-green-300" : "bg-gray-300"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="certificate">Certificação</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Objetivos de Aprendizagem</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {track.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            {track.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Pré-requisitos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {track.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="modules" className="space-y-4 mt-6">
            <ModulesList 
              modules={track.modules}
              onModuleSelect={onModuleSelect}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <ProgressStats track={track} />
          </TabsContent>

          <TabsContent value="certificate" className="space-y-6 mt-6">
            <CertificateInfo track={track} />
          </TabsContent>
        </Tabs>
      </ContentContainer>
    </LearningLayout>
  );
}

// Modules List Component
function ModulesList({ 
  modules, 
  onModuleSelect,
  isLoading = false
}: { 
  modules: Module[];
  onModuleSelect: (moduleId: string) => void;
  isLoading?: boolean;
}) {
  const handleModuleAction = (module: Module) => {
    const status = module.isLocked ? 'locked' : 
                 module.progress.isCompleted ? 'completed' :
                 module.progress.completedLessons > 0 ? 'in-progress' : 'available';
    
    if (status === 'locked') return;
    
    // Navigate to module page
    onModuleSelect(module.id);
    
    // Show appropriate feedback
    if (status === 'available') {
      toast.success(`📖 Abrindo módulo "${module.title}"`);
    } else if (status === 'in-progress') {
      toast.success(`📚 Continuando módulo "${module.title}"`);
    } else if (status === 'completed') {
      toast.success(`✅ Revisando módulo "${module.title}"`);
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const status = module.isLocked ? 'locked' : 
                     module.progress.isCompleted ? 'completed' :
                     module.progress.completedLessons > 0 ? 'in-progress' : 'available';
        
        const Icon = status === 'locked' ? Lock :
                    status === 'completed' ? CheckCircle :
                    status === 'in-progress' ? Play : BookOpen;

        return (
          <Card
            key={module.id}
            className={cn(
              "transition-all duration-200 hover:shadow-md cursor-pointer",
              status === 'completed' && "border-green-200 bg-green-50/30 dark:bg-green-950/10",
              status === 'in-progress' && "border-blue-200 bg-blue-50/30 dark:bg-blue-950/10",
              status === 'locked' && "opacity-60"
            )}
            onClick={() => !module.isLocked && onModuleSelect(module.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                  status === 'completed' && "border-green-500 bg-green-500 text-white",
                  status === 'in-progress' && "border-blue-500 bg-blue-500 text-white",
                  status === 'available' && "border-muted-foreground text-muted-foreground",
                  status === 'locked' && "border-muted-foreground/50 text-muted-foreground/50"
                )}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          MÓDULO {index + 1}
                        </Badge>
                        {status === 'completed' && (
                          <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                            Concluído
                          </Badge>
                        )}
                        {status === 'in-progress' && (
                          <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                            Em Andamento
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{module.lessons.length} aulas</span>
                        <span>•</span>
                        <span>{module.estimatedMinutes} min</span>
                        <span>•</span>
                        <span>+{module.xpReward} XP</span>
                      </div>

                      {status === 'in-progress' && (
                        <div className="mt-3">
                          <ProgressBar
                            current={module.progress.completedLessons}
                            total={module.lessons.length}
                            variant="module"
                            size="sm"
                          />
                        </div>
                      )}
                    </div>

                    <Button
                      variant={status === 'completed' ? 'outline' : 'default'}
                      size="sm"
                      disabled={status === 'locked' || isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModuleAction(module);
                      }}
                      className={cn(
                        status === 'completed' && "border-green-200 text-green-700 hover:bg-green-50",
                        status === 'in-progress' && "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                    >
                      {status === 'locked' && 'Bloqueado'}
                      {status === 'available' && (isLoading ? 'Carregando...' : 'Iniciar')}
                      {status === 'in-progress' && (isLoading ? 'Carregando...' : 'Continuar')}
                      {status === 'completed' && (isLoading ? 'Carregando...' : 'Revisar')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Progress Stats Component
function ProgressStats({ track }: { track: Track }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Estatísticas de Progresso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Módulos concluídos</span>
              <span className="font-medium">
                {track.progress.completedModules} de {track.progress.totalModules}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Aulas concluídas</span>
              <span className="font-medium">
                {track.progress.completedLessons} de {track.progress.totalLessons}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">XP acumulado</span>
              <span className="font-medium text-yellow-600">
                🏆 {track.progress.xpEarned} de {track.totalXP} XP
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tempo estudado</span>
              <span className="font-medium">
                {Math.round(track.progress.timeSpent / 60)}h {track.progress.timeSpent % 60}min
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Atividade Recente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Sequência atual</span>
              <span className="font-medium flex items-center space-x-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{track.progress.currentStreak} dias</span>
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Último estudo</span>
              <span className="font-medium">
                {track.progress.lastStudyDate 
                  ? new Date(track.progress.lastStudyDate).toLocaleDateString('pt-BR')
                  : 'Nunca'
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tempo restante estimado</span>
              <span className="font-medium">
                {Math.round(track.progress.estimatedTimeRemaining / 60)}h {track.progress.estimatedTimeRemaining % 60}min
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Certificate Info Component
function CertificateInfo({ track }: { track: Track }) {
  const isEligible = track.progress.percentComplete === 100;
  
  return (
    <div className="space-y-6">
      <Card className={cn(
        "border-2",
        isEligible 
          ? "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20"
          : "border-gray-200 bg-gray-50/50 dark:bg-gray-950/20"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className={cn(
              "h-6 w-6",
              isEligible ? "text-yellow-600" : "text-gray-400"
            )} />
            <span>Certificado de Conclusão</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEligible ? (
            <div className="space-y-4">
              <p className="text-green-700 dark:text-green-300">
                🎉 Parabéns! Você completou toda a trilha e está elegível para receber seu certificado.
              </p>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Seu Certificado Incluirá:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Nome completo e data de conclusão</li>
                  <li>• Carga horária total: {track.estimatedHours}h</li>
                  <li>• XP total conquistado: {track.progress.xpEarned} XP</li>
                  <li>• Verificação digital autenticada</li>
                </ul>
              </div>
              
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                <Award className="h-4 w-4 mr-2" />
                Gerar Certificado
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Complete toda a trilha para desbloquear seu certificado de conclusão.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso para certificação</span>
                  <span>{Math.round(track.progress.percentComplete)}%</span>
                </div>
                <ProgressBar
                  current={track.progress.completedLessons}
                  total={track.progress.totalLessons}
                  variant="track"
                  size="sm"
                  showLabel={false}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Faltam {track.progress.totalLessons - track.progress.completedLessons} aulas para completar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
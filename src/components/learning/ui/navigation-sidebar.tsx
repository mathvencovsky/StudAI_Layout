import { CheckCircle, Circle, Lock, Play, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProgressBar } from "./progress-bar";
import type { Track, Module, Lesson } from "@/types/learning";

interface NavigationSidebarProps {
  track: Track;
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  onModuleSelect: (moduleId: string) => void;
  className?: string;
}

export function NavigationSidebar({
  track,
  currentLessonId,
  onLessonSelect,
  onModuleSelect,
  className
}: NavigationSidebarProps) {
  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isLocked) return Lock;
    if (lesson.progress.isCompleted) return CheckCircle;
    if (lesson.id === currentLessonId) return Play;
    return Circle;
  };

  const getLessonIconColor = (lesson: Lesson) => {
    if (lesson.isLocked) return "text-muted-foreground";
    if (lesson.progress.isCompleted) return "text-green-600";
    if (lesson.id === currentLessonId) return "text-blue-600";
    return "text-muted-foreground";
  };

  const getModuleStatus = (module: Module) => {
    if (module.isLocked) return "locked";
    if (module.progress.isCompleted) return "completed";
    if (module.lessons.some(lesson => lesson.id === currentLessonId)) return "current";
    if (module.progress.completedLessons > 0) return "in-progress";
    return "available";
  };

  return (
    <div className={cn("w-80 border-r bg-card", className)}>
      <div className="p-4 border-b">
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              TRILHA DE APRENDIZADO
            </h2>
            <h3 className="font-bold text-lg mt-1">{track.title}</h3>
          </div>
          
          <ProgressBar
            current={track.progress.completedLessons}
            total={track.progress.totalLessons}
            variant="track"
            size="sm"
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{track.progress.xpEarned} de {track.totalXP} XP</span>
            <span>{Math.round(track.progress.estimatedTimeRemaining / 60)}h restantes</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {track.modules.map((module, moduleIndex) => {
            const moduleStatus = getModuleStatus(module);
            
            return (
              <Collapsible
                key={module.id}
                defaultOpen={moduleStatus === "current" || moduleStatus === "in-progress"}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-3 h-auto text-left",
                      moduleStatus === "current" && "bg-blue-50 dark:bg-blue-950/20 border border-blue-200",
                      moduleStatus === "completed" && "bg-green-50 dark:bg-green-950/20",
                      moduleStatus === "locked" && "opacity-60 cursor-not-allowed"
                    )}
                    onClick={() => !module.isLocked && onModuleSelect(module.id)}
                    disabled={module.isLocked}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="mt-0.5">
                        {moduleStatus === "locked" && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {moduleStatus === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {moduleStatus === "current" && <Play className="h-4 w-4 text-blue-600" />}
                        {moduleStatus === "in-progress" && <Circle className="h-4 w-4 text-yellow-600 fill-current" />}
                        {moduleStatus === "available" && <Circle className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            MÓDULO {moduleIndex + 1}: {module.title.toUpperCase()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                          <span>{module.progress.completedLessons} de {module.lessons.length} aulas</span>
                          <span>•</span>
                          <span>{Math.round(module.progress.percentComplete)}%</span>
                        </div>
                        
                        {!module.isLocked && (
                          <div className="mt-2">
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full transition-all duration-500 rounded-full",
                                  moduleStatus === "completed" ? "bg-green-500" :
                                  moduleStatus === "current" ? "bg-blue-500" :
                                  moduleStatus === "in-progress" ? "bg-yellow-500" :
                                  "bg-muted-foreground"
                                )}
                                style={{ width: `${module.progress.percentComplete}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1 ml-7 mt-1">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const LessonIcon = getLessonIcon(lesson);
                    const iconColor = getLessonIconColor(lesson);
                    
                    return (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start p-2 h-auto text-left text-xs",
                          lesson.id === currentLessonId && "bg-blue-100 dark:bg-blue-950/30 border border-blue-300",
                          lesson.progress.isCompleted && "text-green-700 dark:text-green-300",
                          lesson.isLocked && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !lesson.isLocked && onLessonSelect(lesson.id)}
                        disabled={lesson.isLocked}
                      >
                        <div className="flex items-start space-x-2 w-full">
                          <LessonIcon className={cn("h-3 w-3 mt-0.5", iconColor)} />
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {lesson.title}
                            </p>
                            
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.estimatedMinutes} min</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-3 w-3" />
                                <span>+{lesson.xpReward} XP</span>
                              </div>
                            </div>
                            
                            {lesson.progress.isStarted && !lesson.progress.isCompleted && (
                              <div className="mt-1">
                                <div className="w-full h-0.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${lesson.progress.videoProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Footer with overall stats */}
      <div className="p-4 border-t bg-muted/30">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Sequência atual</span>
            <span className="font-medium">🔥 {track.progress.currentStreak} dias</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tempo estudado</span>
            <span className="font-medium">{Math.round(track.progress.timeSpent / 60)}h {track.progress.timeSpent % 60}min</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">XP total</span>
            <span className="font-medium text-yellow-600">🏆 {track.progress.xpEarned} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
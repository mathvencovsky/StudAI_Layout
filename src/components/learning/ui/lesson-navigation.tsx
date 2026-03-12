import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, Play, Lock, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Module, Lesson } from "@/types/learning";

interface LessonNavigationProps {
  module: Module;
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  className?: string;
}

export function LessonNavigation({
  module,
  currentLessonId,
  onLessonSelect,
  className
}: LessonNavigationProps) {
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <Card className={cn("border-blue-200 bg-blue-50/30 dark:bg-blue-950/10", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-800 dark:text-blue-200 text-base">
                📚 {module.title} - Aulas
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-blue-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-blue-600" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {module.lessons.map((lesson, index) => {
                const status = getLessonStatus(lesson);
                const Icon = getLessonIcon(lesson);
                const iconColor = getLessonIconColor(lesson);
                const isCurrent = lesson.id === currentLessonId;
                
                return (
                  <Button
                    key={lesson.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-3 h-auto text-left",
                      isCurrent && "bg-blue-100 dark:bg-blue-950/30 border border-blue-300",
                      status === 'completed' && !isCurrent && "text-green-700 dark:text-green-300",
                      status === 'locked' && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !lesson.isLocked && onLessonSelect(lesson.id)}
                    disabled={lesson.isLocked}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex flex-col items-center space-y-1 mt-0.5">
                        <Icon className={cn("h-4 w-4", iconColor)} />
                        <span className="text-xs text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {lesson.title}
                        </p>
                        
                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{lesson.estimatedMinutes} min</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Trophy className="h-3 w-3" />
                            <span>+{lesson.xpReward} XP</span>
                          </div>
                          
                          {status === 'completed' && (
                            <span className="text-green-600 font-medium">✓ Concluída</span>
                          )}
                          
                          {isCurrent && (
                            <span className="text-blue-600 font-medium">← Atual</span>
                          )}
                        </div>

                        {status === 'in-progress' && lesson.progress.videoProgress > 0 && (
                          <div className="mt-2">
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
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
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
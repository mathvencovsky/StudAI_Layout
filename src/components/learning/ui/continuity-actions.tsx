import { ChevronLeft, ChevronRight, CheckCircle, Trophy, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Lesson } from "@/types/learning";

interface ContinuityActionsProps {
  currentLesson: Lesson;
  previousLesson?: Lesson;
  nextLesson?: Lesson;
  onPrevious?: () => void;
  onNext?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
  className?: string;
}

export function ContinuityActions({
  currentLesson,
  previousLesson,
  nextLesson,
  onPrevious,
  onNext,
  onMarkComplete,
  isCompleted = false,
  className
}: ContinuityActionsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Completion Action */}
      {!isCompleted && (
        <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Concluir esta aula
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Marque como concluída para avançar
                  </p>
                </div>
              </div>
              
              <Button
                onClick={onMarkComplete}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Concluída
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Actions */}
      <div className="flex items-center space-x-4">
        {/* Previous Lesson */}
        {previousLesson && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1 h-auto p-4 justify-start"
          >
            <div className="flex items-center space-x-3">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Aula Anterior</p>
                <p className="font-medium text-sm truncate">{previousLesson.title}</p>
              </div>
            </div>
          </Button>
        )}

        {/* Next Lesson */}
        {nextLesson && (
          <Button
            variant={isCompleted ? "default" : "outline"}
            onClick={onNext}
            disabled={!isCompleted}
            className={cn(
              "flex-1 h-auto p-4 justify-end",
              isCompleted && "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs opacity-80">Próxima Aula</p>
                <p className="font-medium text-sm truncate">{nextLesson.title}</p>
              </div>
              <ChevronRight className="h-5 w-5" />
            </div>
          </Button>
        )}
      </div>

      {/* Next Lesson Preview */}
      {nextLesson && isCompleted && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Próximo: "{nextLesson.title}"
                </h4>
              </div>
              
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {nextLesson.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-blue-600 dark:text-blue-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{nextLesson.estimatedMinutes} minutos</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>+{nextLesson.xpReward} XP</span>
                </div>
              </div>
              
              <Button
                onClick={onNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continuar Aprendizado ✨
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Celebration */}
      {isCompleted && (
        <Card className="border-2 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <span className="text-2xl">🎉</span>
              </div>
              
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Parabéns! Aula Concluída
              </h4>
              
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Você ganhou +{currentLesson.xpReward} XP e está mais próximo do seu objetivo!
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-yellow-600 dark:text-yellow-400 pt-2">
                <span>🏆 +{currentLesson.xpReward} XP</span>
                <span>•</span>
                <span>⏱ {currentLesson.progress.timeSpent} min estudados</span>
                <span>•</span>
                <span>✅ {currentLesson.progress.completedCheckpoints.length} checkpoints</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
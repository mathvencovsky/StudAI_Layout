import { ChevronRight, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Track, Module, Lesson } from "@/types/learning";

interface ContextualBreadcrumbProps {
  track: Track;
  module?: Module;
  lesson?: Lesson;
  className?: string;
}

export function ContextualBreadcrumb({
  track,
  module,
  lesson,
  className
}: ContextualBreadcrumbProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <button className="hover:text-foreground transition-colors font-medium">
          {track.title}
        </button>
        
        {module && (
          <>
            <ChevronRight className="h-4 w-4" />
            <button className="hover:text-foreground transition-colors font-medium">
              {module.title}
            </button>
          </>
        )}
        
        {lesson && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {lesson.title}
            </span>
          </>
        )}
      </nav>

      {/* Progress and Context Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          {/* Track Progress */}
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${track.progress.percentComplete}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.round(track.progress.percentComplete)}% da trilha
            </span>
          </div>

          {/* Module Progress */}
          {module && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>•</span>
              <span>
                {module.progress.completedLessons} de {module.lessons.length} aulas
              </span>
            </div>
          )}
        </div>

        {/* Time and XP Info */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {lesson && (
            <>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimatedMinutes} min restantes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>+{lesson.xpReward} XP</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
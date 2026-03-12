import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProgressBar } from "../ui/progress-bar";
import type { Track, Module } from "@/types/learning";

interface LearningLayoutProps {
  children: React.ReactNode;
  track: Track;
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  onModuleSelect: (moduleId: string) => void;
  className?: string;
}

export function LearningLayout({
  children,
  track,
  currentLessonId,
  onLessonSelect,
  onModuleSelect,
  className
}: LearningLayoutProps) {
  const [showTrackOverview, setShowTrackOverview] = useState(false);

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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Track Overview Card - Collapsible */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <Collapsible open={showTrackOverview} onOpenChange={setShowTrackOverview}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{track.title}</span>
                  </CardTitle>
                  <ProgressBar
                    current={track.progress.completedLessons}
                    total={track.progress.totalLessons}
                    variant="track"
                    size="sm"
                  />
                </div>
                {showTrackOverview ? (
                  <ChevronDown className="h-5 w-5 text-purple-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-purple-600" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {track.modules.map((module, index) => {
                  const status = getModuleStatus(module);
                  const Icon = getModuleIcon(module);
                  
                  return (
                    <Card
                      key={module.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        status === 'completed' && "border-green-200 bg-green-50/30 dark:bg-green-950/10",
                        status === 'in-progress' && "border-blue-200 bg-blue-50/30 dark:bg-blue-950/10",
                        status === 'locked' && "opacity-60"
                      )}
                      onClick={() => !module.isLocked && onModuleSelect(module.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center mt-1",
                            status === 'completed' && "border-green-500 bg-green-500 text-white",
                            status === 'in-progress' && "border-blue-500 bg-blue-500 text-white",
                            status === 'available' && "border-muted-foreground text-muted-foreground",
                            status === 'locked' && "border-muted-foreground/50 text-muted-foreground/50"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1">
                              Módulo {index + 1}: {module.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {module.progress.completedLessons} de {module.lessons.length} aulas
                            </p>
                            
                            {status !== 'locked' && (
                              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-500 rounded-full",
                                    status === 'completed' ? "bg-green-500" :
                                    status === 'in-progress' ? "bg-blue-500" :
                                    "bg-muted-foreground"
                                  )}
                                  style={{ width: `${module.progress.percentComplete}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Main Content */}
      <div className="min-h-[60vh]">
        {children}
      </div>
    </div>
  );
}
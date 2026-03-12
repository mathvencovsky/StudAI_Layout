import { useState, useEffect } from "react";
import { Clock, Trophy, BookOpen, FileText, MessageSquare, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

import { LearningLayout } from "../layout/learning-layout";
import { ContentContainer } from "../layout/content-container";
import { SidebarContainer } from "../layout/sidebar-container";
import { ContextualBreadcrumb } from "../ui/contextual-breadcrumb";
import { LessonPlayer } from "../ui/lesson-player";
import { CheckpointQuiz } from "../ui/checkpoint-quiz";
import { PracticeExercise } from "../ui/practice-exercise";
import { AIAssistant } from "../ui/ai-assistant";
import { ContinuityActions } from "../ui/continuity-actions";
import { LessonNavigation } from "../ui/lesson-navigation";
import { LessonNotes } from "../ui/lesson-notes";

import type { Track, Module, Lesson, Resource } from "@/types/learning";

interface LessonPageProps {
  track: Track;
  module: Module;
  lesson: Lesson;
  onLessonSelect: (lessonId: string) => void;
  onModuleSelect: (moduleId: string) => void;
  onLessonComplete: (lessonId: string) => void;
  onCheckpointComplete: (checkpointId: string, isCorrect: boolean) => void;
  onExerciseComplete: (exerciseId: string, solution: string) => void;
}

export function LessonPage({
  track,
  module,
  lesson,
  onLessonSelect,
  onModuleSelect,
  onLessonComplete,
  onCheckpointComplete,
  onExerciseComplete
}: LessonPageProps) {
  const [activeTab, setActiveTab] = useState("content");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Find previous and next lessons
  const allLessons = track.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : undefined;

  const handleVideoProgress = (progress: number) => {
    // Update lesson progress
    console.log(`Video progress: ${progress}%`);
  };

  const handleVideoComplete = () => {
    // Mark video as watched
    console.log("Video completed");
  };

  const handleMarkComplete = () => {
    onLessonComplete(lesson.id);
  };

  return (
    <LearningLayout
      track={track}
      currentLessonId={lesson.id}
      onLessonSelect={onLessonSelect}
      onModuleSelect={onModuleSelect}
    >
      <ContentContainer className="space-y-6">
        {/* Breadcrumb and Context */}
        <ContextualBreadcrumb
          track={track}
          module={module}
          lesson={lesson}
        />

        {/* Lesson Navigation - Integrated */}
        <LessonNavigation
          module={module}
          currentLessonId={lesson.id}
          onLessonSelect={onLessonSelect}
        />

        {/* Lesson Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {lesson.description}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Módulo {module.order}: {module.title}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{lesson.estimatedMinutes} minutos</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>+{lesson.xpReward} XP</span>
            </div>
          </div>

          {/* Learning Objectives */}
          {lesson.objectives.length > 0 && (
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="pt-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  🎯 Ao final desta aula, você saberá:
                </h3>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  {lesson.objectives.map((objective, index) => (
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="practice">Prática</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            {/* Video Player */}
            <LessonPlayer
              content={lesson.content}
              chapters={lesson.content.chapters}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
            />

            {/* Checkpoints */}
            {lesson.checkpoints.map((checkpoint, index) => (
              <CheckpointQuiz
                key={checkpoint.id}
                checkpoint={checkpoint}
                onComplete={(isCorrect) => onCheckpointComplete(checkpoint.id, isCorrect)}
              />
            ))}

            {/* Text Content */}
            {lesson.content.textContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Conteúdo Complementar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.content.textContent }}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 mt-6">
            {lesson.exercises.map((exercise) => (
              <PracticeExercise
                key={exercise.id}
                exercise={exercise}
                onComplete={(solution) => onExerciseComplete(exercise.id, solution)}
                onRequestHint={() => setShowAIAssistant(true)}
              />
            ))}
            
            {lesson.exercises.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    Nenhum exercício prático disponível para esta aula.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 mt-6">
            <ResourcesList resources={lesson.resources} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <LessonNotes 
              lessonId={lesson.id}
              lessonTitle={lesson.title}
            />
          </TabsContent>
        </Tabs>

        {/* Continuity Actions */}
        <ContinuityActions
          currentLesson={lesson}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          onPrevious={() => previousLesson && onLessonSelect(previousLesson.id)}
          onNext={() => nextLesson && onLessonSelect(nextLesson.id)}
          onMarkComplete={handleMarkComplete}
          isCompleted={lesson.progress.isCompleted}
        />
      </ContentContainer>

      {/* AI Assistant - Floating when needed */}
      {showAIAssistant && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-h-96">
          <Card className="shadow-2xl border-2 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Assistente IA</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIAssistant(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <AIAssistant
                lessonId={lesson.id}
                moduleId={module.id}
                trackId={track.id}
                currentTopic={lesson.title}
                className="h-64"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Assistant Toggle (when closed) */}
      {!showAIAssistant && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowAIAssistant(true)}
            className="rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      )}
    </LearningLayout>
  );
}

// Resources List Component
function ResourcesList({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Nenhum recurso adicional disponível para esta aula.
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'documentation': return FileText;
      case 'article': return BookOpen;
      case 'code': return Code;
      default: return FileText;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'documentation': return 'Documentação';
      case 'article': return 'Artigos';
      case 'code': return 'Código Fonte';
      case 'external': return 'Links Externos';
      default: return 'Recursos';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedResources).map(([type, typeResources]) => {
        const Icon = getResourceIcon(type);
        
        return (
          <Collapsible key={type} defaultOpen>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Icon className="h-5 w-5" />
                      <span>{getResourceTypeLabel(type)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({typeResources.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 mt-2">
              {typeResources.map((resource) => (
                <Card key={resource.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Abrir
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
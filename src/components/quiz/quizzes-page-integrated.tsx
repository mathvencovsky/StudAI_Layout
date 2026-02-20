import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { useListQuizzes } from "@/hooks/quiz/use-list-quizzes";
import { useListQuizAttempts } from "@/hooks/quiz/use-list-quiz-attempts";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function QuizzesPageIntegrated() {
  const { t } = useTranslation();
  const { data: quizzes, isLoading, error, refetch } = useListQuizzes();
  const { data: attempts } = useListQuizAttempts();

  const getQuizStatus = (quizId: string) => {
    const quizAttempts = attempts?.filter((a) => a.quizId === quizId) || [];
    if (quizAttempts.length === 0) return { status: "not_started", lastScore: null };
    
    const lastAttempt = quizAttempts.sort((a, b) => 
      new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    )[0];
    
    return {
      status: lastAttempt.passed ? "completed" : "in_progress",
      lastScore: lastAttempt.score,
      attempts: quizAttempts.length,
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge variant="outline">Não Iniciado</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-500">Em Andamento</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground">Teste seus conhecimentos e acompanhe seu progresso</p>
      </div>

      {quizzes && quizzes.length === 0 && (
        <EmptyState
          title="Nenhum quiz disponível"
          description="Novos quizzes serão adicionados em breve"
          icon={BookOpen}
        />
      )}

      <div className="grid gap-4">
        {quizzes?.map((quiz) => {
          const { status, lastScore, attempts: attemptCount } = getQuizStatus(quiz.id);
          const questions = quiz.questions ? JSON.parse(quiz.questions as any) : [];
          
          return (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{quiz.title}</CardTitle>
                      {getStatusBadge(status)}
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{questions.length} questões</span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  )}
                  {quiz.passingScore && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Nota mínima: {quiz.passingScore}%</span>
                    </div>
                  )}
                </div>

                {lastScore !== null && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Última nota</span>
                      <span className="text-muted-foreground">{lastScore}%</span>
                    </div>
                    <Progress value={lastScore || 0} className="h-2" />
                    {attemptCount && (
                      <p className="text-xs text-muted-foreground">
                        {attemptCount} {attemptCount === 1 ? "tentativa" : "tentativas"}
                      </p>
                    )}
                  </div>
                )}

                <Link to="/quiz/$quizId" params={{ quizId: quiz.id }}>
                  <Button className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {status === "not_started" ? "Iniciar Quiz" : "Tentar Novamente"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

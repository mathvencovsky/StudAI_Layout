import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useGetQuiz } from "@/hooks/quiz/use-get-quiz";
import { useCreateQuizAttempt } from "@/hooks/quiz/use-create-quiz-attempt";
import { useUpdateProfile } from "@/hooks/user-profile/use-update-profile";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { useCreateDailyTask } from "@/hooks/daily-task/use-create-daily-task";
import { toast } from "sonner";

interface QuizSessionPageProps {
  quizId: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function QuizSessionPage({ quizId }: QuizSessionPageProps) {
  const navigate = useNavigate();
  const { data: quiz, isLoading } = useGetQuiz({ id: quizId });
  const { data: profile } = useMyProfile();
  const createAttempt = useCreateQuizAttempt();
  const updateProfile = useUpdateProfile();
  const createTask = useCreateDailyTask();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questions: Question[] = quiz?.questions ? JSON.parse(quiz.questions as any) : [];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = totalQuestions - Object.keys(answers).length;
    if (unanswered > 0) {
      toast.error(`Você ainda tem ${unanswered} questão(ões) sem resposta`);
      return;
    }

    setSubmitting(true);
    try {
      // Calcular pontuação
      let correctCount = 0;
      questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = quiz?.passingScore ? score >= quiz.passingScore : score >= 70;

      // Registrar tentativa
      await createAttempt.mutateAsync({
        quizId,
        score,
        answers: JSON.stringify(answers),
        startedAt: Date.now(),
        completedAt: Date.now(),
        passed,
      });

      // Atualizar XP se passou
      if (passed && profile) {
        const xpGained = 50;
        const newXp = (profile.xp || 0) + xpGained;
        const newLevel = Math.floor(newXp / 1000) + 1;

        await updateProfile.mutateAsync({
          id: profile.id,
          xp: newXp,
          level: newLevel,
        });
      }

      // Marcar tarefa diária
      await createTask.mutateAsync({
        date: new Date().toISOString().split("t")[0],
        taskType: "quiz",
        isCompleted: true,
        durationMinutes: 0,
      });

      setShowResults(true);
      toast.success(passed ? "Parabéns! Você passou!" : "Continue tentando!");
    } catch (error) {
      toast.error("Erro ao enviar quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Quiz não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = quiz.passingScore ? score >= quiz.passingScore : score >= 70;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {passed ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-3xl">
              {passed ? "Parabéns!" : "Não foi dessa vez"}
            </CardTitle>
            <CardDescription className="text-lg">
              Você acertou {correctCount} de {totalQuestions} questões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Sua pontuação</span>
                <span className="text-2xl font-bold">{score}%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: "/quizzes" })}
              >
                Ver Todos os Quizzes
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Respostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{q.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Sua resposta: {q.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Resposta correta: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>{quiz.title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              Questão {currentQuestion + 1} de {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswer(currentQuestion, parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {currentQuestion === totalQuestions - 1 ? (
              <Button onClick={handleSubmit} disabled={submitting}>
                Finalizar Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Próxima
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

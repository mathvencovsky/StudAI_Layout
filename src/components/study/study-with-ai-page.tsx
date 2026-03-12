import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateStudySession } from "@/hooks/study-session/use-create-session";
import { useUpdateStudySession } from "@/hooks/study-session/use-update-session";
import { useUpdateProfile } from "@/hooks/user-profile/use-update-profile";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * Study with AI page - guided study session
 */
export const StudyWithAIPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useMyProfile();
  const { mutate: createSession } = useCreateStudySession();
  const { mutate: updateSession } = useUpdateStudySession();
  const { mutate: updateProfile } = useUpdateProfile();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleStartSession = () => {
    const now = Date.now();
    setStartTime(now);

    createSession(
      {
        type: "ai_session",
        startedAt: now,
      },
      {
        onSuccess: (data) => {
          setSessionId(data.id);
          setIsSessionActive(true);
          toast.success("Sessão iniciada!");
          
          // Simulate progress
          const interval = setInterval(() => {
            setSessionProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + 10;
            });
          }, 3000);
        },
        onError: () => {
          toast.error("Erro ao iniciar sessão");
        },
      }
    );
  };

  const handleCompleteSession = () => {
    if (!sessionId || !startTime) return;

    const now = Date.now();
    const durationMinutes = Math.round((now - startTime) / 1000 / 60);
    const xpEarned = Math.max(10, durationMinutes * 2); // 2 XP per minute, min 10

    updateSession(
      {
        id: sessionId,
        endedAt: now,
        durationMinutes,
        xpEarned,
        tasksCompleted: ["reading", "practice"],
      },
      {
        onSuccess: () => {
          // Update user XP
          if (profile) {
            const newXp = (profile.xp ?? 0) + xpEarned;
            const newLevel = Math.floor(newXp / 100) + 1;

            updateProfile(
              {
                id: profile.id,
                xp: newXp,
                level: newLevel,
              },
              {
                onSuccess: () => {
                  toast.success(`Sessão concluída! +${xpEarned} XP`);
                  navigate({ to: "/" });
                },
              }
            );
          } else {
            toast.success("Sessão concluída!");
            navigate({ to: "/" });
          }
        },
        onError: () => {
          toast.error("Erro ao finalizar sessão");
        },
      }
    );
  };

  if (!isSessionActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 bg-purple-500/10 rounded-full">
            <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Estudar com IA</h1>
            <p className="text-muted-foreground">
              Sessão de estudo guiada e personalizada
            </p>
          </div>

          <div className="grid gap-4 text-left">
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Recomendação personalizada</h3>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo adaptado ao seu nível e objetivos
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Sessão focada</h3>
                  <p className="text-sm text-muted-foreground">
                    Estudo estruturado com início, meio e fim
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Progresso registrado</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe XP e atualize suas estatísticas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={handleStartSession} className="w-full">
            Iniciar sessão de estudo
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/" })}
            className="w-full"
          >
            Voltar ao dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3 bg-purple-500/10 rounded-full mb-4">
            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sessão em andamento</h1>
          <p className="text-muted-foreground">
            Continue focado no seu estudo
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso da sessão</span>
              <span className="text-sm font-bold">{sessionProgress}%</span>
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Conteúdo recomendado</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">📖 Leitura guiada</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Conceitos fundamentais do tópico
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">💡 Prática</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Exercícios para fixação
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleCompleteSession}
          disabled={sessionProgress < 100}
          className="w-full"
        >
          {sessionProgress < 100 ? (
            <>Aguarde a conclusão...</>
          ) : (
            <>
              Finalizar sessão
              <CheckCircle2 className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

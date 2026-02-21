import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useCreateStudySession } from "@/hooks/study-session/use-create-session";
import { useUpdateStudySession } from "@/hooks/study-session/use-update-session";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { BookOpen, Pause, Square } from "lucide-react";
import { useState, useEffect } from "react";

export function StudyPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [elapsedTime, setElapsedTime] = useState(0);

  const { data: sessions = [], isLoading, error, refetch } = useListStudySessions();

  const activeSession = sessions.find((s) => !s.endedAt) ?? null;

  const startMutation = useCreateStudySession();
  const endMutation = useUpdateStudySession();

  useEffect(() => {
    if (activeSession?.startedAt) {
      const interval = setInterval(() => {
        const start = activeSession.startedAt * 1000;
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    startMutation.mutate(
      {
        startedAt: Math.floor(Date.now() / 1000),
        tasksCompleted: [],
        xpEarned: 0,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
      }
    );
  };

  const handleEnd = (sessionId: string) => {
    const durationMinutes = Math.floor(elapsedTime / 60);
    endMutation.mutate(
      {
        id: sessionId,
        endedAt: Math.floor(Date.now() / 1000),
        durationMinutes,
        xpEarned: durationMinutes * 5,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          setElapsedTime(0);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  if (!activeSession) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t("study")}</h1>
            <p className="text-muted-foreground mt-2">
              {t("pages.study.start-description", "Inicie uma sessão de estudo focada")}
            </p>
          </div>

          <EmptyState
            title={t("pages.study.ready", "Pronto para estudar?")}
            description={t("pages.study.ready-description", "Inicie uma sessão de estudo e acompanhe seu progresso em tempo real")}
            icon={BookOpen}
            action={{
              label: t("pages.study.start-session", "Iniciar Sessão"),
              onClick: handleStart,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("study")}</h1>
          <p className="text-muted-foreground mt-2">{t("pages.study.in-progress", "Sessão em andamento")}</p>
        </div>

        <div className="border rounded-lg bg-card p-8">
          <div className="text-center space-y-6">
            <div>
              <div className="text-6xl font-mono font-bold text-primary">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t("pages.study.elapsed", "Tempo decorrido")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {activeSession.notes ?? t(`pages.sessions.type.${activeSession.type}`, activeSession.type ?? "")}
              </h3>
              <p className="text-sm text-muted-foreground">{t("pages.study.current-topic", "Tópico atual")}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Math.floor(elapsedTime / 60)}
                </div>
                <p className="text-xs text-muted-foreground">{t("pages.study.minutes", "Minutos")}</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Math.floor(elapsedTime / 60) * 5}
                </div>
                <p className="text-xs text-muted-foreground">{t("pages.study.estimated-xp", "XP Estimado")}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                disabled
                className="gap-2"
              >
                <Pause className="h-5 w-5" />
                {t("pages.study.pause", "Pausar")}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={() => handleEnd(activeSession.id)}
                disabled={endMutation.isPending}
                className="gap-2"
              >
                <Square className="h-5 w-5" />
                {t("pages.study.end-session", "Finalizar Sessão")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

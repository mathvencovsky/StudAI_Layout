import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import {
  getActiveSessionStub,
  startSessionStub,
  endSessionStub,
} from "@/api/stubs/sessions-stub";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { BookOpen, Pause, Square } from "lucide-react";
import { useState, useEffect } from "react";

export function EstudarPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [elapsedTime, setElapsedTime] = useState(0);

  const { data: activeSession, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.sessions.active,
    queryFn: getActiveSessionStub,
    refetchInterval: 1000, // Atualiza a cada segundo
  });

  const startMutation = useMutation({
    mutationFn: () => startSessionStub("Sessão de Estudo"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });

  const endMutation = useMutation({
    mutationFn: (sessionId: string) => endSessionStub(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      setElapsedTime(0);
    },
  });

  // Atualiza tempo decorrido
  useEffect(() => {
    if (activeSession?.startTime) {
      const interval = setInterval(() => {
        const start = new Date(activeSession.startTime).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - start) / 1000);
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  // Sem sessão ativa
  if (!activeSession) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t("study")}</h1>
            <p className="text-muted-foreground mt-2">
              Inicie uma sessão de estudo focada
            </p>
          </div>

          <EmptyState
            title="Pronto para estudar?"
            description="Inicie uma sessão de estudo e acompanhe seu progresso em tempo real"
            icon={BookOpen}
            action={{
              label: "Iniciar Sessão",
              onClick: () => startMutation.mutate(),
            }}
          />
        </div>
      </div>
    );
  }

  // Sessão ativa
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("study")}</h1>
          <p className="text-muted-foreground mt-2">Sessão em andamento</p>
        </div>

        <div className="border rounded-lg bg-card p-8">
          <div className="text-center space-y-6">
            {/* Cronômetro */}
            <div>
              <div className="text-6xl font-mono font-bold text-primary">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Tempo decorrido
              </p>
            </div>

            {/* Tópico */}
            <div>
              <h3 className="text-lg font-semibold">{activeSession.topic}</h3>
              <p className="text-sm text-muted-foreground">Tópico atual</p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Math.floor(elapsedTime / 60)}
                </div>
                <p className="text-xs text-muted-foreground">Minutos</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Math.floor(elapsedTime / 60) * 5}
                </div>
                <p className="text-xs text-muted-foreground">XP Estimado</p>
              </div>
            </div>

            {/* Controles */}
            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                disabled
                className="gap-2"
              >
                <Pause className="h-5 w-5" />
                Pausar
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={() => endMutation.mutate(activeSession.id)}
                disabled={endMutation.isPending}
                className="gap-2"
              >
                <Square className="h-5 w-5" />
                Finalizar Sessão
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

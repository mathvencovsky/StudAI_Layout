import { Clock } from "lucide-react";
import { useSessions } from "@/hooks/sessions/use-sessions";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function SessoesPageIntegrated() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useSessions();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t("pages.sessions.today", "Hoje");
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("pages.sessions.yesterday", "Ontem");
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.sessions.title", "Sessões")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.sessions.description", "Histórico de estudo.")}
        </p>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && data && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                {data.summary.totalSessions}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.sessions.total", "sessões")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                {formatDuration(data.summary.totalMinutes)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.sessions.accumulated", "acumulado")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                {data.summary.averageDuration}min
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.sessions.average", "por sessão")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                {data.sessions.filter((s) => {
                  const sessionDate = new Date(s.startTime);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return sessionDate >= weekAgo;
                }).length}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.sessions.week", "semana")}
              </p>
            </div>
          </div>

          {/* Recent Sessions */}
          {data.sessions.length === 0 ? (
            <EmptyState
              title={t("pages.sessions.no-sessions", "Nenhuma sessão registrada")}
              description={t(
                "pages.sessions.no-sessions-description",
                "Suas sessões de estudo aparecerão aqui"
              )}
              icon={Clock}
            />
          ) : (
            <section className="border rounded-lg bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium text-foreground">
                  {t("pages.sessions.recent", "Sessões recentes")}
                </h2>
              </div>
              <div className="divide-y">
                {data.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {session.topic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(session.startTime)} ·{" "}
                        {formatDuration(session.duration)}
                        {session.xpEarned > 0 && ` · +${session.xpEarned} XP`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {t(`pages.sessions.type.${session.type}`, session.type)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

import { Clock, Target, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { useUpcomingEvents } from "@/hooks/calendar/use-upcoming-events";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

const getEventIcon = (type: string) => {
  switch (type) {
    case "session":
      return Clock;
    case "goal":
      return Target;
    case "review":
      return BookOpen;
    default:
      return Clock;
  }
};

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatEventTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function CalendarioPageIntegrated() {
  const { t } = useTranslation();
  const { data: events, isLoading, error, refetch } = useUpcomingEvents(7);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.calendar.title", "Calendário")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.calendar.description", "Sessões e prazos.")}
        </p>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {t("pages.calendar.upcoming", "Próximos eventos")}
            </h2>
          </div>

          {(!events || events.length === 0) ? (
            <div className="p-4">
              <EmptyState
                title={t("pages.calendar.no-events", "Nenhum evento agendado")}
                description={t(
                  "pages.calendar.no-events-description",
                  "Seus próximos eventos aparecerão aqui"
                )}
                icon={CalendarIcon}
              />
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <EventIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatEventDate(event.startTime)} ·{" "}
                        {event.endTime
                          ? `${formatEventTime(event.startTime)} - ${formatEventTime(event.endTime)}`
                          : formatEventTime(event.startTime)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {t(`pages.calendar.type.${event.type}`, event.type)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

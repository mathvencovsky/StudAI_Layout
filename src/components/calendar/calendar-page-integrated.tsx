import { Clock, Target, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { useListCalendarEvents } from "@/hooks/calendar-event/use-list-calendar-events";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

const getEventIcon = (type: string | null | undefined) => {
  switch (type) {
    case "session":
      return Clock;
    case "deadline":
    case "exam":
      return Target;
    case "reminder":
      return BookOpen;
    default:
      return Clock;
  }
};

const formatTimestamp = (ts: number | null | undefined, options: Intl.DateTimeFormatOptions) => {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString("pt-BR", options);
};

export function CalendarPageIntegrated() {
  const { t } = useTranslation();
  const { data: events, isLoading, error, refetch } = useListCalendarEvents();

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
                const EventIcon = getEventIcon(event.eventType);
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
                        {formatTimestamp(event.startDate, { day: "2-digit", month: "2-digit", year: "numeric" })}
                        {event.startDate && ` · ${formatTimestamp(event.startDate, { hour: "2-digit", minute: "2-digit" })}`}
                        {event.endDate && ` - ${formatTimestamp(event.endDate, { hour: "2-digit", minute: "2-digit" })}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {t(`pages.calendar.type.${event.eventType}`, event.eventType ?? "")}
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

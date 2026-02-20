import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { useListCalendarEvents } from "@/hooks/calendar-event/use-list-calendar-events";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function CalendarioPage() {
  const { t } = useTranslation();
  const { data: events, isLoading, error, refetch } = useListCalendarEvents();

  const sortedEvents = events?.sort((a, b) => 
    new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime()
  ) || [];

  const upcomingEvents = sortedEvents.filter((e) => 
    new Date(e.startDate || 0) >= new Date()
  );

  const getEventTypeBadge = (type: string | null | undefined) => {
    const colors: Record<string, string> = {
      session: "bg-blue-500",
      deadline: "bg-red-500",
      exam: "bg-purple-500",
      reminder: "bg-yellow-500",
    };
    return colors[type || ""] || "bg-gray-500";
  };

  const getEventTypeLabel = (type: string | null | undefined) => {
    const labels: Record<string, string> = {
      session: t("pages.calendar.type-session"),
      deadline: t("pages.calendar.type-deadline"),
      exam: t("pages.calendar.type-exam"),
      reminder: t("pages.calendar.type-reminder"),
    };
    return labels[type || ""] || type || t("pages.calendar.type-event");
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pages.calendar.title")}</h1>
        <p className="text-muted-foreground">{t("pages.calendar.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            {t("pages.calendar.upcoming")}
          </CardTitle>
          <CardDescription>
            {upcomingEvents.length} {t("pages.calendar.events", { count: upcomingEvents.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <EmptyState
              title={t("pages.calendar.no-upcoming")}
              description={t("pages.calendar.no-upcoming-description")}
              icon={Calendar}
            />
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <Badge className={getEventTypeBadge(event.eventType)}>
                        {getEventTypeLabel(event.eventType)}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(event.startDate || 0).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      {event.endDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {t("pages.calendar.until")} {new Date(event.endDate).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

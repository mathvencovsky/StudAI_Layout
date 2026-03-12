import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, BookOpen, CheckCircle2, Calendar } from "lucide-react";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import type { StudySession } from "@/model/study-session";

export function SessoesPage() {
  const { t } = useTranslation();
  const { data: sessions, isLoading, error, refetch } = useListStudySessions();

  const sortedSessions = sessions?.sort((a: StudySession, b: StudySession) => 
    new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime()
  ) || [];

  const totalMinutes = sessions?.reduce((sum: number, s: StudySession) => sum + (s.durationMinutes || 0), 0) || 0;
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalSessions = sessions?.length || 0;
  const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const getTypeLabel = (type: string | null | undefined) => {
    switch (type) {
      case "ai_session": return t("pages.sessions.type-ai");
      case "quiz": return t("pages.sessions.type-quiz");
      case "review": return t("pages.sessions.type-review");
      case "reading": return t("pages.sessions.type-reading");
      case "practice": return t("pages.sessions.type-practice");
      default: return type || t("pages.sessions.type-other");
    }
  };

  const getTypeBadge = (type: string | null | undefined) => {
    const colors: Record<string, string> = {
      ai_session: "bg-purple-500",
      quiz: "bg-blue-500",
      review: "bg-green-500",
      reading: "bg-yellow-500",
      practice: "bg-orange-500",
    };
    return colors[type || ""] || "bg-gray-500";
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pages.sessions.title")}</h1>
        <p className="text-muted-foreground">{t("pages.sessions.description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("pages.sessions.total-hours")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHours}h</div>
            <p className="text-sm text-muted-foreground">{totalMinutes} {t("pages.sessions.minutes")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {t("pages.sessions.total-sessions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSessions}</div>
            <p className="text-sm text-muted-foreground">{t("pages.sessions.complete-sessions")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("pages.sessions.average")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgMinutes} min</div>
            <p className="text-sm text-muted-foreground">{t("pages.sessions.average-duration")}</p>
          </CardContent>
        </Card>
      </div>

      {sortedSessions.length === 0 && (
        <EmptyState
          title={t("pages.sessions.empty")}
          description={t("pages.sessions.empty-description")}
          icon={Brain}
        />
      )}

      <div className="space-y-4">
        {sortedSessions.map((session: StudySession) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {session.type ? getTypeLabel(session.type) : t("pages.sessions.session")}
                    </CardTitle>
                    <Badge className={getTypeBadge(session.type)}>
                      {getTypeLabel(session.type)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {session.startedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.startedAt).toLocaleString("pt-BR")}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{session.durationMinutes || 0} min</span>
                </div>
                {session.xpEarned && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>+{session.xpEarned} XP</span>
                  </div>
                )}
                {session.score !== null && session.score !== undefined && (
                  <div className="flex items-center gap-1">
                    <span>{t("pages.sessions.score")}: {session.score}%</span>
                  </div>
                )}
              </div>

              {session.notes && (
                <p className="text-sm text-muted-foreground italic">
                  {session.notes}
                </p>
              )}

              {session.tasksCompleted && (
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(session.tasksCompleted as any).map((task: string, i: number) => (
                    <Badge key={i} variant="outline">{task}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

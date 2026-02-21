import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, Target, Calendar, Flame } from "lucide-react";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import type { StudySession } from "@/model/study-session";

export function ReportsPage() {
  const { t } = useTranslation();
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useListStudySessions();
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useMyProfile();
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  if (sessionsLoading || profileLoading) return <LoadingState />;
  if (sessionsError) return <ErrorState error={sessionsError} onRetry={refetchSessions} />;
  if (profileError) return <ErrorState error={profileError} onRetry={refetchProfile} />;

  const now = new Date();
  const daysAgo = period === "7d" ? 7 : 30;
  const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  const recentSessions = sessions?.filter((s: StudySession) => {
    const sessionDate = new Date(s.startedAt || 0);
    return sessionDate >= startDate;
  }) || [];

  const totalMinutes = recentSessions.reduce((sum: number, s: StudySession) => sum + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgPerDay = (totalMinutes / daysAgo).toFixed(0);
  const activeDays = new Set(recentSessions.map((s: StudySession) => 
    new Date(s.startedAt || 0).toISOString().split("t")[0]
  )).size;

  // Distribuição por tipo
  const byType: Record<string, number> = {};
  recentSessions.forEach((s: StudySession) => {
    const type = s.type || "other";
    byType[type] = (byType[type] || 0) + (s.durationMinutes || 0);
  });

  const typeLabels: Record<string, string> = {
    ai_session: t("pages-reports-type-ai"),
    quiz: t("pages-reports-type-quiz"),
    review: t("pages-reports-type-review"),
    reading: t("pages-reports-type-reading"),
    practice: t("pages-reports-type-practice"),
    other: t("pages-reports-type-other"),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pages-reports-title")}</h1>
        <p className="text-muted-foreground">{t("pages-reports-description")}</p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as "7d" | "30d")}>
        <TabsList>
          <TabsTrigger value="7d">{t("pages-reports-last-7-days")}</TabsTrigger>
          <TabsTrigger value="30d">{t("pages-reports-last-30-days")}</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-primary" />
                  {t("pages-reports-total-time")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours}h</div>
                <p className="text-xs text-muted-foreground">{totalMinutes} {t("pages-reports-minutes")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4 text-primary" />
                  {t("pages-reports-active-days")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDays}</div>
                <p className="text-xs text-muted-foreground">{t("pages-reports-of")} {daysAgo} {t("pages-reports-days")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t("pages-reports-average-day")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgPerDay} min</div>
                <p className="text-xs text-muted-foreground">{t("pages-reports-per-day")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Flame className="h-4 w-4 text-primary" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.streak || 0}</div>
                <p className="text-xs text-muted-foreground">{t("pages-reports-consecutive-days")}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("pages-reports-distribution")}</CardTitle>
              <CardDescription>
                {t("pages-reports-distribution-description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(byType).map(([type, minutes]) => {
                const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{typeLabels[type] || type}</span>
                      <span className="text-muted-foreground">
                        {(minutes / 60).toFixed(1)}h ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("pages-reports-efficiency")}</CardTitle>
              <CardDescription>
                {t("pages-reports-efficiency-description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t("pages-reports-complete-sessions")}</span>
                  </div>
                  <div className="text-2xl font-bold">{recentSessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeDays > 0 ? (recentSessions.length / activeDays).toFixed(1) : 0} {t("pages-reports-per-active-day")}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t("pages-reports-xp-earned")}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {recentSessions.reduce((sum: number, s: StudySession) => sum + (s.xpEarned || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalMinutes > 0 
                      ? (recentSessions.reduce((sum: number, s: StudySession) => sum + (s.xpEarned || 0), 0) / (totalMinutes / 60)).toFixed(1)
                      : 0} {t("pages-reports-xp-per-hour")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

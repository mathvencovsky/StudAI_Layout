import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  BookOpen, 
  CheckCircle2, 
  Clock,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import { useActivityFeed } from "@/hooks/activity/use-activity-feed";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import type { Activity as ActivityType } from "@/api/stubs/activity-stub";

export function AtividadePage() {
  const { t } = useTranslation();
  const { data: activities, isLoading, error, refetch } = useActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "course_completed":
        return Trophy;
      case "module_completed":
        return CheckCircle2;
      case "task_completed":
        return Target;
      case "quiz_completed":
        return Zap;
      case "study_session":
        return Clock;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "course_completed":
        return "text-yellow-500";
      case "module_completed":
        return "text-green-500";
      case "task_completed":
        return "text-blue-500";
      case "quiz_completed":
        return "text-purple-500";
      case "study_session":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("pages-activity-just-now");
    if (diffMins < 60) return t("pages.activity.minutes-ago", { count: diffMins });
    if (diffHours < 24) return t("pages.activity.hours-ago", { count: diffHours });
    if (diffDays === 1) return t("pages-activity-yesterday");
    return t("pages.activity.days-ago", { count: diffDays });
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      course_completed: t("pages-activity-course-completed"),
      module_completed: t("pages-activity-module-completed"),
      task_completed: t("pages-activity-task-completed"),
      quiz_completed: t("pages-activity-quiz-completed"),
      study_session: t("pages-activity-study-session"),
    };
    return labels[type] || type;
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!activities || activities.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t("pages-activity-title")}</h1>
          <p className="text-muted-foreground">{t("pages-activity-description")}</p>
        </div>
        <EmptyState
          title={t("pages-activity-empty")}
          description={t("pages-activity-empty-description")}
          icon={Activity}
        />
      </div>
    );
  }

  const today = new Date().toDateString();
  const todayActivity = activities.filter(
    (activity: ActivityType) => new Date(activity.timestamp).toDateString() === today
  );

  const thisWeek = activities.filter((activity: ActivityType) => {
    const activityDate = new Date(activity.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return activityDate >= weekAgo;
  });

  const todayXP = todayActivity.reduce((sum: number, a: ActivityType) => sum + a.xp, 0);
  const weekXP = thisWeek.reduce((sum: number, a: ActivityType) => sum + a.xp, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages-activity-title")}</h1>
        <p className="text-muted-foreground">{t("pages-activity-description")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-activity-today")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivity.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayXP} XP {t("pages-activity-earned")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-activity-this-week")}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeek.length}</div>
            <p className="text-xs text-muted-foreground">
              {weekXP} XP {t("pages-activity-earned")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-activity-total")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">
              {activities.reduce((sum, a) => sum + a.xp, 0)} XP {t("pages-activity-earned")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">{t("pages-activity-all")}</TabsTrigger>
          <TabsTrigger value="today">{t("pages-activity-today")}</TabsTrigger>
          <TabsTrigger value="week">{t("pages-activity-this-week")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-activity-history")}</CardTitle>
              <CardDescription>{t("pages-activity-history-description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity: ActivityType) => {
                  const Icon = getActivityIcon(activity.type);
                  const color = getActivityColor(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-muted ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{activity.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {getActivityTypeLabel(activity.type)}
                          </Badge>
                          <span>•</span>
                          <span>{formatTimestamp(activity.timestamp) as string}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">+{activity.xp} XP</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-activity-today-activities")}</CardTitle>
              <CardDescription>
                {todayActivity.length} {t("pages-activity-activities-today")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayActivity.length > 0 ? (
                <div className="space-y-4">
                  {todayActivity.map((activity: ActivityType) => {
                    const Icon = getActivityIcon(activity.type);
                    const color = getActivityColor(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <div className={`p-2 rounded-lg bg-muted ${color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimestamp(activity.timestamp) as string}
                          </p>
                        </div>
                        <Badge variant="secondary">+{activity.xp} XP</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState 
                  title={t("pages-activity-no-activities-today")} 
                  description={t("pages-activity-empty-description")}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-activity-week-activities")}</CardTitle>
              <CardDescription>
                {thisWeek.length} {t("pages-activity-activities-week")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {thisWeek.length > 0 ? (
                <div className="space-y-4">
                  {thisWeek.map((activity: ActivityType) => {
                    const Icon = getActivityIcon(activity.type);
                    const color = getActivityColor(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <div className={`p-2 rounded-lg bg-muted ${color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimestamp(activity.timestamp) as string}
                          </p>
                        </div>
                        <Badge variant="secondary">+{activity.xp} XP</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState 
                  title={t("pages-activity-no-activities-week")} 
                  description={t("pages-activity-empty-description")}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

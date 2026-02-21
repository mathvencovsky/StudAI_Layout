import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Target, 
  Flame,
  Trophy
} from "lucide-react";
import { useMetrics } from "@/hooks/metrics/use-metrics";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";

export function MetricasPage() {
  const { data: metrics, isLoading, error, refetch } = useMetrics();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!metrics) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-medium text-foreground">Métricas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Estatísticas de desempenho</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-metrics-study-time")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.studyTime.total}h</div>
            <Progress 
              value={(metrics.studyTime.thisMonth / metrics.studyTime.monthlyGoal) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.studyTime.monthlyGoal - metrics.studyTime.thisMonth}h {t("pages-metrics-to-goal")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-metrics-current-streak")}
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.streak.current} {t("pages-metrics-days")}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("pages-metrics-record")}: {metrics.streak.longest} {t("pages-metrics-days")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-metrics-total-xp")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.xp.total} XP</div>
            <Progress 
              value={((metrics.xp.total % metrics.xp.xpPerLevel) / metrics.xp.xpPerLevel) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t("pages-metrics-level")} {metrics.xp.level} • {metrics.xp.xpToNextLevel} XP {t("pages-metrics-to-next-level")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pages-metrics-completions")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completions.total}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.completions.courses} {t("pages-metrics-courses")} • {metrics.completions.modules} {t("pages-metrics-modules")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">{t("pages-metrics-activity")}</TabsTrigger>
          <TabsTrigger value="progress">{t("pages-metrics-progress")}</TabsTrigger>
          <TabsTrigger value="achievements">{t("pages-metrics-achievements")}</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-metrics-weekly-activity")}</CardTitle>
              <CardDescription>{t("pages-metrics-weekly-activity-description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.weeklyActivity.map((day, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {day.minutes} min
                        </span>
                        <span className="text-muted-foreground">
                          {day.xp} XP
                        </span>
                      </div>
                    </div>
                    <Progress value={day.minutes > 0 ? (day.minutes / 60) * 100 : 0} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("pages-metrics-monthly-stats")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("pages-metrics-active-days")}</span>
                    <span className="font-bold">{metrics.monthlyStats.activeDays}/30</span>
                  </div>
                  <Progress value={(metrics.monthlyStats.activeDays / 30) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("pages-metrics-daily-goal")}</span>
                    <span className="font-bold">{metrics.monthlyStats.dailyGoalRate}%</span>
                  </div>
                  <Progress value={metrics.monthlyStats.dailyGoalRate} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-metrics-progress-by-category")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.progressByCategory.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.progress}%</span>
                    </div>
                    <Progress value={category.progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-metrics-achievements")}</CardTitle>
              <CardDescription>
                {metrics.achievements.filter(a => a.unlocked).length} {t("pages-metrics-of")} {metrics.achievements.length} {t("pages-metrics-unlocked")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {metrics.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked
                        ? "bg-primary/5 border-primary"
                        : "bg-muted/50 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlocked && (
                          <Badge variant="default" className="mt-1">
                            {t("pages-metrics-unlocked")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

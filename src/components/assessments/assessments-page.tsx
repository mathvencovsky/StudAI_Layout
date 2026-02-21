import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  Clock, 
  Trophy, 
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useListAssessments } from "@/hooks/assessment/use-list-assessments";
import { type Assessment } from "@/model/assessment";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function AssessmentsPage() {
  const { t } = useTranslation();
  const { data: allAssessments, isLoading, error, refetch } = useListAssessments();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!allAssessments) return <EmptyState title={t("pages-assessments-empty")} description={t("pages-assessments-description")} />;

  const available = allAssessments.filter((a) => a.status === "available");
  const inProgress = allAssessments.filter((a) => a.status === "in_progress");
  const completed = allAssessments.filter((a) => a.status === "completed");

  const data = { available, inProgress, completed };

  const stats = {
    total: allAssessments.length,
    completed: completed.length,
    pending: available.length,
    averageScore: completed.length > 0
      ? Math.round(completed.reduce((sum, a) => sum + (a.score ?? 0), 0) / completed.length)
      : 0,
  };

  const getStatusBadge = (status: Assessment["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t("pages-assessments-completed")}
          </Badge>
        );
      case "available":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {t("pages-assessments-available")}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t("pages-assessments-in-progress")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages-assessments-title")}</h1>
        <p className="text-muted-foreground">{t("pages-assessments-description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-assessments-total")}</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} {t("pages-assessments-completed")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-assessments-average")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <Progress value={stats.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-assessments-pending")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{t("pages-assessments-waiting")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-assessments-completion-rate")}</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{t("pages-assessments-completion-rate")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">{t("pages-assessments-all")}</TabsTrigger>
          <TabsTrigger value="completed">{t("pages-assessments-completed")}</TabsTrigger>
          <TabsTrigger value="available">{t("pages-assessments-available")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {allAssessments.length === 0 ? (
            <EmptyState title={t("pages-assessments-empty")} description={t("pages-assessments-description")} />
          ) : (
            allAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    {getStatusBadge(assessment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assessment.status === "completed" && assessment.score !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t("pages-assessments-score")}</span>
                          <span className={`text-2xl font-bold ${getScoreColor(assessment.score ?? 0)}`}>
                            {assessment.score}%
                          </span>
                        </div>
                        <Progress value={assessment.score} />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {assessment.questionCount} {t("pages-assessments-questions")}
                          </span>
                          {assessment.completedAt && (
                            <span className="text-muted-foreground">
                              {new Date(assessment.completedAt * 1000).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {assessment.status === "in_progress" && (
                      <div className="text-sm text-muted-foreground">
                        {assessment.questionCount} {t("pages-assessments-questions")} • {t("pages-assessments-in-progress")}
                      </div>
                    )}

                    {assessment.status === "available" && (
                      <div className="text-sm text-muted-foreground">
                        {assessment.questionCount} {t("pages-assessments-questions")} • {t("pages-assessments-not-started")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {data.completed.length === 0 ? (
            <EmptyState title={t("pages-assessments-no-completed")} description={t("pages-assessments-description")} />
          ) : (
            data.completed.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    {getStatusBadge(assessment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assessment.score !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t("pages-assessments-score")}</span>
                          <span className={`text-2xl font-bold ${getScoreColor(assessment.score ?? 0)}`}>
                            {assessment.score}%
                          </span>
                        </div>
                        <Progress value={assessment.score} />
                      </div>
                    )}
                    <Button variant="outline">{t("pages-assessments-view-results")}</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-6 space-y-4">
          {data.available.length === 0 ? (
            <EmptyState title={t("pages-assessments-no-available")} description={t("pages-assessments-description")} />
          ) : (
            data.available.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    {getStatusBadge(assessment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {assessment.questionCount} {t("pages-assessments-questions")}
                    </div>
                    <Button>{t("pages-assessments-start")}</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

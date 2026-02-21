import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useListReviewItems } from "@/hooks/review-item/use-list-review-items";
import { useUpdateReviewItem } from "@/hooks/review-item/use-update-review-item";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function RevisoesPage() {
  const { t } = useTranslation();
  const { data: reviewItems, isLoading, error, refetch } = useListReviewItems();
  const updateReviewItem = useUpdateReviewItem();
  const [reviewing, setReviewing] = useState(false);

  const today = new Date().toISOString().split("t")[0];
  
  const pendingReviews = reviewItems?.filter((item) => {
    const dueDate = item.nextDueAt ? new Date(item.nextDueAt).toISOString().split("t")[0] : null;
    return dueDate && dueDate <= today;
  }) || [];

  const completedToday = reviewItems?.filter((item) => {
    const lastStudied = item.lastStudiedAt ? new Date(item.lastStudiedAt).toISOString().split("t")[0] : null;
    return lastStudied === today;
  }) || [];

  const handleStartReview = async (itemId: string) => {
    if (reviewing) return;

    setReviewing(true);
    try {
      const item = reviewItems?.find((r) => r.id === itemId);
      if (!item) return;

      // Calcular próxima data de revisão (algoritmo simples de espaçamento)
      const retention = item.retention || 0;
      const reviewCount = (item.reviewCount || 0) + 1;
      const daysToAdd = Math.min(30, Math.pow(2, reviewCount)); // 2, 4, 8, 16, 30 dias
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + daysToAdd);

      await updateReviewItem.mutateAsync({
        id: itemId,
        lastStudiedAt: Date.now(),
        nextDueAt: nextDue.getTime(),
        retention: Math.min(100, retention + 10),
        reviewCount,
      });

      toast.success(t("pages-reviews-review-completed"));
    } catch (error) {
      toast.error(t("pages-reviews-review-error"));
    } finally {
      setReviewing(false);
    }
  };

  const getPriorityBadge = (priority: string | null | undefined) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">{t("pages-reviews-priority-high")}</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">{t("pages-reviews-priority-medium")}</Badge>;
      case "low":
        return <Badge className="bg-green-500">{t("pages-reviews-priority-low")}</Badge>;
      default:
        return <Badge variant="outline">{t("pages-reviews-priority-normal")}</Badge>;
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pages-reviews-title")}</h1>
        <p className="text-muted-foreground">{t("pages-reviews-description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              {t("pages-reviews-pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReviews.length}</div>
            <p className="text-sm text-muted-foreground">{t("pages-reviews-items-today")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {t("pages-reviews-completed-today")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedToday.length}</div>
            <p className="text-sm text-muted-foreground">{t("pages-reviews-reviews-today")}</p>
          </CardContent>
        </Card>
      </div>

      {pendingReviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("pages-reviews-to-review-today")}</h2>
          {pendingReviews.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{item.topic}</CardTitle>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <CardDescription>
                      {t("pages-reviews-module")}: {item.moduleId || t("pages-reviews-general")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t("pages-reviews-retention")}</span>
                    <span className="text-muted-foreground">{item.retention || 0}%</span>
                  </div>
                  <Progress value={item.retention || 0} className="h-2" />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {t("pages-reviews-last-review")}:{" "}
                      {item.lastStudiedAt
                        ? new Date(item.lastStudiedAt).toLocaleDateString("pt-BR")
                        : t("pages-reviews-never")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    <span>{item.reviewCount || 0} {t("pages-reviews-reviews")}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleStartReview(item.id)}
                  disabled={reviewing}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t("pages-reviews-mark-reviewed")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pendingReviews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("pages-reviews-all-done")}</h3>
            <p className="text-muted-foreground">
              {t("pages-reviews-no-pending")}
            </p>
          </CardContent>
        </Card>
      )}

      {completedToday.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("pages-reviews-reviewed-today")}</h2>
          <div className="grid gap-4">
            {completedToday.map((item) => (
              <Card key={item.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.topic}</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("pages-reviews-next-review")}:{" "}
                    {item.nextDueAt
                      ? new Date(item.nextDueAt).toLocaleDateString("pt-BR")
                      : t("pages-reviews-to-define")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

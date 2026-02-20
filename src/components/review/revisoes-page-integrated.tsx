import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, BookOpen } from "lucide-react";
import { useReviews } from "@/hooks/reviews/use-reviews";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "text-green-600";
    case "medium":
      return "text-amber-600";
    case "hard":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
};

const calculateRetention = (difficulty: string) => {
  // Simula cálculo de retenção baseado na dificuldade
  switch (difficulty) {
    case "easy":
      return 85;
    case "medium":
      return 65;
    case "hard":
      return 45;
    default:
      return 50;
  }
};

export function RevisoesPageIntegrated() {
  const { t } = useTranslation();
  const {
    data: pendingReviews,
    isLoading: pendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = useReviews("today");
  const { data: completedReviews } = useReviews("completed");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return t("pages.reviews.today", "Hoje");
    if (diffDays === 1) return t("pages.reviews.tomorrow", "Amanhã");
    if (diffDays > 1) return `${diffDays} ${t("pages.reviews.days", "dias")}`;
    if (diffDays === -1) return t("pages.reviews.yesterday", "Ontem");
    return `${Math.abs(diffDays)} ${t("pages.reviews.days-ago", "dias atrás")}`;
  };

  const pendingCount = pendingReviews?.length || 0;
  const completedTodayCount = completedReviews?.filter((r) => {
    const reviewDate = new Date(r.dueDate);
    const today = new Date();
    return reviewDate.toDateString() === today.toDateString();
  }).length || 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.reviews.title", "Revisões")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.reviews.description", "Repetição espaçada para retenção.")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages.reviews.pending", "Pendentes")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            {completedTodayCount}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages.reviews.today-completed", "Hoje")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">78%</p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages.reviews.retention", "Retenção")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">~25min</p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages.reviews.estimated", "Estimado")}
          </p>
        </div>
      </div>

      {/* Pending Reviews */}
      {pendingLoading && <LoadingState />}
      {pendingError && <ErrorState error={pendingError} onRetry={refetchPending} />}

      {!pendingLoading && !pendingError && (
        <>
          {pendingCount === 0 ? (
            <EmptyState
              title={t("pages.reviews.no-pending", "Nenhuma revisão pendente")}
              description={t(
                "pages.reviews.no-pending-description",
                "Você está em dia com suas revisões!"
              )}
              icon={BookOpen}
            />
          ) : (
            <section className="border rounded-lg bg-card overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-medium text-foreground">
                  {t("pages.reviews.pending-title", "Pendentes")}
                </h2>
                <Button size="sm" className="h-7 text-xs">
                  {t("pages.reviews.start-review", "Iniciar revisão")}
                </Button>
              </div>
              <div className="divide-y">
                {pendingReviews?.map((review) => {
                  const retention = calculateRetention(review.difficulty);
                  return (
                    <div
                      key={review.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {review.contentTitle}
                          </p>
                          <span
                            className={`text-[10px] capitalize ${getDifficultyColor(review.difficulty)}`}
                          >
                            {t(
                              `pages.reviews.difficulty.${review.difficulty}`,
                              review.difficulty
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(review.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">
                          {retention}%
                        </p>
                        <Progress value={retention} className="h-1 w-12 mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Completed Today */}
          {completedReviews && completedReviews.length > 0 && (
            <section className="border rounded-lg bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium text-foreground flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  {t("pages.reviews.completed-today", "Concluídas hoje")}
                </h2>
              </div>
              <div className="divide-y">
                {completedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-4"
                  >
                    <span className="text-sm text-foreground">
                      {review.contentTitle}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {calculateRetention(review.difficulty)}%
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

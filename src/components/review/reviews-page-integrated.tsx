import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, BookOpen } from "lucide-react";
import { useListReviewItems } from "@/hooks/review-item/use-list-review-items";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "text-green-600";
    case "medium":
      return "text-amber-600";
    case "high":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
};

const formatDueDate = (timestampSeconds: number, t: TFunction) => {
  const dueDay = new Date(timestampSeconds * 1000);
  dueDay.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t("pages-reviews-today");
  if (diffDays === 1) return t("pages-reviews-tomorrow");
  if (diffDays > 1) return `${diffDays} ${t("pages-reviews-days")}`;
  if (diffDays === -1) return t("pages-reviews-yesterday");
  return `${Math.abs(diffDays)} ${t("pages-reviews-days-ago")}`;
};

export function ReviewsPageIntegrated() {
  const { t } = useTranslation();
  const { data: reviewItems, isLoading, error, refetch } = useListReviewItems();

  const now = Date.now() / 1000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartSeconds = todayStart.getTime() / 1000;
  const todayEndSeconds = todayStartSeconds + 86400;

  const pendingReviews = reviewItems?.filter((r) => r.nextDueAt <= now) ?? [];
  const completedToday = reviewItems?.filter(
    (r) => r.lastStudiedAt >= todayStartSeconds && r.lastStudiedAt < todayEndSeconds
  ) ?? [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages-reviews-title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages-reviews-description")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{pendingReviews.length}</p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages-reviews-pending")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{completedToday.length}</p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages-reviews-today-completed")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            {reviewItems && reviewItems.length > 0
              ? Math.round(reviewItems.reduce((sum, r) => sum + (r.retention ?? 0), 0) / reviewItems.length)
              : 0}%
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages-reviews-retention")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            ~{pendingReviews.length * 3}min
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("pages-reviews-estimated")}
          </p>
        </div>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <>
          {pendingReviews.length === 0 ? (
            <EmptyState
              title={t("pages-reviews-no-pending")}
              description={t("pages-reviews-no-pending-description")}
              icon={BookOpen}
            />
          ) : (
            <section className="border rounded-lg bg-card overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-medium text-foreground">
                  {t("pages-reviews-pending-title")}
                </h2>
                <Button size="sm" className="h-7 text-xs">
                  {t("pages-reviews-start-review")}
                </Button>
              </div>
              <div className="divide-y">
                {pendingReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {review.topic}
                        </p>
                        <span
                          className={`text-[10px] capitalize ${getPriorityColor(review.priority ?? "")}`}
                        >
                          {t(`pages-reviews-priority-${review.priority}`)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDueDate(review.nextDueAt, t)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-foreground">
                        {review.retention ?? 0}%
                      </p>
                      <Progress value={review.retention ?? 0} className="h-1 w-12 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {completedToday.length > 0 && (
            <section className="border rounded-lg bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium text-foreground flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  {t("pages-reviews-completed-today")}
                </h2>
              </div>
              <div className="divide-y">
                {completedToday.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-4"
                  >
                    <span className="text-sm text-foreground">{review.topic}</span>
                    <span className="text-xs text-muted-foreground">
                      {review.retention ?? 0}%
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

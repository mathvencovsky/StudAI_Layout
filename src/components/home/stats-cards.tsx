import { useTranslation } from "react-i18next";
import { useUserStats } from "@/hooks/user/use-user-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, BookCheck, CalendarDays, AlertCircle } from "lucide-react";

/**
 * Container component that displays user statistics in a grid of cards
 */
export const StatsCards = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="grid grid-cols-3 divide-x text-center">
          <Skeleton className="h-16 m-2" />
          <Skeleton className="h-16 m-2" />
          <Skeleton className="h-16 m-2" />
        </div>
      </section>
    );
  }

  if (error) {
    console.error(error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("failed-to-load-stats")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="grid grid-cols-3 divide-x text-center">
        <div className="p-4">
          <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <span className="text-sm font-medium text-foreground">
            {data?.totalHoursStudied ?? 0}
          </span>
          <p className="text-[10px] text-muted-foreground">
            {t("total-hours-studied")}
          </p>
        </div>
        <div className="p-4">
          <BookCheck className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <span className="text-sm font-medium text-foreground">
            {data?.totalModulesCompleted ?? 0}
          </span>
          <p className="text-[10px] text-muted-foreground">
            {t("modules-completed")}
          </p>
        </div>
        <div className="p-4">
          <CalendarDays className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <span className="text-sm font-medium text-foreground">
            {data?.totalDaysLoggedIn ?? 0}
          </span>
          <p className="text-[10px] text-muted-foreground">
            {t("days-logged-in")}
          </p>
        </div>
      </div>
    </section>
  );
};

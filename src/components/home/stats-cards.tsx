import { useTranslation } from "react-i18next";
import { useUserStats } from "@/hooks/user/use-user-stats";
import { StatCard } from "@/components/home/stat-card";
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={Clock}
        label={t("total-hours-studied")}
        value={data?.totalHoursStudied ?? 0}
      />
      <StatCard
        icon={BookCheck}
        label={t("modules-completed")}
        value={data?.totalModulesCompleted ?? 0}
      />
      <StatCard
        icon={CalendarDays}
        label={t("days-logged-in")}
        value={data?.totalDaysLoggedIn ?? 0}
      />
    </div>
  );
};

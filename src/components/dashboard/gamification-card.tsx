import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { calculateStreak } from "@/utils/calculate-streak";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

/**
 * Displays user streak stats
 */
export const GamificationCard = () => {
  const { t } = useTranslation();
  const { data: loginDays = [], isLoading } = useListLoginDays();
  const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4">
          <Skeleton className="h-12" />
        </div>
      </section>
    );
  }

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          {t("gamification-title")}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("gamification-subtitle")}
        </p>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">{t("gamification-streak-title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("gamification-streak-subtitle")}
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-orange-500">{streak}</span>
        </div>
      </div>
    </section>
  );
};

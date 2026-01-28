import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import type { UserContentProgress } from "@/model/user-content-progress";
import type { UserModuleProgress } from "@/model/user-module-progress";

export interface ProgressBarProps {
  userProgress: UserModuleProgress;
  contentProgress: UserContentProgress[];
  totalContentCount: number;
}

/**
 * Displays overall module progress percentage and start date
 * Calculates completion percentage based on completed content items
 */
export const ProgressBar = ({
  userProgress,
  contentProgress,
  totalContentCount,
}: ProgressBarProps) => {
  const { t } = useTranslation();
  const completedCount = contentProgress.filter(
    (item) => item.isCompleted
  ).length;
  const completionPercentage =
    totalContentCount > 0 ? (completedCount / totalContentCount) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t("progress")}</span>
        <span className="text-sm text-muted-foreground">
          {Math.round(completionPercentage)}%
        </span>
      </div>
      <Progress value={completionPercentage} />
      <div className="text-xs text-muted-foreground">
        {t("started-on-date")} {formatDate(userProgress.startDate)}
      </div>
    </div>
  );
};

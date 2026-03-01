import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { calculateStreak } from "@/utils/calculate-streak";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Flame } from "lucide-react";

/**
 * Calculate XP needed for next level (simple formula: level * 100)
 */
const getXpForLevel = (level: number): number => {
  return level * 100;
};

/**
 * Calculate progress percentage to next level
 */
const getLevelProgress = (xp: number, level: number): number => {
  const currentLevelXp = getXpForLevel(level - 1);
  const nextLevelXp = getXpForLevel(level);
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));
};

/**
 * Displays user gamification stats: XP, Level, Streak
 */
export const GamificationCard = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useMyProfile();
  const { data: loginDays = [] } = useListLoginDays();
  const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-12" />
        </div>
      </section>
    );
  }

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const progress = getLevelProgress(xp, level);
  const xpForNextLevel = getXpForLevel(level);
  const xpNeeded = xpForNextLevel - xp;

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          {t("gamification-title")}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("gamification-subtitle")}
        </p>
      </div>
      <div className="p-4 space-y-4">
        {/* Level & XP */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {t("level")} {level}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {xp} / {xpForNextLevel} XP
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {t("gamification-xp-to-next-level", { xp: xpNeeded })}
          </p>
        </div>

        {/* Streak */}
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

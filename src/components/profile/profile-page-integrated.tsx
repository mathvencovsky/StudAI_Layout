import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Flame, Clock, Mail } from "lucide-react";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { useAuth } from "@/hooks/use-auth";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { calculateStreak } from "@/utils/calculate-streak";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";

export default function ProfilePageIntegrated() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isLoading, error, refetch } = useMyProfile();
  const { data: loginDays = [] } = useListLoginDays();
  const { data: sessions = [] } = useListStudySessions();
  const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const displayName = user?.displayName ?? "";
  const email = user?.email ?? "";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const totalHours = Math.round(
    sessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) / 60,
  );

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold">{t("pages-profile-title")}</h1>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">{displayName || t("pages-profile-unnamed")}</h2>
              {email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{email}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs text-muted-foreground">{t("pages-profile-current-streak")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{totalHours}</p>
                <p className="text-xs text-muted-foreground">{t("pages-profile-total-hours")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("pages-profile-achievements")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("pages-profile-no-achievements")}</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}

export { ProfilePageIntegrated };

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Flame } from "lucide-react";
import { useWeeklyRanking } from "@/hooks/ranking/use-weekly-ranking";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";

const getPositionBadge = (position: number | null | undefined) => {
  switch (position) {
    case 1:
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>
      );
    case 2:
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
          <Medal className="w-5 h-5 text-gray-500" />
        </div>
      );
    case 3:
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
          <Medal className="w-5 h-5 text-amber-600" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
          <span className="font-semibold text-sm">{position}</span>
        </div>
      );
  }
};

export default function Ranking() {
  const { t } = useTranslation();
  const { data: ranking, isLoading, error, refetch } = useWeeklyRanking();
  const { data: profile } = useMyProfile();

  const currentUser = ranking?.find((entry) => entry.userId === profile?.owner);

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t("pages.ranking.title", "Ranking")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("pages.ranking.description", "Veja sua posição entre os estudantes")}
        </p>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && ranking && (
        <>
          {currentUser && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {currentUser.position}º
                    </div>
                    <div>
                      <p className="font-semibold">
                        {t("pages.ranking.your-position", "Sua Posição")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(currentUser.xpWeek ?? 0).toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold">{currentUser.streak} {t("pages.ranking.days", "dias")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {t("pages.ranking.top-10", "Top 10 Semanal")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {ranking.map((entry) => {
                  const isCurrentUser = entry.userId === profile?.owner;
                  const initials = (entry.displayName ?? "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("");
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 p-4 ${isCurrentUser ? "bg-primary/5" : ""}`}
                    >
                      {getPositionBadge(entry.position)}
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          className={isCurrentUser ? "bg-primary text-primary-foreground" : ""}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium truncate ${isCurrentUser ? "text-primary" : ""}`}>
                            {entry.displayName}
                          </p>
                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">
                              {t("pages.ranking.you", "Você")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{(entry.xpWeek ?? 0).toLocaleString()} XP</span>
                          <span>•</span>
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span>{entry.streak} {t("pages.ranking.days", "dias")}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

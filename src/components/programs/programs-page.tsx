import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus } from "lucide-react";
import { useMyPlan } from "@/hooks/user-plan/use-my-plan";
import { useTranslation } from "react-i18next";

export function ProgramsPage() {
  const { t } = useTranslation();
  const { data: plan, isLoading } = useMyPlan();

  const tracks = plan?.tracks ? JSON.parse(plan.tracks as any) : [];
  const modulesProgress = plan?.modulesProgress ? JSON.parse(plan.modulesProgress as any) : [];

  const totalEstimated = modulesProgress.reduce((sum: number, m: any) => sum + m.estimatedHours, 0);
  const totalCompleted = modulesProgress.reduce((sum: number, m: any) => sum + m.completedHours, 0);
  const progressPercentage = totalEstimated > 0 ? Math.round((totalCompleted / totalEstimated) * 100) : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("pages-programs-my-programs")}</h1>
          <p className="text-muted-foreground">{t("pages-programs-active-tracks")}</p>
        </div>
        <Link to="/explore">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("pages-programs-add-program")}
          </Button>
        </Link>
      </div>

      {!plan || tracks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("pages-programs-no-active")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("pages-programs-explore-tracks")}
            </p>
            <Link to="/explore">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("pages-programs-explore-tracks-btn")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>{t("pages-programs-active-program")}</CardTitle>
              <CardDescription>
                {t("pages-programs-tracks-in-plan", { count: tracks.length })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t("pages-programs-overall-progress")}</span>
                  <span className="text-muted-foreground">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("pages-programs-completed-hours")}</p>
                  <p className="text-2xl font-bold">{totalCompleted.toFixed(1)}h</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("pages-programs-remaining-hours")}</p>
                  <p className="text-2xl font-bold">
                    {Math.max(0, totalEstimated - totalCompleted).toFixed(1)}h
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("pages-programs-modules")}</p>
                  <p className="text-2xl font-bold">{modulesProgress.length}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link to="/my-track" className="flex-1">
                  <Button className="w-full">{t("pages-programs-view-plan-details")}</Button>
                </Link>
                <Link to="/module" className="flex-1">
                  <Button variant="outline" className="w-full">{t("pages-programs-study-with-ai")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {tracks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("pages-programs-tracks-in-plan-title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tracks.map((track: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{t("pages-programs-track-number", { number: index + 1 })}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("pages-programs-added-on")} {new Date(track.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to="/explore/$trackId" params={{ trackId: track.trackId }}>
                        <Button variant="ghost" size="sm">{t("pages-programs-view")}</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

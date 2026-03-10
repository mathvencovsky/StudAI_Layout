import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Brain, BookOpen } from "lucide-react";
import { useTrack } from "@/hooks/use-track";
import { useMyPlan } from "@/hooks/user-plan/use-my-plan";
import { useUpdatePlan } from "@/hooks/user-plan/use-update-plan";
import { useCreatePlan } from "@/hooks/user-plan/use-create-plan";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface TrackDetailPageProps {
  trackId: string;
}

export function TrackDetailPage({ trackId }: TrackDetailPageProps) {
  const { t } = useTranslation();
  const { data: track, isLoading: trackLoading } = useTrack(trackId);
  const { data: plan } = useMyPlan();
  const updatePlan = useUpdatePlan();
  const createPlan = useCreatePlan();
  const [adding, setAdding] = useState(false);

  const tracks = plan?.tracks ? JSON.parse(plan.tracks as any) : [];
  const isInPlan = tracks.some((t: any) => t.trackId === trackId);

  const handleAddToPlan = async () => {
    if (adding || !track) return;

    setAdding(true);
    try {
      if (!plan) {
        await createPlan.mutateAsync({
          activeProgramId: trackId,
          startDate: Date.now(),
          targetDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
          modulesProgress: JSON.stringify([]),
          completedHours: 0,
          tracks: JSON.stringify([{ trackId, addedAt: new Date().toISOString() }]),
        });
      } else {
        const updatedTracks = [...tracks, { trackId, addedAt: new Date().toISOString() }];
        
        await updatePlan.mutateAsync({
          id: plan.id,
          tracks: JSON.stringify(updatedTracks),
        });
      }

      toast.success(t("pages.tracks.detail-added-success"));
    } catch (error) {
      toast.error(t("pages.tracks.detail-added-error"));
    } finally {
      setAdding(false);
    }
  };

  if (trackLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">{t("pages.tracks.detail-not-found")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{track.title}</CardTitle>
            <CardDescription className="text-base">{track.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Link to="/estudar" className="flex-1">
              <Button className="w-full" size="lg">
                <Brain className="mr-2 h-5 w-5" />
                {t("pages.tracks.detail-study-ai")}
              </Button>
            </Link>
            {!isInPlan && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToPlan}
                disabled={adding}
                className="flex-1"
              >
                <Target className="mr-2 h-5 w-5" />
                {t("pages.tracks.detail-add-plan")}
              </Button>
            )}
            {isInPlan && (
              <Link to="/trilha" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t("pages.tracks.detail-view-plan")}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("pages.tracks.detail-about")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("pages.tracks.detail-about-description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

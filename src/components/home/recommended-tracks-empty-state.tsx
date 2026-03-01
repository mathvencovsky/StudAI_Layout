import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTracksByCategories } from "@/hooks/track/use-tracks-by-categories";
import { type TrackCategory } from "@/model/track";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";

export interface RecommendedTracksEmptyStateProps {
  interests: TrackCategory[] | undefined;
}

/**
 * Shown on the home page when the user has no active modules or tracks.
 * Displays tracks filtered by the user's interest categories.
 */
export const RecommendedTracksEmptyState = ({
  interests,
}: RecommendedTracksEmptyStateProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: tracks, isLoading } = useTracksByCategories(interests);

  if (isLoading) return <LoadingState />;

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-medium text-sm text-foreground">
          {t("recommended-tracks-title")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t("recommended-tracks-description")}
        </p>
      </div>
      {!tracks?.length ? (
        <p className="text-sm text-muted-foreground">
          {t("recommended-tracks-empty")}
        </p>
      ) : (
        <div className="grid gap-3">
          {tracks.map((track) => (
            <button
              key={track.id}
              className="w-full border rounded-lg bg-card hover:bg-muted/50 transition-colors text-left p-4"
              onClick={() =>
                navigate({ to: "/track/$trackId", params: { trackId: track.id } })
              }
            >
              <h4 className="text-sm font-medium text-foreground">{track.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{track.description}</p>
            </button>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate({ to: "/track" })}
      >
        {t("browse-tracks")}
      </Button>
    </section>
  );
};

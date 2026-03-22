import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTracksByCategories } from "@/hooks/track/use-tracks-by-categories";
import { type Category } from "@/model/category";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toI18nKey } from "@/lib/i18n-key";

export interface RecommendedTracksEmptyStateProps {
  interests: Category[] | undefined;
  showBrowseButton?: boolean;
}

/**
 * Shown on the home page when the user has no active modules or tracks.
 * Displays tracks filtered by the user's interest categories.
 */
export const RecommendedTracksEmptyState = ({
  interests,
  showBrowseButton = true,
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
            <Card
              key={track.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                navigate({
                  to: "/track/$trackId",
                  params: { trackId: track.id },
                })
              }
            >
              <CardContent className="p-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  {track.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {track.description}
                </p>
                {track.categories && track.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {track.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
                        {t(toI18nKey("track-category", category))}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {showBrowseButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/track" })}
        >
          {t("browse-tracks")}
        </Button>
      )}
    </section>
  );
};

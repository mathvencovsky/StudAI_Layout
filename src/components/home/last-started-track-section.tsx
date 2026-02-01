import { useTranslation } from "react-i18next";
import { useLastStartedTrackWithDetails } from "@/hooks/track/use-last-started-track-with-details";
import { TrackViewerCard } from "@/components/track/track-viewer-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Displays the last started incomplete track on the home page
 */
export const LastStartedTrackSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useLastStartedTrackWithDetails();

  if (!data && !isLoading && !isError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("failed-load-last-track")}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return <TrackViewerCard track={data.track} />;
};

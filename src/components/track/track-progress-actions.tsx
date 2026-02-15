import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTrackProgress } from "@/hooks/track/use-track-progress";
import { useStartTrack } from "@/hooks/track/use-start-track";
import { useCompleteTrack } from "@/hooks/track/use-complete-track";
import { useUncompleteTrack } from "@/hooks/track/use-uncomplete-track";
import { CheckCircle, Play, RotateCcw, AlertCircle } from "lucide-react";

export interface TrackProgressActionsProps {
  trackId: string;
}

/**
 * Displays start/complete/uncomplete buttons based on track progress state
 */
export const TrackProgressActions = ({
  trackId,
}: TrackProgressActionsProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { data: progress, isLoading } = useTrackProgress(trackId);
  const startTrackMutation = useStartTrack();
  const completeTrackMutation = useCompleteTrack();
  const uncompleteTrackMutation = useUncompleteTrack();

  const handleStart = () => {
    setError(null);
    startTrackMutation.mutate(
      { trackId },
      { onError: () => setError(t("failed-start-track")) }
    );
  };

  const handleComplete = () => {
    setError(null);
    completeTrackMutation.mutate(trackId, {
      onError: () => setError(t("failed-complete-track")),
    });
  };

  const handleUncomplete = () => {
    setError(null);
    uncompleteTrackMutation.mutate(trackId, {
      onError: () => setError(t("failed-uncomplete-track")),
    });
  };

  if (isLoading) {
    return null;
  }

  const isStarted = !!progress;
  const isCompleted = !!progress?.completionDate;

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!isStarted && (
        <Button onClick={handleStart} disabled={startTrackMutation.isPending}>
          <Play className="mr-2 h-4 w-4" />
          {t("start-track")}
        </Button>
      )}
      {isStarted && isCompleted && (
        <Button
          variant="outline"
          onClick={handleUncomplete}
          disabled={uncompleteTrackMutation.isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("mark-incomplete")}
        </Button>
      )}
      {isStarted && !isCompleted && (
        <Button
          onClick={handleComplete}
          disabled={completeTrackMutation.isPending}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {t("complete-track")}
        </Button>
      )}
    </div>
  );
};

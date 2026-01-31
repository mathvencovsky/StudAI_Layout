import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTrack } from "@/hooks/track/use-track";
import { useDeleteTrack } from "@/hooks/track/use-delete-track";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { TrackFlowViewer } from "@/components/track/track-flow-viewer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface TrackDetailProps {
  trackId: string;
}

/**
 * Displays track details with React Flow visualization and Edit/Delete buttons
 */
export const TrackDetail = ({ trackId }: TrackDetailProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: track, isLoading, isError } = useTrack(trackId);
  const deleteTrackMutation = useDeleteTrack();
  const isAdminUser = useIsAdminUser();

  const handleEdit = () => {
    navigate({ to: "/track-edit/$trackId", params: { trackId } });
  };

  const handleDelete = () => {
    deleteTrackMutation.mutate(
      { id: trackId },
      {
        onSuccess: () => {
          navigate({ to: "/track" });
        },
      }
    );
  };

  if (isLoading) return <div>{t("loading")}</div>;
  if (isError) return <div>{t("error-loading-track")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{track.title}</h1>
          <p className="text-muted-foreground">{track.description}</p>
        </div>
        {isAdminUser && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              {t("edit")}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">{t("delete")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("delete-track-confirm-title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("delete-track-confirm-description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    {t("delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="h-[500px] border rounded-lg">
        <TrackFlowViewer
          rootModuleId={track.rootModuleId}
          parentByModuleId={track.parentByModuleId}
          positionByModuleId={track.positionByModuleId ?? {}}
        />
      </div>
    </div>
  );
};

import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrackFlowViewer } from "@/components/track/track-flow-viewer";
import { type TrackFull } from "@/model/track";
import { ArrowRight } from "lucide-react";

export interface TrackViewerCardProps {
  track: TrackFull;
  height?: string;
}

/**
 * Reusable card component displaying a track with its flow viewer
 */
export const TrackViewerCard = ({
  track,
  height = "h-[400px]",
}: TrackViewerCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewTrack = () => {
    navigate({ to: "/track/$trackId", params: { trackId: track.id } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{track.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{track.description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleViewTrack}>
          {t("view-track")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className={`${height} border rounded-lg`}>
          <TrackFlowViewer
            rootModuleId={track.rootModuleId}
            parentByModuleId={track.parentByModuleId}
            positionByModuleId={track.positionByModuleId ?? {}}
          />
        </div>
      </CardContent>
    </Card>
  );
};

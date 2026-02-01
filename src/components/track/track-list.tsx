import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTracks } from "@/hooks/track/use-tracks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface TrackListProps {
  onCreateTrack?: () => void;
}

/**
 * Displays a list of tracks with search and optional create button
 */
export const TrackList = ({ onCreateTrack }: TrackListProps) => {
  const { t } = useTranslation();
  const { data: tracks, isLoading, isError } = useTracks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = useMemo(() => {
    if (!tracks) return [];
    if (!searchQuery.trim()) return tracks;

    const query = searchQuery.toLowerCase();
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query),
    );
  }, [tracks, searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return <div>{t("loading")}</div>;
    }

    if (isError) {
      return <div>{t("error-loading-tracks")}</div>;
    }

    if (tracks?.length === 0) {
      return <p className="text-muted-foreground">{t("no-tracks")}</p>;
    }

    if (filteredTracks.length === 0) {
      return (
        <p className="text-muted-foreground">{t("no-tracks-match-search")}</p>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredTracks.map((track) => (
          <Card
            key={track.id}
            className="cursor-pointer hover:bg-accent/20"
            onClick={() =>
              navigate({
                to: "/track/$trackId",
                params: { trackId: track.id },
              })
            }
          >
            <CardHeader>
              <CardTitle>{track.title}</CardTitle>
              <CardDescription>{track.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("tracks")}</h1>
        {onCreateTrack && (
          <Button onClick={onCreateTrack}>{t("create-track")}</Button>
        )}
      </div>
      <p className="text-muted-foreground">{t("tracks-description")}</p>
      <Input
        placeholder={t("search-tracks")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {renderContent()}
    </div>
  );
};

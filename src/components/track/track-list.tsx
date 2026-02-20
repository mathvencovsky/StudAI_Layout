import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTracks } from "@/hooks/track/use-tracks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <div className="grid gap-3">
        {filteredTracks.map((track) => (
          <button
            key={track.id}
            className="w-full border rounded-lg bg-card hover:bg-muted/50 transition-colors text-left p-4"
            onClick={() =>
              navigate({
                to: "/track/$trackId",
                params: { trackId: track.id },
              })
            }
          >
            <h3 className="text-sm font-medium text-foreground">{track.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{track.description}</p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium text-foreground">{t("tracks")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("tracks-description")}</p>
        </div>
        {onCreateTrack && (
          <Button onClick={onCreateTrack} size="sm">{t("create-track")}</Button>
        )}
      </div>
      <Input
        placeholder={t("search-tracks")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {renderContent()}
    </div>
  );
};

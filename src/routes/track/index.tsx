import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrackList } from "@/components/track/track-list";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { useCallback } from "react";

export const Route = createFileRoute("/track/")({
  component: TracksPage,
});

function TracksPage() {
  const navigate = useNavigate();
  const isAdminUser = useIsAdminUser();

  const onCreateTrack = useCallback(() => {
    navigate({ to: "/track-create" });
  }, [navigate]);

  return (
    <TrackList onCreateTrack={isAdminUser ? onCreateTrack : undefined} />
  );
}

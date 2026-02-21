import { createFileRoute } from "@tanstack/react-router";
import { CreateTrackPage } from "@/components/tracks/create-track-page";

export const Route = createFileRoute("/create-track")({
  component: CreateTrackPage,
  loader: () => ({ crumb: "Create Track with AI" }),
});

import { createFileRoute } from "@tanstack/react-router";
import { SavedPage } from "@/components/saved/saved-page";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

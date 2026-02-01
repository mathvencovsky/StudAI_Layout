import { createFileRoute } from "@tanstack/react-router";
import { FavouritesListContainer } from "@/components/favourites/favourites-list-container";

export const Route = createFileRoute("/favourites/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FavouritesListContainer />;
}

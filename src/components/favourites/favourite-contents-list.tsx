import { type FavouriteContent } from "@/model/favourite-content";
import { FavouriteContentItem } from "./favourite-content-item";

export interface FavouriteContentsListProps {
  favourites: FavouriteContent[];
}

/**
 * Renders a list of favourite content items.
 */
export const FavouriteContentsList = ({
  favourites,
}: FavouriteContentsListProps) => {
  return (
    <div className="space-y-4">
      {favourites.map((favourite) => (
        <FavouriteContentItem key={favourite.id} favourite={favourite} />
      ))}
    </div>
  );
};

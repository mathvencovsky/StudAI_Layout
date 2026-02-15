import { type FavouriteModule } from "@/model/favourite-module";
import { FavouriteModuleItem } from "./favourite-module-item";

export interface FavouriteModulesListProps {
  favourites: FavouriteModule[];
}

/**
 * Renders a list of favourite module items.
 */
export const FavouriteModulesList = ({
  favourites,
}: FavouriteModulesListProps) => {
  return (
    <div className="space-y-4">
      {favourites.map((favourite) => (
        <FavouriteModuleItem key={favourite.id} favourite={favourite} />
      ))}
    </div>
  );
};

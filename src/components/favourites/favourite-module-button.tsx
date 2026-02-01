import { useTranslation } from "react-i18next";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFavouriteModule } from "@/hooks/favourites/use-get-favourite-module";
import { useToggleFavouriteModule } from "@/hooks/favourites/use-toggle-favourite-module";
import { cn } from "@/lib/utils";

export interface FavouriteModuleButtonProps {
  moduleId: string;
}

/**
 * Heart icon button to toggle favourite state for modules.
 */
export const FavouriteModuleButton = ({
  moduleId,
}: FavouriteModuleButtonProps) => {
  const { t } = useTranslation();
  const { data: favourite } = useGetFavouriteModule(moduleId);
  const toggleMutation = useToggleFavouriteModule();

  const isFavourited = !!favourite;

  const handleClick = () => {
    toggleMutation.mutate(moduleId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      aria-label={t(
        isFavourited ? "remove-from-favourites" : "add-to-favourites",
      )}
    >
      {toggleMutation.isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={cn("h-5 w-5", isFavourited && "fill-current text-primary")}
        />
      )}
    </Button>
  );
};

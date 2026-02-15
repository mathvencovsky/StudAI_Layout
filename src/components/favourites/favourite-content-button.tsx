import { useTranslation } from "react-i18next";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFavouriteContent } from "@/hooks/favourites/use-get-favourite-content";
import { useToggleFavouriteContent } from "@/hooks/favourites/use-toggle-favourite-content";
import { cn } from "@/lib/utils";

export interface FavouriteContentButtonProps {
  contentId: string;
}

/**
 * Heart icon button to toggle favourite state for content.
 */
export const FavouriteContentButton = ({
  contentId,
}: FavouriteContentButtonProps) => {
  const { t } = useTranslation();
  const { data: favourite } = useGetFavouriteContent(contentId);
  const toggleMutation = useToggleFavouriteContent();

  const isFavourited = !!favourite;

  const handleClick = () => {
    toggleMutation.mutate(contentId);
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

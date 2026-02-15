import { useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetContent } from "@/hooks/content/use-get-content";
import { type FavouriteContent } from "@/model/favourite-content";
import { FavouriteContentButton } from "./favourite-content-button";
import { Skeleton } from "@/components/ui/skeleton";

export interface FavouriteContentItemProps {
  favourite: FavouriteContent;
}

/**
 * Renders a single favourite content item card.
 */
export const FavouriteContentItem = ({
  favourite,
}: FavouriteContentItemProps) => {
  const navigate = useNavigate();
  const { data: content, isLoading } = useGetContent(favourite.contentId);

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!content) return null;

  const handleClick = () => {
    navigate({
      to: "/content/$contentId",
      params: { contentId: favourite.contentId },
    });
  };

  return (
    <Card className="cursor-pointer hover:bg-accent/50" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{content.title}</CardTitle>
        <div onClick={(e) => e.stopPropagation()}>
          <FavouriteContentButton contentId={favourite.contentId} />
        </div>
      </CardHeader>
    </Card>
  );
};

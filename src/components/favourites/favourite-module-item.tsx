import { useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useModule } from "@/hooks/modules/use-module";
import { type FavouriteModule } from "@/model/favourite-module";
import { FavouriteModuleButton } from "./favourite-module-button";
import { Skeleton } from "@/components/ui/skeleton";

export interface FavouriteModuleItemProps {
  favourite: FavouriteModule;
}

/**
 * Renders a single favourite module item card.
 */
export const FavouriteModuleItem = ({
  favourite,
}: FavouriteModuleItemProps) => {
  const navigate = useNavigate();
  const { data: module, isLoading } = useModule(favourite.moduleId);

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!module) return null;

  const handleClick = () => {
    navigate({
      to: "/module/$moduleId",
      params: { moduleId: favourite.moduleId },
    });
  };

  return (
    <Card className="cursor-pointer hover:bg-accent/50" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{module.title}</CardTitle>
        <div onClick={(e) => e.stopPropagation()}>
          <FavouriteModuleButton moduleId={favourite.moduleId} />
        </div>
      </CardHeader>
    </Card>
  );
};

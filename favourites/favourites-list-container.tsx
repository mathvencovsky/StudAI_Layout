import { useTranslation } from "react-i18next";
import { useListFavouriteContents } from "@/hooks/favourites/use-list-favourite-contents";
import { useListFavouriteModules } from "@/hooks/favourites/use-list-favourite-modules";
import { FavouriteContentsList } from "./favourite-contents-list";
import { FavouriteModulesList } from "./favourite-modules-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Container component for the favourites page.
 */
export const FavouritesListContainer = () => {
  const { t } = useTranslation();
  const {
    data: favouriteContents,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useListFavouriteContents();
  const {
    data: favouriteModules,
    isLoading: isModulesLoading,
    isError: isModulesError,
  } = useListFavouriteModules();

  const isLoading = isContentsLoading || isModulesLoading;
  const isError = isContentsError || isModulesError;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("error")}</AlertTitle>
        <AlertDescription>{t("couldnt-load-favourites")}</AlertDescription>
      </Alert>
    );
  }

  const hasNoFavourites =
    (!favouriteContents || favouriteContents.length === 0) &&
    (!favouriteModules || favouriteModules.length === 0);

  if (hasNoFavourites) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t("no-favourites")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {favouriteModules && favouriteModules.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("modules")}</h2>
          <FavouriteModulesList favourites={favouriteModules} />
        </section>
      )}
      {favouriteContents && favouriteContents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("contents")}</h2>
          <FavouriteContentsList favourites={favouriteContents} />
        </section>
      )}
    </div>
  );
};

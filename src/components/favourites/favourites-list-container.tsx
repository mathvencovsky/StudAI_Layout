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
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto text-center text-muted-foreground py-8">
        {t("no-favourites")}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <section className="pb-1">
        <h1 className="text-lg font-medium text-foreground">{t("favourites")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("favourites-description") ?? "Your saved items."}
        </p>
      </section>

      {favouriteModules && favouriteModules.length > 0 && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium text-foreground">{t("modules")}</h3>
          </div>
          <div className="p-4">
            <FavouriteModulesList favourites={favouriteModules} />
          </div>
        </section>
      )}
      {favouriteContents && favouriteContents.length > 0 && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium text-foreground">{t("contents")}</h3>
          </div>
          <div className="p-4">
            <FavouriteContentsList favourites={favouriteContents} />
          </div>
        </section>
      )}
    </div>
  );
};

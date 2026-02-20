import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, HelpCircle, Bookmark, Trash2, BookOpen } from "lucide-react";
import { useSavedItems } from "@/hooks/saved/use-saved-items";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "track":
      return BookOpen;
    case "module":
      return FileText;
    case "content":
      return Video;
    case "assessment":
      return HelpCircle;
    default:
      return Bookmark;
  }
};

export default function Salvos() {
  const { t } = useTranslation();
  const { data: savedItems, isLoading, error, refetch } = useSavedItems();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return t("pages.saved.today", "Hoje");
    if (diffDays === 1) return t("pages.saved.yesterday", "Ontem");
    if (diffDays < 7) return `${diffDays} ${t("pages.saved.days-ago", "dias atrás")}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? t("pages.saved.week-ago", "semana atrás") : t("pages.saved.weeks-ago", "semanas atrás")}`;
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filterByType = (type?: string) => {
    if (!savedItems) return [];
    if (!type || type === "all") return savedItems;
    return savedItems.filter((item) => item.itemType === type);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.saved.title", "Salvos")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.saved.description", "Conteúdos favoritos.")}
        </p>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              {t("pages.saved.all", "Todos")} ({savedItems?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="track">
              {t("pages.saved.tracks", "Trilhas")} (
              {filterByType("track").length})
            </TabsTrigger>
            <TabsTrigger value="module">
              {t("pages.saved.modules", "Módulos")} (
              {filterByType("module").length})
            </TabsTrigger>
            <TabsTrigger value="content">
              {t("pages.saved.content", "Conteúdo")} (
              {filterByType("content").length})
            </TabsTrigger>
          </TabsList>

          {["all", "track", "module", "content"].map((tab) => {
            const items = filterByType(tab === "all" ? undefined : tab);
            return (
              <TabsContent key={tab} value={tab} className="mt-4">
                {items.length === 0 ? (
                  <EmptyState
                    title={t("pages.saved.no-items", "Nenhum item salvo")}
                    description={t(
                      "pages.saved.no-items-description",
                      "Salve conteúdos para acessá-los rapidamente"
                    )}
                    icon={Bookmark}
                  />
                ) : (
                  <section className="border rounded-lg bg-card overflow-hidden divide-y">
                    {items.map((item) => {
                      const TypeIcon = getTypeIcon(item.itemType);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                        >
                          <TypeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t(
                                `pages.saved.type.${item.itemType}`,
                                item.itemType
                              )}{" "}
                              · {formatDate(item.savedAt)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      );
                    })}
                  </section>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, BookOpen, Video, FileText, Trash2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useListSavedItems } from "@/hooks/saved-item/use-list-saved-items";
import { useDeleteSavedItem } from "@/hooks/saved-item/use-delete-saved-item";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function SavedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: savedItems, isLoading, error, refetch } = useListSavedItems();
  const deleteSavedItem = useDeleteSavedItem();

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case "track":
        return <BookOpen className="h-4 w-4" />;
      case "module":
        return <Video className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      default:
        return <Bookmark className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (itemType: string) => {
    const labels: Record<string, string> = {
      track: t("pages-saved-type-track"),
      module: t("pages-saved-type-module"),
      content: t("pages-saved-type-content"),
      assessment: t("pages-saved-type-resource"),
    };
    return labels[itemType] || itemType;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteSavedItem.mutateAsync({ id });
      toast.success(t("pages-saved-removed"));
    } catch (err) {
      console.error(err);
      toast.error(t("pages-saved-remove-error"));
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!savedItems || savedItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t("pages-saved-title")}</h1>
          <p className="text-muted-foreground">{t("pages-saved-description")}</p>
        </div>
        <EmptyState
          title={t("pages-saved-empty")}
          description={t("pages-saved-empty-description")}
          icon={Bookmark}
          action={{
            label: t("pages-saved-explore"),
            onClick: () => navigate({ to: "/explore" }),
          }}
        />
      </div>
    );
  }

  const trackItems = savedItems.filter((i) => i.itemType === "track");
  const moduleItems = savedItems.filter((i) => i.itemType === "module");
  const resourceItems = savedItems.filter(
    (i) => i.itemType === "content" || i.itemType === "assessment",
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages-saved-title")}</h1>
        <p className="text-muted-foreground">{t("pages-saved-description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-saved-total")}</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-saved-tracks")}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trackItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-saved-modules")}</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moduleItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages-saved-resources")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">{t("pages-saved-all")}</TabsTrigger>
          <TabsTrigger value="tracks">{t("pages-saved-tracks")}</TabsTrigger>
          <TabsTrigger value="modules">{t("pages-saved-modules")}</TabsTrigger>
          <TabsTrigger value="resources">{t("pages-saved-resources")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {savedItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.itemType ?? "")}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
                    disabled={deleteSavedItem.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getTypeLabel(item.itemType ?? "")}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {t("pages-saved-saved-on")} {formatDate(item.createdAt ?? "")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tracks" className="mt-6 space-y-4">
          {trackItems.length === 0 ? (
            <EmptyState
              title={t("pages-saved-no-tracks")}
              description={t("pages-saved-empty-description")}
            />
          ) : (
            trackItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      disabled={deleteSavedItem.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/track/$trackId" params={{ trackId: item.itemId }}>
                      {t("pages-saved-view-details")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="modules" className="mt-6 space-y-4">
          {moduleItems.length === 0 ? (
            <EmptyState
              title={t("pages-saved-no-modules")}
              description={t("pages-saved-empty-description")}
            />
          ) : (
            moduleItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      disabled={deleteSavedItem.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/module/$moduleId" params={{ moduleId: item.itemId }}>
                      {t("pages-saved-view-details")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-6 space-y-4">
          {resourceItems.length === 0 ? (
            <EmptyState
              title={t("pages-saved-no-resources")}
              description={t("pages-saved-empty-description")}
            />
          ) : (
            resourceItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      disabled={deleteSavedItem.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.itemType === "content" && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/content/$contentId" params={{ contentId: item.itemId }}>
                        {t("pages-saved-view-details")}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

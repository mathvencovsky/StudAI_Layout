import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen } from "lucide-react";
import { useTracks } from "@/hooks/track/use-tracks";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";

export function ExploreTracksPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("my-track");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: tracks,
    isLoading: catalogLoading,
    error: catalogError,
    refetch: refetchCatalog,
  } = useTracks();

  const filteredCatalog = tracks?.filter((track) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      track.title.toLowerCase().includes(term) ||
      track.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages-tracks-title")}</h1>
        <p className="text-muted-foreground">{t("pages-tracks-description")}</p>
      </div>

      <UpgradeCard variant="compact" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-track">
            {t("pages-tracks-my-track")}
          </TabsTrigger>
          <TabsTrigger value="explore">{t("pages-tracks-explore")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-track" className="space-y-6 mt-6">
          <EmptyState
            title={t("pages-tracks-no-active")}
            description={t("pages-tracks-no-active-description")}
            icon={BookOpen}
            action={{
              label: t("pages-tracks-browse-catalog"),
              onClick: () => setActiveTab("explore"),
            }}
          />
        </TabsContent>

        <TabsContent value="explore" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t("pages-tracks-search")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("pages-tracks-search-placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {catalogLoading && <LoadingState />}
          {catalogError && (
            <ErrorState error={catalogError} onRetry={refetchCatalog} />
          )}
          {!catalogLoading &&
            !catalogError &&
            filteredCatalog &&
            filteredCatalog.length === 0 && (
              <EmptyState
                title={t("pages-tracks-no-results")}
                description={t("pages-tracks-no-results-description")}
                icon={Search}
              />
            )}
          {filteredCatalog && filteredCatalog.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((track) => (
                <Card
                  key={track.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {track.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {track.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/track/$trackId" params={{ trackId: track.id }}>
                      <Button className="w-full">
                        {t("pages-tracks-view-details")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

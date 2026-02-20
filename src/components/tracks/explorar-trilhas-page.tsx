import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { useActiveTrack } from "@/hooks/tracks/use-active-track";
import { useTrackModules } from "@/hooks/tracks/use-track-modules";
import { useTracksCatalog } from "@/hooks/tracks/use-tracks-catalog";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";

export function ExplorarTrilhasPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("my-track");
  const [searchTerm, setSearchTerm] = useState("");

  // Minha trilha
  const { data: activeTrack, isLoading: trackLoading, error: trackError, refetch: refetchTrack } = useActiveTrack();
  const { data: modules, isLoading: modulesLoading, error: modulesError, refetch: refetchModules } = useTrackModules(
    activeTrack?.id || ""
  );

  // Catálogo
  const { data: catalog, isLoading: catalogLoading, error: catalogError, refetch: refetchCatalog } = useTracksCatalog();

  const filteredCatalog = catalog?.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages.tracks.title")}</h1>
        <p className="text-muted-foreground">{t("pages.tracks.description")}</p>
      </div>

      {/* Upgrade Card */}
      <UpgradeCard variant="compact" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-track">{t("pages.tracks.my-track")}</TabsTrigger>
          <TabsTrigger value="explore">{t("pages.tracks.explore")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-track" className="space-y-6 mt-6">
          {trackLoading && <LoadingState />}
          {trackError && <ErrorState error={trackError} onRetry={refetchTrack} />}
          {!trackLoading && !trackError && !activeTrack && (
            <EmptyState
              title={t("pages.tracks.no-active")}
              description={t("pages.tracks.no-active-description")}
              icon={BookOpen}
              action={{
                label: t("pages.tracks.browse-catalog"),
                onClick: () => setActiveTab("explore"),
              }}
            />
          )}
          {activeTrack && (
            <div className="space-y-6">
              {/* Track Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">{activeTrack.title}</CardTitle>
                      <CardDescription>{activeTrack.description}</CardDescription>
                    </div>
                    <Badge variant="default">{t("pages.tracks.active")}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{activeTrack.progress}%</span>
                    </div>
                    <Progress value={activeTrack.progress} />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{activeTrack.completedModules} / {activeTrack.totalModules} módulos</span>
                      <span>{activeTrack.estimatedHours}h estimadas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modules */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Módulos</h2>
                {modulesLoading && <LoadingState />}
                {modulesError && <ErrorState error={modulesError} onRetry={refetchModules} />}
                {modules && modules.length === 0 && (
                  <EmptyState title="Nenhum módulo disponível" description="" />
                )}
                {modules && modules.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {modules.map((module) => (
                      <Card key={module.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                              <CardDescription className="line-clamp-2">
                                {module.description}
                              </CardDescription>
                            </div>
                            {module.status === "completed" && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{module.duration} min</span>
                            </div>
                            {module.status === "in-progress" && (
                              <div className="space-y-1">
                                <Progress value={module.progress} />
                                <p className="text-xs text-muted-foreground">
                                  {module.progress}% {t("pages.tracks.complete")}
                                </p>
                              </div>
                            )}
                            <Link to={`/estudar/${module.id}`}>
                              <Button className="w-full">
                                {module.status === "completed"
                                  ? t("pages.tracks.review")
                                  : module.status === "in-progress"
                                  ? "Continuar"
                                  : "Iniciar"}
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="explore" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Buscar trilhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {catalogLoading && <LoadingState />}
          {catalogError && <ErrorState error={catalogError} onRetry={refetchCatalog} />}
          {!catalogLoading && !catalogError && filteredCatalog && filteredCatalog.length === 0 && (
            <EmptyState
              title="Nenhum resultado encontrado"
              description="Tente termos diferentes"
              icon={Search}
            />
          )}
          {filteredCatalog && filteredCatalog.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((track) => (
                <Card key={track.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{track.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {track.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{track.moduleCount} módulos</span>
                        <span>{track.estimatedHours}h</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {track.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link to="/explorar/$trackId" params={{ trackId: track.id }}>
                        <Button className="w-full">Ver detalhes</Button>
                      </Link>
                    </div>
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

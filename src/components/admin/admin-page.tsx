import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Users, 
  BookOpen, 
  BarChart3,
  Settings,
  Database,
  AlertTriangle
} from "lucide-react";
import { useAdminUsers } from "@/hooks/admin/use-admin-users";
import { useFeatureToggles, useUpdateFeatureToggle } from "@/hooks/admin/use-feature-toggles";
import { useCatalogResources } from "@/hooks/admin/use-catalog-resources";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";

export function AdminPage() {
  const { t } = useTranslation();
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useAdminUsers();
  const { data: features, isLoading: featuresLoading, error: featuresError, refetch: refetchFeatures } = useFeatureToggles();
  const { data: catalog, isLoading: catalogLoading, error: catalogError, refetch: refetchCatalog } = useCatalogResources();
  const updateFeature = useUpdateFeatureToggle();

  const handleToggleFeature = async (id: string, enabled: boolean) => {
    try {
      await updateFeature.mutateAsync({ id, enabled });
    } catch (error) {
      console.error("Failed to update feature:", error);
    }
  };

  // Mock stats - em produção viriam de uma API
  const stats = {
    users: usersData?.total || 0,
    courses: 56,
    modules: 234,
    activeUsers: 456,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("pages.admin.title")}</h1>
          <p className="text-muted-foreground">
            Painel de controle e gerenciamento da plataforma
          </p>
        </div>
        <Badge variant="destructive" className="h-6">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      </div>

      {/* Warning */}
      <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">
              Área restrita. Apenas administradores têm acesso a esta página.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} ativos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.modules} módulos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Uso de IA
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4k</div>
            <p className="text-xs text-muted-foreground">
              Requisições hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sistema
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">{t("pages.admin.users")}</TabsTrigger>
          <TabsTrigger value="features">{t("pages.admin.features")}</TabsTrigger>
          <TabsTrigger value="catalog">{t("pages.admin.catalog")}</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Recentes</CardTitle>
              <CardDescription>
                Últimos usuários cadastrados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading && <LoadingState />}
              {usersError && <ErrorState error={usersError} onRetry={refetchUsers} />}
              {usersData && (
                <div className="space-y-4">
                  {usersData.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === "active" ? "default" : "outline"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>
                Ative ou desative funcionalidades da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {featuresLoading && <LoadingState />}
              {featuresError && <ErrorState error={featuresError} onRetry={refetchFeatures} />}
              {features && (
                <div className="space-y-4">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Atualizado: {new Date(feature.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(checked) => handleToggleFeature(feature.id, checked)}
                        disabled={updateFeature.isPending}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Catálogo de Recursos</CardTitle>
              <CardDescription>
                Gerencie trilhas, módulos e conteúdos da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {catalogLoading && <LoadingState />}
              {catalogError && <ErrorState error={catalogError} onRetry={refetchCatalog} />}
              {catalog && (
                <div className="space-y-4">
                  {catalog.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={resource.type === "track" ? "default" : "secondary"}>
                          {resource.type}
                        </Badge>
                        <Badge variant={resource.status === "published" ? "default" : "outline"}>
                          {resource.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>
                Monitoramento e saúde da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">API Status</p>
                    <p className="text-sm text-muted-foreground">Todos os serviços operacionais</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Conexões: 45/100</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">Saudável</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">IA Services</p>
                    <p className="text-sm text-muted-foreground">Latência: 120ms</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

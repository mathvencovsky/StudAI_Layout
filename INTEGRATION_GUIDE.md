# Guia de Integração: Stubs com Páginas Existentes

## 🎯 Objetivo

Este guia mostra como integrar os stubs e hooks criados com as páginas existentes do projeto.

## 📋 Checklist de Integração

Para cada página, siga estes passos:

### 1. Importar o Hook
```typescript
import { useMyFeature } from "@/hooks/my-feature/use-my-feature";
```

### 2. Importar Componentes de Estado
```typescript
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
```

### 3. Importar Traduções
```typescript
import { useTranslation } from "react-i18next";
```

### 4. Usar o Hook na Página
```typescript
export function MyPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useMyFeature();
  
  // Estados
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return <EmptyState title={t("pages.mypage.empty")} />;
  
  // Renderizar dados
  return <div>{/* conteúdo */}</div>;
}
```

## 📄 Páginas Pendentes de Integração

### 1. HomePage (/)
**Hook:** `use-dashboard-data`  
**Arquivo:** `src/components/home/home-page.tsx`

```typescript
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";

export function HomePage() {
  const { data, isLoading, error, refetch } = useDashboardData();
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  
  return (
    <div>
      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Streak" value={data.metrics.streak} />
        <MetricCard label="Minutos" value={data.metrics.weeklyMinutes} />
        <MetricCard label="XP" value={data.metrics.xp} />
        <MetricCard label="Nível" value={data.metrics.level} />
      </div>
      
      {/* Continuar de onde parou */}
      {data.lastContent && (
        <ContinueCard content={data.lastContent} />
      )}
      
      {/* Próximas tarefas */}
      <TasksList tasks={data.upcomingTasks} />
      
      {/* Últimas sessões */}
      <SessionsList sessions={data.recentSessions} />
    </div>
  );
}
```

### 2. ExplorePage (/explorar)
**Hooks:** `use-active-track`, `use-track-modules`, `use-tracks-catalog`  
**Arquivo:** `src/components/tracks/explorar-trilhas-page.tsx`

```typescript
import { useActiveTrack } from "@/hooks/tracks/use-active-track";
import { useTrackModules } from "@/hooks/tracks/use-track-modules";
import { useTracksCatalog } from "@/hooks/tracks/use-tracks-catalog";

export function ExplorePage() {
  const [activeTab, setActiveTab] = useState("my-track");
  
  // Minha trilha
  const { data: activeTrack, isLoading: trackLoading } = useActiveTrack();
  const { data: modules, isLoading: modulesLoading } = useTrackModules(
    activeTrack?.id || ""
  );
  
  // Catálogo
  const { data: catalog, isLoading: catalogLoading } = useTracksCatalog();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="my-track">Minha Trilha</TabsTrigger>
        <TabsTrigger value="explore">Explorar</TabsTrigger>
      </TabsList>
      
      <TabsContent value="my-track">
        {trackLoading && <LoadingState />}
        {!activeTrack && <EmptyState title="Nenhuma trilha ativa" />}
        {activeTrack && (
          <div>
            <TrackHeader track={activeTrack} />
            {modulesLoading && <LoadingState />}
            {modules && <ModulesList modules={modules} />}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="explore">
        {catalogLoading && <LoadingState />}
        {catalog && <TracksCatalog tracks={catalog} />}
      </TabsContent>
    </Tabs>
  );
}
```

### 3. SearchPage (/pesquisar)
**Hook:** `use-search`  
**Arquivo:** `src/components/search/pesquisar-page.tsx`

```typescript
import { useSearch } from "@/hooks/search/use-search";
import { useState } from "react";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  
  const { data: results, isLoading, error } = useSearch(query, {
    type: typeFilter,
  });
  
  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      
      <TypeFilters value={typeFilter} onChange={setTypeFilter} />
      
      {query.length < 3 && (
        <p className="text-muted-foreground">
          {t("pages.search.min-chars")}
        </p>
      )}
      
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} />}
      
      {results && results.length === 0 && (
        <EmptyState title={t("pages.search.no-results")} />
      )}
      
      {results && results.length > 0 && (
        <div>
          <p>{t("pages.search.results", { count: results.length })}</p>
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
}
```

### 4. AssessmentsPage (/avaliacoes)
**Hook:** `use-assessments`  
**Arquivo:** `src/components/assessments/avaliacoes-page.tsx`

```typescript
import { useAssessments } from "@/hooks/assessments/use-assessments";

export function AssessmentsPage() {
  const { data, isLoading, error, refetch } = useAssessments();
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  
  return (
    <Tabs defaultValue="available">
      <TabsList>
        <TabsTrigger value="available">
          {t("pages.assessments.available")}
        </TabsTrigger>
        <TabsTrigger value="in-progress">
          {t("pages.assessments.in-progress")}
        </TabsTrigger>
        <TabsTrigger value="completed">
          {t("pages.assessments.completed")}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="available">
        {data.available.length === 0 ? (
          <EmptyState title={t("pages.assessments.empty")} />
        ) : (
          <AssessmentsList assessments={data.available} />
        )}
      </TabsContent>
      
      <TabsContent value="in-progress">
        <AssessmentsList assessments={data.inProgress} />
      </TabsContent>
      
      <TabsContent value="completed">
        <AssessmentsList assessments={data.completed} />
      </TabsContent>
    </Tabs>
  );
}
```

### 5. SettingsPage (/configuracoes)
**Hooks:** `use-user-preferences`, `use-user-account`  
**Arquivo:** `src/components/settings/configuracoes-page.tsx`

```typescript
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/settings/use-user-preferences";
import { useUserAccount, useDeleteAccount } from "@/hooks/settings/use-user-account";

export function SettingsPage() {
  const { data: preferences, isLoading } = useUserPreferences();
  const { data: account } = useUserAccount();
  const updatePreferences = useUpdateUserPreferences();
  const deleteAccount = useDeleteAccount();
  
  if (isLoading) return <LoadingState />;
  
  const handleLanguageChange = (language: string) => {
    updatePreferences.mutate({ language });
  };
  
  const handleThemeChange = (theme: string) => {
    updatePreferences.mutate({ theme });
  };
  
  const handleDeleteAccount = async () => {
    if (confirm(t("pages.settings.delete-confirm"))) {
      await deleteAccount.mutateAsync();
      // Redirect to login
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle>{t("pages.settings.preferences")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSelector
            value={preferences.language}
            onChange={handleLanguageChange}
          />
          <ThemeSelector
            value={preferences.theme}
            onChange={handleThemeChange}
          />
        </CardContent>
      </Card>
      
      {/* Conta */}
      <Card>
        <CardHeader>
          <CardTitle>{t("pages.settings.account")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{account.email}</p>
          <p>{t("pages.settings.registered-on")}: {account.registeredAt}</p>
        </CardContent>
      </Card>
      
      {/* Zona de perigo */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>{t("pages.settings.danger-zone")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteAccount.isPending}
          >
            {t("pages.settings.delete-account")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🔄 Padrão de Mutation

Para operações que modificam dados (create, update, delete):

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => createItemStub(data),
    onSuccess: () => {
      // Invalida queries relacionadas para refetch automático
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
    onError: (error) => {
      console.error("Failed to create item:", error);
      // Mostrar toast de erro
    },
  });
}

// Uso na página
export function MyPage() {
  const createItem = useCreateItem();
  
  const handleCreate = async (data) => {
    try {
      await createItem.mutateAsync(data);
      // Sucesso - queries foram invalidadas automaticamente
    } catch (error) {
      // Erro já foi tratado no onError
    }
  };
  
  return (
    <Button
      onClick={() => handleCreate(formData)}
      disabled={createItem.isPending}
    >
      {createItem.isPending ? "Criando..." : "Criar"}
    </Button>
  );
}
```

## 🎨 Componentes de Estado

### LoadingState
```typescript
<LoadingState />
// ou com mensagem customizada
<LoadingState message="Carregando dados..." />
```

### ErrorState
```typescript
<ErrorState error={error} onRetry={refetch} />
// ou com mensagem customizada
<ErrorState
  error={error}
  onRetry={refetch}
  message="Não foi possível carregar os dados"
/>
```

### EmptyState
```typescript
<EmptyState
  title="Nenhum item encontrado"
  description="Comece criando seu primeiro item"
  icon={MyIcon}
  action={{
    label: "Criar item",
    onClick: () => navigate({ to: "/create" }),
  }}
/>
```

## 🌐 Traduções

Sempre use traduções para textos visíveis:

```typescript
const { t } = useTranslation();

// Textos simples
<h1>{t("pages.home.title")}</h1>

// Com interpolação
<p>{t("pages.home.welcome", { name: userName })}</p>

// Com contagem
<p>{t("pages.search.results", { count: results.length })}</p>
```

## ✅ Checklist por Página

- [ ] Importar hook apropriado
- [ ] Importar componentes de estado (Loading, Error, Empty)
- [ ] Importar useTranslation
- [ ] Adicionar estados de loading
- [ ] Adicionar tratamento de erro com retry
- [ ] Adicionar empty state quando apropriado
- [ ] Usar traduções para todos os textos
- [ ] Testar todos os estados (loading, error, empty, success)
- [ ] Verificar que mutations invalidam queries corretas

## 🚀 Próximos Passos

1. Escolha uma página da lista acima
2. Siga o padrão de integração
3. Teste todos os estados
4. Repita para as outras páginas

## 📚 Referências

- `SIDEBAR_FINAL_SUMMARY.md` - Resumo completo
- `SIDEBAR_TESTING_GUIDE.md` - Como testar
- `src/components/admin/admin-page.tsx` - Exemplo completo de integração

---

**Dica:** Comece pelas páginas mais simples (Settings, Assessments) e depois avance para as mais complexas (Home, Explore).

import React from "react";
import { Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ModuleListView } from "@/components/modules/module-list-view";
import { SearchBar } from "@/components/search/search-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useModuleSuggestions } from "@/hooks/modules/use-module-suggestions";
import { useModules } from "@/hooks/modules/use-modules";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useNavigate } from "@tanstack/react-router";

export interface ModuleSearchProps {
  onCreateModule?: () => void;
  onEditModule?: (moduleId: string) => void;
}

export const ModuleSearch: React.FC<ModuleSearchProps> = ({
  onCreateModule,
  onEditModule,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState<string>("");

  // Debounced suggestions (real-time)
  const [suggestInput, setSuggestInput] = React.useState<string>(query);
  const debounced = useDebouncedCallback(
    (v: string) => setSuggestInput(v),
    150,
  );
  const { data: suggestionsData } = useModuleSuggestions(suggestInput);
  const suggestions = suggestionsData ?? [];

  const { data, isLoading, isError, refetch, error } = useModules({
    q: query,
  });

  const items = data ?? [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      {/* Header with Create Module button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">{t("modules")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("manage-modules")}</p>
        </div>
        {onCreateModule && (
          <Button onClick={onCreateModule} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("create-module")}
          </Button>
        )}
      </div>

      <SearchBar
        value={query}
        onChange={(v) => {
          setQuery(v);
          debounced(v);
        }}
        placeholder={t("search-modules")}
        onClear={() => setQuery("")}
        onSubmit={refetch}
        suggestions={suggestions}
        onPickSuggestion={(s) => {
          setQuery(s);
          refetch();
        }}
      />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("loading-results")}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("couldnt-load-modules")}</AlertTitle>
          <AlertDescription>
            {t("something-went-wrong-modules")}
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      <ModuleListView
        items={items}
        query={query}
        onOpenModule={(id) => {
          // Navigate to module detail — replace with your router
          navigate({
            to: "/module/$moduleId",
            params: { moduleId: id },
          });
        }}
        onEditModule={onEditModule}
        emptyMessage={t("no-results-found")}
      />
    </div>
  );
};

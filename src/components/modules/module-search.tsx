import React from "react";
import { Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ModuleListView } from "@/components/modules/module-list-view";
import {
  type FiltersFormValues,
  FiltersBar,
} from "@/components/search/filter-bar";
import { SearchBar } from "@/components/search/search-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useModuleSuggestions } from "@/hooks/modules/use-module-suggestions";
import { useModules } from "@/hooks/modules/use-modules";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useNavigate } from "@tanstack/react-router";

// Persistence keys
const FILTERS_KEY = "moduleSearchFilters";
const QUERY_KEY = "moduleSearchQuery";

const loadFilters = (): FiltersFormValues => {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return { type: "all", status: "all" };
    const parsed = JSON.parse(raw) as FiltersFormValues;
    return parsed;
  } catch {
    return { type: "all", status: "all" };
  }
};

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
  const [query, setQuery] = React.useState<string>(() => {
    try {
      return localStorage.getItem(QUERY_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [filters, setFilters] =
    React.useState<Partial<FiltersFormValues>>(loadFilters);

  // Persist filters & query
  React.useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch {
      // ignore
    }
  }, [filters]);

  React.useEffect(() => {
    try {
      localStorage.setItem(QUERY_KEY, query);
    } catch {
      // ignore
    }
  }, [query]);

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
    // type: filters.type,
    status: filters.status,
  });

  const onClearAll = () => {
    setQuery("");
    setFilters({ type: "all", status: "all" });
  };

  const items = data ?? [];

  return (
    <div className="space-y-6">
      {/* Header with Create Module button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("modules")}</h1>
          <p className="text-muted-foreground">{t("manage-modules")}</p>
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

      <FiltersBar initial={filters} onChange={(v) => setFilters(v)} />

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
        activeFilters={filters}
        onClearFilters={() => setFilters({ type: "all", status: "all" })}
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

      <div className="flex gap-2">
        <button
          className="text-xs text-muted-foreground underline"
          onClick={onClearAll}
        >
          {t("reset-search-filters")}
        </button>
      </div>
    </div>
  );
};

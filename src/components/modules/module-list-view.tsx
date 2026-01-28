import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/highlight-text";
import { VoteButtonsContainer } from "@/components/voting/vote-buttons-container";
import type { Module } from "@/model/module";

export interface ModuleListViewProps {
  items: Module[];
  query: string;
  activeFilters: { type?: string; status?: string } | null;
  onClearFilters: () => void;
  onOpenModule: (moduleId: string) => void;
  onEditModule?: (moduleId: string) => void;
  emptyMessage?: string;
}

export const ModuleListView = ({
  items,
  query,
  activeFilters,
  onClearFilters,
  onOpenModule,
  onEditModule,
  emptyMessage,
}: ModuleListViewProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {activeFilters &&
        (activeFilters.type !== "all" || activeFilters.status !== "all") && (
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.type !== "all" && (
              <Badge variant="secondary">
                {t("type-filter")} {activeFilters.type}
              </Badge>
            )}
            {activeFilters.status !== "all" && (
              <Badge variant="secondary">
                {t("status-filter")} {activeFilters.status}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              {t("clear-filters")}
            </Button>
          </div>
        )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? t("no-results-found")}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <HighlightText text={m.title} query={query} />
                </CardTitle>
                <CardDescription>
                  <HighlightText text={m.description} query={query} />
                </CardDescription>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <Button onClick={() => onOpenModule(m.id.toString())}>
                        {t("open")}
                      </Button>
                      {onEditModule && (
                        <Button
                          variant="outline"
                          onClick={() => onEditModule(m.id)}
                        >
                          {t("edit")}
                        </Button>
                      )}
                    </div>
                    <VoteButtonsContainer moduleId={m.id} />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

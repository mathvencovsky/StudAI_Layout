import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/highlight-text";
import { VoteButtonsContainer } from "@/components/voting/vote-buttons-container";
import type { Module } from "@/model/module";

export interface ModuleListViewProps {
  items: Module[];
  query: string;
  onOpenModule: (moduleId: string) => void;
  onEditModule?: (moduleId: string) => void;
  emptyMessage?: string;
}

export const ModuleListView = ({
  items,
  query,
  onOpenModule,
  onEditModule,
  emptyMessage,
}: ModuleListViewProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? t("no-results-found")}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((m) => (
            <div
              key={m.id}
              className="border rounded-lg bg-card hover:bg-muted/50 transition-colors overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-sm font-medium text-foreground">
                  <HighlightText text={m.title} query={query} />
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  <HighlightText text={m.description} query={query} />
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onOpenModule(m.id.toString())}
                    >
                      {t("open")}
                    </Button>
                    {onEditModule && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditModule(m.id)}
                      >
                        {t("edit")}
                      </Button>
                    )}
                  </div>
                  <VoteButtonsContainer moduleId={m.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

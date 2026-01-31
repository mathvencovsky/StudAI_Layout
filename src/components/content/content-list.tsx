import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useListContent } from "@/hooks/content/use-list-content";
import { Button } from "@/components/ui/button";
import { ContentPreviewCardContainer } from "@/components/content/content-list-view-container";
import { ContentCsvInput } from "@/components/content/content-csv-input";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";

export interface ContentListProps {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
}

/**
 * Container component that manages content list data fetching.
 * Handles loading and error states, then renders content items with metadata.
 */
export const ContentList: React.FC<ContentListProps> = ({
  onCreateNew,
  onEdit,
}) => {
  const { t } = useTranslation();
  const listQ = useListContent();
  const isAdminUser = useIsAdminUser();

  const renderContent = () => {
    if (listQ.isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      );
    }

    if (listQ.isError) {
      return <p className="text-sm text-red-600">{t("couldnt-load-content")}</p>;
    }

    const items = listQ.data ?? [];

    if (items.length === 0) {
      return <p className="text-sm text-muted-foreground">{t("no-content-yet")}</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <ContentPreviewCardContainer
            key={item.id}
            item={item}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("content-items")}</h2>
        <div>
          {isAdminUser ? <ContentCsvInput /> : null}
          <Button onClick={onCreateNew}>{t("new-content")}</Button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

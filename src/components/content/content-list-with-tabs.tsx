import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useListContent } from "@/hooks/content/use-list-content";
import { Button } from "@/components/ui/button";
import { ContentPreviewCardContainer } from "@/components/content/content-list-view-container";
import { ContentBulkImportModal } from "@/components/content/content-bulk-import-modal";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { type ContentType } from "@/model/content";
import { BookOpen, FileText, Brain, Code, FlaskConical } from "lucide-react";

export interface ContentListWithTabsProps {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
}

const CONTENT_TYPE_ICONS: Record<ContentType, React.ElementType> = {
  youtube_video: BookOpen,
  article: FileText,
  quiz: Brain,
  assignment: Code,
  lab: FlaskConical,
};

import common from "@/i18n/locales/en/common";

type I18nKey = keyof typeof common;

const CONTENT_TYPE_LABEL_KEYS: Record<ContentType, I18nKey> = {
  youtube_video: "content-list-videos",
  article: "content-list-articles",
  quiz: "content-list-quizzes",
  assignment: "content-list-assignments",
  lab: "content-list-labs",
};

const CONTENT_TYPES: ContentType[] = [
  "youtube_video",
  "article",
  "quiz",
  "assignment",
  "lab",
];

/**
 * Content list with tabs for filtering by type
 */
export const ContentListWithTabs: React.FC<ContentListWithTabsProps> = ({
  onCreateNew,
  onEdit,
}) => {
  const { t } = useTranslation();
  const listQ = useListContent();
  const { isAdmin: isAdminUser } = useIsAdminUser();

  const getItems = (type: ContentType | "all") => {
    const items = listQ.data ?? [];
    return type === "all" ? items : items.filter((item) => item.type === type);
  };

  const renderGrid = (type: ContentType | "all") => {
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

    const filteredItems = getItems(type);

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            {type === "all" ? t("no-content-yet") : t("content-list-no-type")}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ContentPreviewCardContainer key={item.id} item={item} onEdit={onEdit} />
        ))}
      </div>
    );
  };

  const count = (type: ContentType | "all") =>
    listQ.data ? getItems(type).length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("content-list-title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("content-list-explore-subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdminUser && <ContentBulkImportModal />}
          <Button onClick={onCreateNew}>{t("new-content")}</Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
          <TabsTrigger value="all">
            {t("content-list-all")} ({count("all")})
          </TabsTrigger>
          {CONTENT_TYPES.map((type) => {
            const Icon = CONTENT_TYPE_ICONS[type];
            return (
              <TabsTrigger key={type} value={type} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {t(CONTENT_TYPE_LABEL_KEYS[type])} ({count(type)})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderGrid("all")}
        </TabsContent>
        {CONTENT_TYPES.map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            {renderGrid(type)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

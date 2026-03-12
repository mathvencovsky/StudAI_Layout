import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useListContent } from "@/hooks/content/use-list-content";
import { Button } from "@/components/ui/button";
import { ContentPreviewCardContainer } from "@/components/content/content-list-view-container";
import { ContentCsvInput } from "@/components/content/content-csv-input";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { type ContentType } from "@/model/content";
import { BookOpen, FileText, Brain, Code, FlaskConical } from "lucide-react";

export interface ContentListWithTabsProps {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
}

const CONTENT_TYPE_ICONS = {
  youtube_video: BookOpen,
  article: FileText,
  quiz: Brain,
  assignment: Code,
  lab: FlaskConical,
};

const CONTENT_TYPE_LABELS = {
  youtube_video: "Vídeos",
  article: "Artigos",
  quiz: "Quizzes",
  assignment: "Exercícios",
  lab: "Labs",
};

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
  const [selectedType, setSelectedType] = useState<ContentType | "all">("all");

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
    const filteredItems =
      selectedType === "all"
        ? items
        : items.filter((item) => item.type === selectedType);

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            {selectedType === "all"
              ? t("no-content-yet")
              : `Nenhum conteúdo do tipo ${CONTENT_TYPE_LABELS[selectedType as ContentType]}`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ContentPreviewCardContainer
            key={item.id}
            item={item}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  };

  const getTypeCount = (type: ContentType | "all") => {
    if (!listQ.data) return 0;
    if (type === "all") return listQ.data.length;
    return listQ.data.filter((item) => item.type === type).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Conteúdos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore materiais de estudo por categoria
          </p>
        </div>
        <div className="flex gap-2">
          {isAdminUser ? <ContentCsvInput /> : null}
          <Button onClick={onCreateNew}>{t("new-content")}</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              selectedType === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos ({getTypeCount("all")})
          </button>
          {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((type) => {
            const Icon = CONTENT_TYPE_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  selectedType === type
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {CONTENT_TYPE_LABELS[type]} ({getTypeCount(type)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      {renderContent()}
    </div>
  );
};

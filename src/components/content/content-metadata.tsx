import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/duration-utils";
import { ContentCompletionButton } from "./content-completion-button";
import type { Content } from "@/model/content";

export interface ContentHeaderProps {
  content: Content;
  moduleId?: string;
  isCompleted?: boolean;
  isLoading?: boolean;
  onToggleCompletion?: (isCompleted: boolean) => void;
}

/**
 * Displays content header with title, description, badges, and completion button.
 */
export const ContentHeader = ({
  content,
  moduleId,
  isCompleted = false,
  isLoading = false,
  onToggleCompletion,
}: ContentHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        {moduleId && onToggleCompletion && (
          <ContentCompletionButton
            contentId={content.id}
            moduleId={moduleId}
            isCompleted={isCompleted}
            isLoading={isLoading}
            onToggle={onToggleCompletion}
          />
        )}
      </div>

      <p className="text-muted-foreground whitespace-pre-wrap">
        {content.description}
      </p>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {t("type")}: {content.type}
        </Badge>
        <Badge variant="secondary">
          {t("category")}: {content.category}
        </Badge>
        <Badge variant="secondary">
          {t("level")}: {content.level}
        </Badge>
        {content.durationInSeconds && (
          <Badge variant="secondary">
            {t("duration")}: {formatDuration(content.durationInSeconds)}
          </Badge>
        )}
      </div>
    </div>
  );
};

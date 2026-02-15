import type { ModuleContentWithContentType } from "@/api/module-content";
import { ModuleContentItem } from "@/components/modules/module-content-item";
import type { UserContentProgress } from "@/model/user-content-progress";

export interface ModuleContentListProps {
  moduleContents: ModuleContentWithContentType[];
  contentProgress: UserContentProgress[];
  hasStarted: boolean;
  moduleId: string;
  onToggleCompletion: (
    contentId: string,
    isCompleted: boolean,
  ) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Renders an ordered list of module content items with optional progress indicators.
 * Items are sorted by position and completion toggles are handled via callback.
 */
export const ModuleContentList = ({
  moduleContents,
  contentProgress,
  hasStarted,
  moduleId,
  onToggleCompletion,
  isLoading = false,
}: ModuleContentListProps) => {
  const sortedModuleContents = [...moduleContents].sort(
    (a, b) => a.position - b.position,
  );

  const progressMap = new Map(contentProgress.map((p) => [p.contentId, p]));

  return (
    <div className="space-y-3">
      {sortedModuleContents.map((moduleContent) => (
        <ModuleContentItem
          key={moduleContent.id}
          moduleContent={moduleContent}
          progress={progressMap.get(moduleContent.contentId)}
          hasStarted={hasStarted}
          moduleId={moduleId}
          onToggleCompletion={onToggleCompletion}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

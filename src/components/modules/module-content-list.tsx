import type { ModuleContentWithContentType } from "@/api/module-content";
import { ModuleContentItem } from "@/components/modules/module-content-item";
import type { UserContentProgress } from "@/model/user-content-progress";

export interface ModuleContentListProps {
  items: ModuleContentWithContentType[];
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
 * Renders an ordered list of content items with optional progress indicators.
 * Items are sorted by position and completion toggles are handled via callback.
 */
export const ModuleContentList = ({
  items,
  contentProgress,
  hasStarted,
  moduleId,
  onToggleCompletion,
  isLoading = false,
}: ModuleContentListProps) => {
  // Sort items by position to maintain order
  const sortedItems = [...items].sort((a, b) => a.position - b.position);

  // Create a map for quick progress lookup
  const progressMap = new Map(contentProgress.map((p) => [p.contentId, p]));

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => (
        <ModuleContentItem
          key={item.id}
          item={item}
          progress={progressMap.get(item.id)}
          hasStarted={hasStarted}
          moduleId={moduleId}
          onToggleCompletion={onToggleCompletion}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

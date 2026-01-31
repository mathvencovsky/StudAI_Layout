import type { ModuleContentWithContentType } from "@/api/module-content";
import type { UserContentProgress } from "@/model/user-content-progress";

/**
 * Selects up to 3 module contents to display based on completion status
 * Selection logic:
 * - If less than 3 module contents: Show all of them
 * - If 3 or more module contents:
 *   - If only 1 incomplete: Show 2 completed and the 1 incomplete
 *   - Otherwise: Show at least 1 completed and fill rest with incomplete
 * Results are returned in original module order
 */
export const selectContentsForDisplay = (
  allModuleContents: ModuleContentWithContentType[],
  completionStatus: UserContentProgress[],
): ModuleContentWithContentType[] => {
  if (allModuleContents.length === 0) {
    return [];
  }

  if (allModuleContents.length <= 3) {
    return allModuleContents;
  }

  const completedSet = new Set(
    completionStatus
      .filter((status) => status.isCompleted)
      .map((status) => status.contentId),
  );

  const completedModuleContents = allModuleContents.filter((moduleContent) =>
    completedSet.has(moduleContent.contentId),
  );
  const incompleteModuleContents = allModuleContents.filter(
    (moduleContent) => !completedSet.has(moduleContent.contentId),
  );

  const selectedContentIds: Set<string> = new Set();

  if (incompleteModuleContents.length === 1) {
    const lastTwoCompleted = completedModuleContents.slice(-2);
    lastTwoCompleted.forEach((mc) => selectedContentIds.add(mc.contentId));
    selectedContentIds.add(incompleteModuleContents[0].contentId);
  } else {
    const lastCompleted = completedModuleContents.slice(-1);
    lastCompleted.forEach((mc) => selectedContentIds.add(mc.contentId));
    const firstIncomplete = incompleteModuleContents.slice(0, 2);
    firstIncomplete.forEach((mc) => selectedContentIds.add(mc.contentId));
  }

  return allModuleContents.filter((moduleContent) =>
    selectedContentIds.has(moduleContent.contentId),
  );
};

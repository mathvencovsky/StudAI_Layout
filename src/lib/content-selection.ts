import type { ModuleContentWithContentType } from "@/api/module-content";
import type { UserContentProgress } from "@/model/user-content-progress";

/**
 * Selects up to 3 contents to display based on completion status
 * Selection logic:
 * - If less than 3 contents: Show all of them
 * - If 3 or more contents:
 *   - If only 1 incomplete: Show 2 completed and the 1 incomplete
 *   - Otherwise: Show at least 1 completed and fill rest with incomplete
 * Results are returned in original module order
 */
export const selectContentsForDisplay = (
  allContents: ModuleContentWithContentType[],
  completionStatus: UserContentProgress[],
): ModuleContentWithContentType[] => {
  if (allContents.length === 0) {
    return [];
  }

  if (allContents.length <= 3) {
    return allContents;
  }

  const completedSet = new Set(
    completionStatus
      .filter((status) => status.isCompleted)
      .map((status) => status.contentId),
  );

  const completed = allContents.filter((content) =>
    completedSet.has(content.id),
  );
  const incomplete = allContents.filter(
    (content) => !completedSet.has(content.id),
  );

  const selectedIds: Set<string> = new Set();

  if (incomplete.length === 1) {
    const lastTwoCompleted = completed.slice(-2);
    lastTwoCompleted.forEach((c) => selectedIds.add(c.id));
    selectedIds.add(incomplete[0].id);
  } else {
    const lastCompleted = completed.slice(-1);
    lastCompleted.forEach((c) => selectedIds.add(c.id));
    const firstIncomplete = incomplete.slice(0, 2);
    firstIncomplete.forEach((c) => selectedIds.add(c.id));
  }

  return allContents.filter((content) => selectedIds.has(content.id));
};

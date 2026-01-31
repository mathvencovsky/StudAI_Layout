import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export interface ModuleProgressInfo {
  moduleId: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  status: "not_started" | "in_progress" | "completed";
}

export type ModuleProgressMap = Record<string, ModuleProgressInfo>;

const client = generateClient<Schema>();

/**
 * Fetches progress for multiple modules in a single batch operation
 */
export const getBatchModuleProgress = async (
  moduleIds: string[],
): Promise<ModuleProgressMap> => {
  if (moduleIds.length === 0) {
    return {};
  }

  const [contentProgressResult, moduleContentsResult] = await Promise.all([
    client.models.UserContentProgress.list({
      filter: {
        or: moduleIds.map((id) => ({ moduleId: { eq: id } })),
      },
    }),
    client.models.ModuleContent.list({
      filter: {
        or: moduleIds.map((id) => ({ moduleId: { eq: id } })),
      },
    }),
  ]);

  const contentProgress = contentProgressResult.data ?? [];
  const moduleContents = moduleContentsResult.data ?? [];

  const totalByModule = new Map<string, number>();
  const moduleContentIds = new Map<string, Set<string>>();
  for (const moduleContent of moduleContents) {
    totalByModule.set(
      moduleContent.moduleId,
      (totalByModule.get(moduleContent.moduleId) ?? 0) + 1,
    );
    const contentIds =
      moduleContentIds.get(moduleContent.moduleId) ?? new Set();
    contentIds.add(moduleContent.contentId);
    moduleContentIds.set(moduleContent.moduleId, contentIds);
  }

  const completedByModule = new Map<string, number>();
  for (const progress of contentProgress) {
    if (progress.isCompleted) {
      const validContentIds = moduleContentIds.get(progress.moduleId);
      if (validContentIds?.has(progress.contentId)) {
        const current = completedByModule.get(progress.moduleId) ?? 0;
        completedByModule.set(progress.moduleId, current + 1);
      }
    }
  }

  const result: ModuleProgressMap = {};
  for (const moduleId of moduleIds) {
    const totalCount = totalByModule.get(moduleId) ?? 0;
    const completedCount = completedByModule.get(moduleId) ?? 0;
    const percentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let status: ModuleProgressInfo["status"] = "not_started";
    if (completedCount > 0 && completedCount < totalCount) {
      status = "in_progress";
    } else if (completedCount > 0 && completedCount === totalCount) {
      status = "completed";
    }

    result[moduleId] = {
      moduleId,
      completedCount,
      totalCount,
      percentage,
      status,
    };
  }

  return result;
};

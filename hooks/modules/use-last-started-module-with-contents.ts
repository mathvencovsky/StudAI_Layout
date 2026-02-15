import { useLastStartedModule } from "./use-last-started-module";
import { useModuleContents } from "./use-module-contents";
import { useGetUserContentProgress } from "./use-get-user-content-progress";
import { selectContentsForDisplay } from "@/lib/content-selection";
import type { Module } from "@/model/module";
import type { ModuleContentWithContentType } from "@/api/module-content";
import type { UserContentProgress } from "@/model/user-content-progress";
import { useModule } from "@/hooks/modules/use-module";

export interface ModuleContentWithCompletionStatus
  extends ModuleContentWithContentType {
  isCompleted: boolean;
}

export interface LastStartedModuleWithContents {
  module: Module;
  moduleContents: ModuleContentWithCompletionStatus[];
  totalModuleContents: number;
  completedCount: number;
}

/**
 * Hook that fetches the last started module with intelligently selected contents
 * Combines data from multiple sources and applies content selection algorithm
 */
export const useLastStartedModuleWithContents = () => {
  const lastStartedModuleQuery = useLastStartedModule();
  const moduleId = lastStartedModuleQuery.data?.moduleId;

  const moduleContentsQuery = useModuleContents({
    moduleId: moduleId || "",
  });

  const contentProgressQuery = useGetUserContentProgress(moduleId || "");

  const moduleDetailsQuery = useModule(moduleId);

  const isLoading =
    lastStartedModuleQuery.isLoading ||
    moduleContentsQuery.isLoading ||
    contentProgressQuery.isLoading ||
    moduleDetailsQuery.isLoading;

  const isError =
    lastStartedModuleQuery.isError ||
    moduleContentsQuery.isError ||
    contentProgressQuery.isError ||
    moduleDetailsQuery.isError;

  const data: LastStartedModuleWithContents | null =
    lastStartedModuleQuery.data &&
    moduleDetailsQuery.data &&
    moduleContentsQuery.data &&
    contentProgressQuery.data
      ? (() => {
          const completedSet = new Set(
            contentProgressQuery.data
              .filter((status: UserContentProgress) => status.isCompleted)
              .map((status: UserContentProgress) => status.contentId),
          );

          const selectedModuleContents = selectContentsForDisplay(
            moduleContentsQuery.data,
            contentProgressQuery.data,
          );

          const moduleContentsWithStatus: ModuleContentWithCompletionStatus[] =
            selectedModuleContents.map(
              (moduleContent: ModuleContentWithContentType) => ({
                ...moduleContent,
                isCompleted: completedSet.has(moduleContent.contentId),
              }),
            );

          const completedCount = moduleContentsQuery.data.filter(
            (moduleContent: ModuleContentWithContentType) =>
              completedSet.has(moduleContent.contentId),
          ).length;

          return {
            module: moduleDetailsQuery.data,
            moduleContents: moduleContentsWithStatus,
            totalModuleContents: moduleContentsQuery.data.length,
            completedCount,
          };
        })()
      : null;

  return {
    data,
    isLoading,
    isError,
    error:
      lastStartedModuleQuery.error ||
      moduleContentsQuery.error ||
      contentProgressQuery.error ||
      moduleDetailsQuery.error,
  };
};

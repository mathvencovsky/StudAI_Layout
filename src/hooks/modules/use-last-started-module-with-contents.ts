import { useLastStartedModule } from "./use-last-started-module";
import { useModuleContents } from "./use-module-contents";
import { useGetUserContentProgress } from "./use-get-user-content-progress";
import { selectContentsForDisplay } from "@/lib/content-selection";
import type { Module } from "@/model/module";
import type { ModuleContentWithContentType } from "@/api/module-content";
import { useModule } from "@/hooks/modules/use-module";

export interface ContentWithCompletionStatus extends ModuleContentWithContentType {
  isCompleted: boolean;
}

export interface LastStartedModuleWithContents {
  module: Module;
  contents: ContentWithCompletionStatus[];
  totalContents: number;
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
            contentProgressQuery.data.items
              .filter((status) => status.isCompleted)
              .map((status) => status.contentId),
          );

          const selectedContents = selectContentsForDisplay(
            moduleContentsQuery.data.items,
            contentProgressQuery.data.items,
          );

          const contentsWithStatus: ContentWithCompletionStatus[] =
            selectedContents.map((content) => ({
              ...content,
              isCompleted: completedSet.has(content.id),
            }));

          const completedCount = moduleContentsQuery.data.items.filter(
            (content) => completedSet.has(content.id),
          ).length;

          return {
            module: moduleDetailsQuery.data,
            contents: contentsWithStatus,
            totalContents: moduleContentsQuery.data.items.length,
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

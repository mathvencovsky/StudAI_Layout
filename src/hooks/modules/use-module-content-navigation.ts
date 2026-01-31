import { useModuleContents } from "./use-module-contents";
import type { ModuleContentWithContentType } from "@/api/module-content";

export interface UseModuleContentNavigationParams {
  moduleId: string;
  currentContentId: string;
}

export interface UseModuleContentNavigationReturn {
  currentPosition: number;
  totalItems: number;
  nextContentId: string | null;
  previousContentId: string | null;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
  isLoading: boolean;
}

/**
 * Hook that manages navigation logic within a module.
 * Calculates current position, total items, and available navigation targets.
 */
export const useModuleContentNavigation = ({
  moduleId,
  currentContentId,
}: UseModuleContentNavigationParams): UseModuleContentNavigationReturn => {
  const { data: moduleContentsResponse, isLoading } = useModuleContents({
    moduleId,
  });

  const moduleContents = moduleContentsResponse ?? [];
  const currentIndex = moduleContents.findIndex(
    (moduleContent: ModuleContentWithContentType) =>
      moduleContent.contentId === currentContentId,
  );
  const currentPosition = currentIndex + 1;
  const totalItems = moduleContents.length;

  const nextContentId =
    currentIndex >= 0 && currentIndex < moduleContents.length - 1
      ? moduleContents[currentIndex + 1].contentId
      : null;

  const previousContentId =
    currentIndex > 0 ? moduleContents[currentIndex - 1].contentId : null;

  const canNavigateNext = nextContentId !== null;
  const canNavigatePrevious = previousContentId !== null;

  return {
    currentPosition,
    totalItems,
    nextContentId,
    previousContentId,
    canNavigateNext,
    canNavigatePrevious,
    isLoading,
  };
};

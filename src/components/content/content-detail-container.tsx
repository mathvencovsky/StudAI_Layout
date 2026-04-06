import { useGetContent } from "@/hooks/content/use-get-content";
import { useGetUserContentProgress } from "@/hooks/modules/use-get-user-content-progress";
import { useToggleContentCompletion } from "@/hooks/modules/use-toggle-content-completion";
import { useModuleContentNavigation } from "@/hooks/modules/use-module-content-navigation";
import { useCompleteModule } from "@/hooks/modules/use-complete-module";
import { ContentDetailView } from "./content-detail-view";
import { ContentLoadingState } from "@/components/ui/loading-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAiChat } from "@/hooks/ai/use-ai-chat";

export interface ContentDetailContainerProps {
  contentId: string;
  moduleId?: string;
}

/**
 * Manages content data fetching and state for the content detail view.
 * Handles navigation between content items within a module.
 */
export const ContentDetailContainer = ({
  contentId,
  moduleId,
}: ContentDetailContainerProps) => {
  const navigate = useNavigate();
  useAiChat(); // keeps AI icon visible in header
  const { data: content, isLoading, isError } = useGetContent(contentId);
  const { data: progressData } = useGetUserContentProgress(moduleId || "");
  const toggleMutation = useToggleContentCompletion();
  const completeModuleMutation = useCompleteModule();
  const [optimisticCompleted, setOptimisticCompleted] = useState<
    boolean | null
  >(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationData = useModuleContentNavigation({
    moduleId: moduleId || "",
    currentContentId: contentId,
  });

  const hasInvalidModuleContext = moduleId && navigationData.totalItems === 0;

  const contentProgress = progressData?.find(
    (item) => item.contentId === contentId,
  );
  const isCompleted =
    optimisticCompleted !== null
      ? optimisticCompleted
      : (contentProgress?.isCompleted ?? false);

  const handleToggleCompletion = async (newState: boolean) => {
    if (!moduleId) return;

    setOptimisticCompleted(newState);

    try {
      await toggleMutation.mutateAsync({
        moduleId,
        contentId,
        isCompleted: newState,
      });
    } catch {
      setOptimisticCompleted(null);
    }
  };

  const handleNavigatePrevious = async () => {
    if (!moduleId || !navigationData.previousContentId) return;

    setIsNavigating(true);
    try {
      await navigate({
        to: "/module/$moduleId/content/$contentId",
        params: {
          moduleId,
          contentId: navigationData.previousContentId,
        },
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const handleNavigateNext = async () => {
    if (!moduleId || !navigationData.nextContentId) return;

    setIsNavigating(true);
    try {
      await navigate({
        to: "/module/$moduleId/content/$contentId",
        params: {
          moduleId,
          contentId: navigationData.nextContentId,
        },
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const handleCompleteModule = async () => {
    if (!moduleId) return;

    setIsNavigating(true);
    try {
      await completeModuleMutation.mutateAsync(moduleId);
      await navigate({
        to: "/module/$moduleId",
        params: { moduleId },
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const renderContent = () => {
    if (isLoading || navigationData.isLoading) {
      return <ContentLoadingState />;
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Couldn't load content details. Please try again.
          </AlertDescription>
        </Alert>
      );
    }

    if (!content) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Content not found.</AlertDescription>
        </Alert>
      );
    }

    if (hasInvalidModuleContext) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Module Not Found</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <span>The module context is invalid or no longer available.</span>
            <Button
              onClick={() => navigate({ to: "/module" })}
              variant="outline"
              size="sm"
            >
              Return to Modules
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <ContentDetailView
        content={content}
        moduleId={moduleId}
        isCompleted={isCompleted}
        isLoading={toggleMutation.isPending}
        onToggleCompletion={handleToggleCompletion}
        currentPosition={navigationData.currentPosition}
        totalItems={navigationData.totalItems}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateNext={handleNavigateNext}
        onCompleteModule={handleCompleteModule}
        isNavigating={isNavigating}
      />
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {renderContent()}
    </div>
  );
};

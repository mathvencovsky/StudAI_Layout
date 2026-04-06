import { useGetContent } from "@/hooks/content/use-get-content";
import { useGetUserContentProgress } from "@/hooks/modules/use-get-user-content-progress";
import { useToggleContentCompletion } from "@/hooks/modules/use-toggle-content-completion";
import { useModuleContentNavigation } from "@/hooks/modules/use-module-content-navigation";
import { useCompleteModule } from "@/hooks/modules/use-complete-module";
import { ContentDetailView } from "./content-detail-view";
import { AiStudyAssistant } from "./ai-study-assistant";
import { ContentLoadingState } from "@/components/ui/loading-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useAiChat } from "@/hooks/ai/use-ai-chat";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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
  const { t } = useTranslation();
  const { isOpen, openChat, closeChat } = useAiChat();
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
    <div className="relative h-full">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel defaultSize={isOpen ? 60 : 100} minSize={30}>
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto py-8 px-4 space-y-6">
              {renderContent()}
            </div>
          </div>
        </ResizablePanel>
        {isOpen && content && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={25}>
              <AiStudyAssistant content={content} onClose={closeChat} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Floating AI button — always visible when chat is closed */}
      {!isOpen && (
        <button
          onClick={openChat}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "flex items-center gap-2 px-4 py-3 rounded-full",
            "bg-primary text-primary-foreground shadow-lg",
            "hover:bg-primary/90 hover:shadow-xl hover:scale-105",
            "transition-all duration-200",
            "md:bottom-8 md:right-8"
          )}
          aria-label={t("ai-chat-toggle")}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold hidden sm:inline">
            {t("ai-chat-title")}
          </span>
        </button>
      )}
    </div>
  );
};

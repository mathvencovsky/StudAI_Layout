import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ModuleHeader } from "@/components/modules/module-header";
import { ModuleContentList } from "@/components/modules/module-content-list";
import { ProgressBar } from "@/components/modules/progress-bar";
import { useModule } from "@/hooks/modules/use-module";
import { useModuleContents } from "@/hooks/modules/use-module-contents";
import { useGetUserModuleProgress } from "@/hooks/modules/use-get-user-module-progress";
import { useGetUserContentProgress } from "@/hooks/modules/use-get-user-content-progress";
import { useStartModule } from "@/hooks/modules/use-start-module";
import { useToggleContentCompletion } from "@/hooks/modules/use-toggle-content-completion";
import { ModuleLoadingState } from "@/components/ui/loading-state";
import { useCompleteModule, useUncompleteModule } from "@/hooks/modules/use-complete-module";

export interface ModuleDetailContainerProps {
  moduleId: string;
}

/**
 * Container component that manages module state, progress tracking, and data fetching.
 * Orchestrates all child components and handles API interactions.
 */
export const ModuleDetailContainer = ({
  moduleId,
}: ModuleDetailContainerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [startError, setStartError] = useState<string>("");
  const [completionError, setCompletionError] = useState<string>("");
  const [completionErrorContentId, setCompletionErrorContentId] = useState<
    string | null
  >(null);

  // Fetch module data
  const {
    data: module,
    isLoading: isModuleLoading,
    isError: isModuleError,
  } = useModule(moduleId);

  // Fetch module contents
  const {
    data: contentsResponse,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useModuleContents({ moduleId });

  // Fetch user's module progress
  const {
    data: userProgress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useGetUserModuleProgress(moduleId);

  // Fetch user's content completion status (only after user has started)
  const {
    data: contentProgressResponse,
    isLoading: isContentProgressLoading,
    isError: isContentProgressError,
  } = useGetUserContentProgress(moduleId);

  // Mutations
  const startModuleMutation = useStartModule();
  const toggleCompletionMutation = useToggleContentCompletion();
  const completeModuleMutation = useCompleteModule();
  const uncompleteModuleMutation = useUncompleteModule();

  const contentItems = contentsResponse ?? [];
  const contentProgress = contentProgressResponse ?? [];
  const hasStarted = userProgress !== null && userProgress !== undefined;

  const handleStartModule = async () => {
    setStartError("");
    try {
      await startModuleMutation.mutateAsync({ moduleId });
    } catch (err) {
      console.error(err);
      setStartError(t("couldnt-start-module"));
    }
  };

  const handleToggleCompletion = async (
    contentId: string,
    isCompleted: boolean
  ) => {
    setCompletionError("");
    setCompletionErrorContentId(null);
    try {
      await toggleCompletionMutation.mutateAsync({
        moduleId,
        contentId,
        isCompleted,
      });
    } catch (err) {
      console.error(err);
      setCompletionError(t("couldnt-save-progress"));
      setCompletionErrorContentId(contentId);
    }
  };

  const handleRetryCompletion = async () => {
    if (completionErrorContentId) {
      const progress = contentProgress.find(
        (p) => p.contentId === completionErrorContentId
      );
      if (progress) {
        await handleToggleCompletion(
          completionErrorContentId,
          !progress.isCompleted
        );
      }
    }
  };

  const handleCompleteModule = async () => {
    try {
      await completeModuleMutation.mutateAsync(moduleId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUncompleteModule = async () => {
    try {
      await uncompleteModuleMutation.mutateAsync(moduleId);
    } catch (err) {
      console.error(err);
    }
  };

  const isLoading =
    isModuleLoading ||
    isContentsLoading ||
    isProgressLoading ||
    isContentProgressLoading;

  // Module not found
  if (!isModuleLoading && !module) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>{t("module-not-found")}</AlertTitle>
          <AlertDescription>
            {t("module-not-found-description")}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: "/module" })}>
          {t("back-to-modules")}
        </Button>
      </div>
    );
  }

  // Module loading error
  if (isModuleError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("couldnt-load-module-details")}</AlertTitle>
        <AlertDescription>
          {t("couldnt-load-module-details-description")}
        </AlertDescription>
      </Alert>
    );
  }

  // Contents loading error
  if (isContentsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("couldnt-load-module-contents")}</AlertTitle>
        <AlertDescription>
          {t("couldnt-load-module-contents-description")}
        </AlertDescription>
      </Alert>
    );
  }

  // Progress loading error - only show if not loading and there's an error
  // (null is a valid state when user hasn't started the module)
  if (!isProgressLoading && isProgressError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("couldnt-load-progress")}</AlertTitle>
        <AlertDescription>
          {t("couldnt-load-progress-description")}
        </AlertDescription>
      </Alert>
    );
  }

  // Content progress loading error - only show if not loading and there's an error
  // (empty array is a valid state when user hasn't started the module)
  if (!isContentProgressLoading && isContentProgressError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("couldnt-load-content-progress")}</AlertTitle>
        <AlertDescription>
          {t("couldnt-load-content-progress-description")}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <ModuleLoadingState />;
  }

  return (
    <div className="space-y-6">
      {module && (
        <ModuleHeader
          module={module}
          userProgress={userProgress ?? null}
          onStartModule={handleStartModule}
          onCompleteModule={handleCompleteModule}
          onUncompleteModule={handleUncompleteModule}
          isLoading={startModuleMutation.isPending}
          isCompleting={
            completeModuleMutation.isPending ||
            uncompleteModuleMutation.isPending
          }
          moduleContents={contentItems}
        />
      )}

      {/* Progress Bar - Only shown if user has started */}
      {hasStarted && userProgress !== null && userProgress !== undefined && (
        <ProgressBar
          userProgress={userProgress}
          contentProgress={contentProgress}
          totalContentCount={contentItems.length}
        />
      )}

      {/* Start Module Error */}
      {startError && (
        <div className="space-y-2">
          <Alert variant="destructive">
            <AlertTitle>{t("error")}</AlertTitle>
            <AlertDescription>{startError}</AlertDescription>
          </Alert>
          <Button
            onClick={handleStartModule}
            disabled={startModuleMutation.isPending}
          >
            {startModuleMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("retrying")}
              </>
            ) : (
              t("retry")
            )}
          </Button>
        </div>
      )}

      {/* Content List */}
      <ModuleContentList
        moduleContents={contentItems}
        contentProgress={contentProgress}
        hasStarted={hasStarted}
        moduleId={moduleId}
        onToggleCompletion={handleToggleCompletion}
        isLoading={toggleCompletionMutation.isPending}
      />

      {/* Completion Error */}
      {completionError && (
        <div className="space-y-2">
          <Alert variant="destructive">
            <AlertTitle>{t("error")}</AlertTitle>
            <AlertDescription>{completionError}</AlertDescription>
          </Alert>
          <Button
            onClick={handleRetryCompletion}
            disabled={toggleCompletionMutation.isPending}
          >
            {toggleCompletionMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("retrying")}
              </>
            ) : (
              t("retry")
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

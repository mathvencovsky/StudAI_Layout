import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLastStartedModuleWithContents } from "@/hooks/modules/use-last-started-module-with-contents";
import { useToggleContentCompletion } from "@/hooks/modules/use-toggle-content-completion";
import { LastStartedModuleDisplay } from "./last-started-module-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LastStartedModuleSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLastStartedModuleWithContents();
  const toggleContentCompletionMutation = useToggleContentCompletion();

  const handleModuleClick = () => {
    if (!data) return;
    navigate({
      to: "/module/$moduleId",
      params: { moduleId: data.module.id },
    });
  };

  const handleContentClick = (contentId: string) => {
    if (!data) return;
    navigate({
      to: "/module/$moduleId/content/$contentId",
      params: { contentId, moduleId: data.module.id },
    });
  };

  const handleToggleCompletion = (contentId: string) => {
    if (!data) return;
    toggleContentCompletionMutation.mutate({
      moduleId: data.module.id,
      contentId,
      isCompleted: true,
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("failed-load-last-module")}</AlertDescription>
        </Alert>
      );
    }

    if (!data) {
      return (
        <div className="border rounded-lg p-6 text-center space-y-4">
          <p className="text-muted-foreground">{t("no-modules-to-continue")}</p>
          <Button onClick={() => navigate({ to: "/module" })}>
            {t("browse-modules")}
          </Button>
        </div>
      );
    }

    return (
      <LastStartedModuleDisplay
        module={data.module}
        moduleContents={data.moduleContents}
        totalModuleContents={data.totalModuleContents}
        completedCount={data.completedCount}
        onModuleClick={handleModuleClick}
        onContentClick={handleContentClick}
        onToggleCompletion={handleToggleCompletion}
      />
    );
  };

  return <div className="space-y-3">{renderContent()}</div>;
};

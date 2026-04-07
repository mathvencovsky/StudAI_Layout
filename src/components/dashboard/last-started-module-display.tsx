import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { ContentItemDisplay } from "./content-item-display";
import type { Module } from "@/model/module";
import type { ModuleContentWithCompletionStatus } from "@/hooks/modules/use-last-started-module-with-contents";

export interface LastStartedModuleDisplayProps {
  module: Module;
  moduleContents: ModuleContentWithCompletionStatus[];
  totalModuleContents: number;
  completedCount: number;
  onContentClick: (contentId: string) => void;
  onModuleClick: () => void;
  onToggleCompletion: (contentId: string) => void;
}

export const LastStartedModuleDisplay = ({
  module,
  moduleContents,
  totalModuleContents,
  completedCount,
  onContentClick,
  onModuleClick,
  onToggleCompletion,
}: LastStartedModuleDisplayProps) => {
  const { t } = useTranslation();
  const progressPercentage =
    totalModuleContents > 0 ? (completedCount / totalModuleContents) * 100 : 0;

  // Find the next incomplete content to resume from
  const nextContent = moduleContents.find((c) => !c.isCompleted);

  return (
    <Card className="w-full">
      <CardHeader
        className="cursor-pointer hover:bg-accent/20 transition-colors pb-3"
        onClick={onModuleClick}
      >
        <CardTitle className="text-base">{module.title}</CardTitle>
        <CardDescription className="line-clamp-2">{module.description}</CardDescription>
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t("progress-label")}</span>
            <span className="font-medium text-foreground">
              {completedCount}/{totalModuleContents} {t("completed")}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>
      </CardHeader>

      {/* Primary CTA — resume from where they left off */}
      {nextContent && (
        <div className="px-6 pb-3">
          <Button
            className="w-full gap-2"
            onClick={() => onContentClick(nextContent.contentId)}
          >
            <PlayCircle className="h-4 w-4" />
            {t("continue-learning")}
          </Button>
        </div>
      )}

      {/* Content list */}
      <CardContent className="pt-0">
        <div className="space-y-2">
          {moduleContents.map((moduleContent) => (
            <ContentItemDisplay
              key={moduleContent.id}
              moduleContent={moduleContent}
              isCompleted={moduleContent.isCompleted}
              onClick={() => onContentClick(moduleContent.contentId)}
              onToggleCompletion={() =>
                onToggleCompletion(moduleContent.contentId)
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

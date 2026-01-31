import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { formatDuration } from "@/lib/duration-utils";
import type { Module } from "@/model/module";
import type { UserModuleProgress } from "@/model/user-module-progress";
import type { ModuleContentWithContentType } from "@/api/module-content";
import { Loader2 } from "lucide-react";
import { VoteButtonsContainer } from "@/components/voting/vote-buttons-container";

export interface ModuleHeaderProps {
  module: Module;
  userProgress: UserModuleProgress | null;
  onStartModule: () => Promise<void>;
  isLoading?: boolean;
  moduleContents?: ModuleContentWithContentType[];
}

export const ModuleHeader = ({
  module,
  userProgress,
  onStartModule,
  isLoading = false,
  moduleContents = [],
}: ModuleHeaderProps) => {
  const { t } = useTranslation();
  const formatDate = (dateTimestamp: number) => {
    const date = new Date(dateTimestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalDuration = moduleContents.reduce((total, moduleContent) => {
    return total + (moduleContent.content.durationInSeconds || 0);
  }, 0);
  const formattedTotalDuration = formatDuration(totalDuration);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
        {userProgress === null && (
          <CardAction>
            <Button onClick={onStartModule} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              {t("start-module")}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col justify-center space-y-2">
            {userProgress && (
              <div className="text-sm text-muted-foreground">
                {t("started-on")} {formatDate(userProgress.startDate)}
              </div>
            )}
            {formattedTotalDuration && (
              <div className="text-sm text-muted-foreground">
                {t("total-duration")} {formattedTotalDuration}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end shrink-0">
            <VoteButtonsContainer moduleId={module.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

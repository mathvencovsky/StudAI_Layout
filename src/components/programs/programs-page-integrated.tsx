import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { useListPrograms } from "@/hooks/program/use-list-programs";
import { useListUserProgramProgress } from "@/hooks/user-program-progress/use-list-user-program-progress";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export default function ProgramsPageIntegrated() {
  const { t } = useTranslation();
  const { data: programs, isLoading: programsLoading, error: programsError, refetch: refetchPrograms } = useListPrograms();
  const { data: progressList } = useListUserProgramProgress();

  const isLoading = programsLoading;
  const error = programsError;
  const refetch = refetchPrograms;

  const getProgress = (programId: string) => {
    const prog = progressList?.find((p) => p.programId === programId);
    return { progress: prog?.progress ?? 0, completedHours: prog?.completedHours ?? 0 };
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages-programs-title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages-programs-description")}
        </p>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <>
          {!programs || programs.length === 0 ? (
            <EmptyState
              title={t("pages-programs-no-active")}
              description={t("pages-programs-no-programs-description")}
              icon={BookOpen}
            />
          ) : (
            <div className="space-y-4">
              {programs.map((program) => {
                const { progress, completedHours } = getProgress(program.id);
                return (
                <section
                  key={program.id}
                  className="border rounded-lg bg-card overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {program.category}
                          </span>
                          {program.status === "in_progress" && (
                            <span className="text-xs text-primary">
                              {t("pages-programs-in-progress")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground truncate">
                          {program.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {program.modules}{" "}
                            {t("pages-programs-modules")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {program.totalHours}h
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {progress}%
                        </span>
                        <span className="text-muted-foreground">
                          {completedHours}h/{program.totalHours}h
                        </span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>
                  </div>
                </section>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

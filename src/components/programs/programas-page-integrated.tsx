import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { usePrograms } from "@/hooks/programs/use-programs";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export default function Programas() {
  const { t } = useTranslation();
  const { data: programs, isLoading, error, refetch } = usePrograms();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.programs.title", "Programas")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.programs.description", "Trilhas ativas.")}
        </p>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <>
          {!programs || programs.length === 0 ? (
            <EmptyState
              title={t("pages.programs.no-programs", "Nenhum programa ativo")}
              description={t(
                "pages.programs.no-programs-description",
                "Comece um programa para acompanhar seu progresso"
              )}
              icon={BookOpen}
            />
          ) : (
            <div className="space-y-4">
              {programs.map((program) => (
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
                              {t("pages.programs.in-progress", "Em andamento")}
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
                            {t("pages.programs.modules", "módulos")}
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
                          {program.progress}%
                        </span>
                        <span className="text-muted-foreground">
                          {program.completedHours}h/{program.totalHours}h
                        </span>
                      </div>
                      <Progress value={program.progress} className="h-1" />
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

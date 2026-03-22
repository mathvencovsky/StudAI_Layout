import { useMemo } from "react";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useModules } from "@/hooks/modules/use-modules";
import { listUserModuleProgress } from "@/api/module-progress";

export interface ROIMetrics {
  timeInvested: string;
  efficiency: number;
  estimatedROI: string;
  velocity: string;
}

export interface ModuleEfficiency {
  module: string;
  efficiency: number;
  hoursSpent: number;
  expected: number;
}

const DEFAULT_EXPECTED_HOURS = 10;
const HOURLY_VALUE_BRL = 50;
const BASELINE_SESSIONS_PER_WEEK = 5;

const listUserModuleProgressQueryOptions = () =>
  queryOptions({
    queryKey: ["user-module-progress", "list"],
    queryFn: async () => {
      try {
        return await listUserModuleProgress();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

/**
 * Returns ROI metrics computed from real StudySession data.
 */
export function useROIMetrics() {
  const { data: sessions = [], isLoading, error, refetch } = useListStudySessions();

  const data = useMemo((): ROIMetrics => {
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
    const totalHours = Math.round(totalMinutes / 60);

    const scoredSessions = sessions.filter((s) => (s.score ?? 0) > 0);
    const efficiency =
      scoredSessions.length > 0
        ? Math.round(scoredSessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoredSessions.length)
        : 0;

    const estimatedValue = totalHours * HOURLY_VALUE_BRL;
    const estimatedROI =
      estimatedValue >= 1000
        ? `R$ ${Math.round(estimatedValue / 1000)}k`
        : `R$ ${estimatedValue}`;

    const weekAgoS = (Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000;
    const recentCount = sessions.filter((s) => s.startedAt >= weekAgoS).length;
    const velocityRatio = recentCount / BASELINE_SESSIONS_PER_WEEK;
    const velocity = `${velocityRatio.toFixed(1)}x`;

    return { timeInvested: `${totalHours}h`, efficiency, estimatedROI, velocity };
  }, [sessions]);

  return { data: isLoading ? undefined : data, isLoading, error, refetch };
}

/**
 * Returns per-module efficiency computed from StudySession and UserModuleProgress data.
 */
export function useModuleEfficiency() {
  const { data: sessions = [], isLoading: sessionsLoading } = useListStudySessions();
  const { data: modules = [], isLoading: modulesLoading } = useModules();
  const { data: progressList = [], isLoading: progressLoading, error } = useQuery(
    listUserModuleProgressQueryOptions(),
  );

  const data = useMemo((): ModuleEfficiency[] => {
    const moduleMap = new Map(modules.map((m) => [m.id, m.title]));

    return progressList
      .map((progress) => {
        const title = moduleMap.get(progress.moduleId) ?? progress.moduleId;
        const moduleSessions = sessions.filter((s) => s.moduleId === progress.moduleId);
        const hoursSpent = Math.round(
          moduleSessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) / 60,
        );
        const expected = DEFAULT_EXPECTED_HOURS;
        const efficiency =
          hoursSpent > 0
            ? Math.min(100, Math.round((expected / hoursSpent) * 100))
            : 0;
        return { module: title, efficiency, hoursSpent, expected };
      })
      .filter((item) => item.hoursSpent > 0);
  }, [sessions, modules, progressList]);

  const isLoading = sessionsLoading || modulesLoading || progressLoading;

  return { data: isLoading ? undefined : data, isLoading, error };
}

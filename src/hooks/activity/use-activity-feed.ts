import { useQuery, queryOptions } from "@tanstack/react-query";
import { listStudySessions } from "@/api/study-session";
import { listQuizAttempts } from "@/api/quiz";
import { listUserModuleProgress } from "@/api/module-progress";
import { listAllUserContentProgress } from "@/api/user-content-progress";

export interface Activity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  xp: number;
}

const fetchActivityFeed = async (): Promise<Activity[]> => {
  const [sessions, quizAttempts, moduleProgress, contentProgress] =
    await Promise.all([
      listStudySessions(),
      listQuizAttempts(),
      listUserModuleProgress(),
      listAllUserContentProgress(),
    ]);

  const activities: Activity[] = [
    ...sessions.map((s) => ({
      id: s.id,
      type: "study_session",
      title: `Study session: ${s.type ?? "general"}`,
      timestamp: new Date(s.startedAt).toISOString(),
      xp: s.xpEarned ?? 0,
    })),
    ...quizAttempts.map((a) => ({
      id: a.id,
      type: "quiz_completed",
      title: `Quiz completed with score ${a.score}%`,
      timestamp: new Date(a.completedAt).toISOString(),
      xp: Math.round(a.score / 2),
    })),
    ...moduleProgress
      .filter((p) => p.completionDate != null)
      .map((p) => ({
        id: p.id,
        type: "module_completed",
        title: "Module completed",
        timestamp: new Date(p.completionDate!).toISOString(),
        xp: 75,
      })),
    ...contentProgress
      .filter((p) => p.isCompleted && p.completionDate != null)
      .map((p) => ({
        id: p.id,
        type: "task_completed",
        title: "Content completed",
        timestamp: new Date(p.completionDate!).toISOString(),
        xp: 20,
      })),
  ];

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
};

export const activityFeedQueryOptions = () =>
  queryOptions({
    queryKey: ["activity", "feed"],
    queryFn: async () => {
      try {
        return await fetchActivityFeed();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

/**
 * Hook that derives an activity feed from real study sessions, quiz attempts,
 * module completions, and content completions.
 */
export const useActivityFeed = () => useQuery(activityFeedQueryOptions());

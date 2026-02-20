import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTodayTasks } from "@/api/daily-task";

export const todayTasksQueryOptions = () =>
  queryOptions({
    queryKey: ["daily-tasks", "today"],
    queryFn: async () => {
      try {
        return await getTodayTasks();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useTodayTasks = () => useQuery(todayTasksQueryOptions());

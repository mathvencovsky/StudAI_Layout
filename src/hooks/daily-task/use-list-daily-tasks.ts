import { useQuery, queryOptions } from "@tanstack/react-query";
import { listDailyTasks } from "@/api/daily-task";

export const listDailyTasksQueryOptions = () =>
  queryOptions({
    queryKey: ["daily-tasks", "list"],
    queryFn: async () => {
      try {
        return await listDailyTasks();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListDailyTasks = () => useQuery(listDailyTasksQueryOptions());

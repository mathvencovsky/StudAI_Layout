import { useQuery, queryOptions } from "@tanstack/react-query";
import { listCourses } from "@/api/course";

export const listCoursesQueryOptions = () =>
  queryOptions({
    queryKey: ["courses", "list"],
    queryFn: async () => {
      try {
        return await listCourses();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListCourses = () => useQuery(listCoursesQueryOptions());

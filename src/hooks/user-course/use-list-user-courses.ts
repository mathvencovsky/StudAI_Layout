import { useQuery, queryOptions } from "@tanstack/react-query";
import { listUserCourses } from "@/api/user-course";

export const listUserCoursesQueryOptions = () =>
  queryOptions({
    queryKey: ["user-courses", "list"],
    queryFn: async () => {
      try {
        return await listUserCourses();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListUserCourses = () =>
  useQuery(listUserCoursesQueryOptions());

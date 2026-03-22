import { useQuery, queryOptions } from "@tanstack/react-query";
import { getCourse } from "@/api/course";
import type { CourseIdentifier } from "@/model/course";

export const courseQueryOptions = (identifier: CourseIdentifier) =>
  queryOptions({
    queryKey: ["courses", identifier],
    queryFn: async () => {
      try {
        return await getCourse(identifier);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useCourse = (identifier: CourseIdentifier) =>
  useQuery(courseQueryOptions(identifier));

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "@/api/course";
import type { CreateCourseInput } from "@/api/course";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCourseInput) => createCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

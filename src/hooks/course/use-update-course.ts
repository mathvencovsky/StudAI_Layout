import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/api/course";
import type { UpdateCourseInput } from "@/api/course";

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCourseInput) => updateCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

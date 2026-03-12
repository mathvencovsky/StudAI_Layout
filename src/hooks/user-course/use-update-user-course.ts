import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserCourse } from "@/api/user-course";
import type { UpdateUserCourseInput } from "@/api/user-course";

export const useUpdateUserCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserCourseInput) => updateUserCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-courses"] });
    },
  });
};

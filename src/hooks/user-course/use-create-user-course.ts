import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserCourse } from "@/api/user-course";
import type { CreateUserCourseInput } from "@/api/user-course";

export const useCreateUserCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserCourseInput) => createUserCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-courses"] });
    },
  });
};

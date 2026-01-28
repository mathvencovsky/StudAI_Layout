import {
  toggleContentCompletion,
  type ToggleContentCompletionInput,
} from "@/api/user-content-progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Mutation hook for toggling content completion status
 * Invalidates content progress queries on success
 */
export const useToggleContentCompletion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ToggleContentCompletionInput) =>
      toggleContentCompletion(data),
    onSuccess: (data) => {
      // Invalidate content progress queries to refresh data after toggling
      void qc.invalidateQueries({
        queryKey: ["userContentProgress", data.moduleId],
      });
    },
  });
};

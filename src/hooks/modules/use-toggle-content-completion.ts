import { toggleContentCompletion } from "@/api/user-content-progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Schema } from "../../../amplify/data/resource";

/**
 * Mutation hook for toggling content completion status
 * Invalidates content progress queries on success
 */
export const useToggleContentCompletion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      moduleId: string;
      contentId: string;
      isCompleted: boolean;
    }) => toggleContentCompletion(data),
    onSuccess: (data: Schema["UserContentProgress"]["type"]) => {
      void qc.invalidateQueries({
        queryKey: ["userContentProgress", data.moduleId],
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startModule } from "@/api/module-progress";
import { type UserModuleProgress } from "@/model/user-module-progress";

/**
 * Mutation hook for starting a module
 * Invalidates module progress queries on success
 */
export const useStartModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { moduleId: string }) => startModule(data),
    onSuccess: (data: UserModuleProgress) => {
      void qc.invalidateQueries({
        queryKey: ["userModuleProgress", data.moduleId],
      });
      void qc.invalidateQueries({
        queryKey: ["userContentProgress", data.moduleId],
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startModule } from "@/api/module-progress";
import type { StartModuleInput } from "@/api/module-progress";

/**
 * Mutation hook for starting a module
 * Invalidates module progress queries on success
 */
export const useStartModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StartModuleInput) => startModule(data),
    onSuccess: (data) => {
      // Invalidate module progress queries to refresh data after starting
      void qc.invalidateQueries({
        queryKey: ["userModuleProgress", data.moduleId],
      });
      void qc.invalidateQueries({
        queryKey: ["userContentProgress", data.moduleId],
      });
    },
  });
};

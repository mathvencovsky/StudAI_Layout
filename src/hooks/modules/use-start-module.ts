import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startModule } from "@/api/module-progress";
import { type Schema } from "../../../amplify/data/resource";

/**
 * Mutation hook for starting a module
 * Invalidates module progress queries on success
 */
export const useStartModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { moduleId: string }) => startModule(data),
    onSuccess: (data: Schema["UserModuleProgress"]["type"]) => {
      void qc.invalidateQueries({
        queryKey: ["userModuleProgress", data.moduleId],
      });
      void qc.invalidateQueries({
        queryKey: ["userContentProgress", data.moduleId],
      });
    },
  });
};

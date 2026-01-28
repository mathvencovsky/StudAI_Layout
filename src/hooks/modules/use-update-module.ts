import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModule } from "@/api/modules";
import type { UpdateModuleInput } from "@/api/modules";

export const useUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateModuleInput) => updateModule(data),
    onSuccess: (updatedModule) => {
      // Invalidate module lists to refresh data after update
      void qc.invalidateQueries({ queryKey: ["modules"] });
      // Invalidate specific module data if it exists
      void qc.invalidateQueries({ queryKey: ["module", updatedModule.id] });
      // Invalidate module contents as the content list may have changed
      void qc.invalidateQueries({
        queryKey: ["moduleContents", updatedModule.id],
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createModule } from "@/api/modules";
import type { CreateModuleInput } from "@/api/modules";

export const useCreateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateModuleInput) => createModule(data),
    onSuccess: () => {
      // Invalidate module lists to refresh data after creation
      void qc.invalidateQueries({ queryKey: ["modules"] });
    },
  });
};

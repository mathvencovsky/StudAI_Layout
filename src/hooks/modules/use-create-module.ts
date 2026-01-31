import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createModule } from "@/api/modules";

export const useCreateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      contentIds?: string[];
    }) => createModule(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["modules"] });
    },
  });
};

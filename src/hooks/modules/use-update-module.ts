import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModule } from "@/api/modules";
import { type Module } from "@/model/module";

export const useUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      title?: string;
      description?: string;
      contentIds?: string[];
    }) => updateModule(data),
    onSuccess: (updatedModule: Module) => {
      void qc.invalidateQueries({ queryKey: ["modules"] });
      void qc.invalidateQueries({ queryKey: ["module", updatedModule.id] });
      void qc.invalidateQueries({
        queryKey: ["moduleContents", updatedModule.id],
      });
    },
  });
};

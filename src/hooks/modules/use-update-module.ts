import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModule } from "@/api/modules";
import { type Schema } from "../../../amplify/data/resource";

export const useUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      title?: string;
      description?: string;
      contentIds?: string[];
    }) => updateModule(data),
    onSuccess: (updatedModule: Schema["Module"]["type"]) => {
      void qc.invalidateQueries({ queryKey: ["modules"] });
      void qc.invalidateQueries({ queryKey: ["module", updatedModule.id] });
      void qc.invalidateQueries({
        queryKey: ["moduleContents", updatedModule.id],
      });
    },
  });
};

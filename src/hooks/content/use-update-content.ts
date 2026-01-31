import { updateContent } from "@/api/content";
import { type Schema } from "../../../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Schema["Content"]["updateType"]) => updateContent(data),
    onSuccess: (updated: Schema["Content"]["type"]) => {
      void qc.invalidateQueries({ queryKey: ["content", "list"] });
      void qc.invalidateQueries({
        queryKey: ["content", "detail", updated.id],
      });
    },
  });
};

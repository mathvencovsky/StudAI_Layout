import { updateContent } from "@/api/content";
import { type Content, type ContentUpdateInput } from "@/model/content";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ContentUpdateInput) => updateContent(data),
    onSuccess: (updated: Content) => {
      void qc.invalidateQueries({ queryKey: ["content", "list"] });
      void qc.invalidateQueries({
        queryKey: ["content", "detail", updated.id],
      });
    },
  });
};

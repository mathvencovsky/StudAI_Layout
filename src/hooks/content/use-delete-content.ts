import { deleteContent } from "@/api/delete-content";
import { type Content, type ContentDeleteInput } from "@/model/content";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContentDeleteInput) => deleteContent(data),
    onSuccess: (_deleted: Content) => {
      void queryClient.invalidateQueries({ queryKey: ["content", "list"] });
    },
  });
};

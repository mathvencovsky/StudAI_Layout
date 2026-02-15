import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFavouriteContent,
  deleteFavouriteContent,
  getFavouriteContent,
} from "@/api/favourite-content";

export const useToggleFavouriteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      const existing = await getFavouriteContent(contentId);
      if (existing) {
        await deleteFavouriteContent({ id: existing.id });
        return null;
      }
      return createFavouriteContent({ contentId });
    },
    onSuccess: (_, contentId) => {
      queryClient.invalidateQueries({
        queryKey: ["favourite-content", contentId],
      });
      queryClient.invalidateQueries({ queryKey: ["favourite-contents"] });
    },
  });
};

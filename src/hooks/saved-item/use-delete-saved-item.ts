import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSavedItem } from "@/api/saved-item";
import { type SavedItemIdentifier } from "@/model/saved-item";

export const useDeleteSavedItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identifier: SavedItemIdentifier) => {
      return await deleteSavedItem(identifier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
    },
  });
};

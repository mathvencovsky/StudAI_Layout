import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSavedItem } from "@/api/saved-item";
import { type SavedItemCreateInput } from "@/model/saved-item";

export const useCreateSavedItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SavedItemCreateInput) => {
      return await createSavedItem(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
    },
  });
};

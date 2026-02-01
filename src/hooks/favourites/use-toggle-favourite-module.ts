import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFavouriteModule,
  deleteFavouriteModule,
  getFavouriteModule,
} from "@/api/favourite-module";

export const useToggleFavouriteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      const existing = await getFavouriteModule(moduleId);
      if (existing) {
        await deleteFavouriteModule({ id: existing.id });
        return null;
      }
      return createFavouriteModule({ moduleId });
    },
    onSuccess: (_, moduleId) => {
      queryClient.invalidateQueries({
        queryKey: ["favourite-module", moduleId],
      });
      queryClient.invalidateQueries({ queryKey: ["favourite-modules"] });
    },
  });
};

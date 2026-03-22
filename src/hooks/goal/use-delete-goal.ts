import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGoal } from "@/api/goal";
import type { Schema } from "../../../amplify/data/resource";

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identifier: Schema["Goal"]["identifier"]) => {
      return await deleteGoal(identifier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
};

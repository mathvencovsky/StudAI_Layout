import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeatureToggle } from "@/api/feature-toggle";
import { type FeatureToggleUpdateInput } from "@/model/feature-toggle";

export const useUpdateFeatureToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FeatureToggleUpdateInput) => {
      return await updateFeatureToggle(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-toggles"] });
    },
  });
};

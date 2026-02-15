import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLearningPreference,
  updateLearningPreference,
} from "@/api/learning-preference";
import { type LearningPreferenceCreateInput } from "@/model/learning-preference";

export const useSaveLearningPreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id?: string;
      data: LearningPreferenceCreateInput;
    }) => {
      if (params.id) {
        return updateLearningPreference({
          ...params.data,
          id: params.id,
        });
      }
      return createLearningPreference(params.data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["learning-preference"] });
    },
  });
};

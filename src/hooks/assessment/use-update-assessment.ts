import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssessment } from "@/api/assessment";
import { type AssessmentUpdateInput } from "@/model/assessment";

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AssessmentUpdateInput) => {
      return await updateAssessment(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
};

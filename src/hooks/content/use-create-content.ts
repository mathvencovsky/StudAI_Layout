import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContent } from "@/api/content";
import type { CreateContentInput } from "@/api/content";

export const useCreateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentInput) => createContent(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["content", "list"] });
    },
  });
};

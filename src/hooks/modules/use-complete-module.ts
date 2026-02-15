import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeModule, uncompleteModule } from "@/api/module-progress";

/**
 * Mutation hook for marking a module as completed
 */
export const useCompleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) => completeModule(moduleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userModuleProgress", data.moduleId],
      });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

/**
 * Mutation hook for marking a module as incomplete
 */
export const useUncompleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) => uncompleteModule(moduleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userModuleProgress", data.moduleId],
      });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

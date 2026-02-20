import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import {
  getFeatureTogglesStub,
  updateFeatureToggleStub,
  FeatureToggle,
} from "@/api/stubs/admin-stub";

export function useFeatureToggles() {
  return useQuery({
    queryKey: queryKeys.admin.features,
    queryFn: getFeatureTogglesStub,
    staleTime: 60000, // 1 minuto
  });
}

export function useUpdateFeatureToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      updateFeatureToggleStub(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.features });
    },
  });
}

export type { FeatureToggle };

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavedItemsStub } from "@/api/stubs/saved-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useSavedItems() {
  return useQuery({
    queryKey: [QUERY_KEYS.SAVED],
    queryFn: getSavedItemsStub,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRemoveSavedItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      // TODO: Implement real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED] });
    },
  });
}

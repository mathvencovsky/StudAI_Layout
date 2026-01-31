import { getModuleSuggestions } from "@/api/modules";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getModuleSuggestionsQueryOptions = (q: string) =>
  queryOptions<string[]>({
    queryKey: ["moduleSuggestions", q],
    queryFn: () => getModuleSuggestions(q),
    enabled: q.trim().length > 0,
    staleTime: 30_000,
  });

export const useModuleSuggestions = (q: string) =>
  useQuery(getModuleSuggestionsQueryOptions(q));

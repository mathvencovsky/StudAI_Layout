import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { searchContentStub, SearchResult } from "@/api/stubs/search-stub";

export function useSearch(query: string, filters?: { type?: string }) {
  return useQuery({
    queryKey: queryKeys.search.results(query, filters),
    queryFn: () => searchContentStub(query, filters),
    enabled: query.length >= 3, // Só busca com 3+ caracteres
    staleTime: 30000, // 30 segundos
  });
}

export type { SearchResult };

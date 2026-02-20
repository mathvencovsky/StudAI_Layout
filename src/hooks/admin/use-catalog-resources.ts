import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import {
  getCatalogResourcesStub,
  CatalogResource,
} from "@/api/stubs/admin-stub";

export function useCatalogResources(filters?: {
  type?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: [...queryKeys.admin.catalog, filters],
    queryFn: () => getCatalogResourcesStub(filters),
    staleTime: 60000, // 1 minuto
  });
}

export type { CatalogResource };

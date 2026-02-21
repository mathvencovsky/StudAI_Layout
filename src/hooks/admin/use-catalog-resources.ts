import { useMemo } from "react";
import { useTracks } from "@/hooks/track/use-tracks";
import { useListContent } from "@/hooks/content/use-list-content";
import { useModules } from "@/hooks/modules/use-modules";

export interface CatalogResource {
  id: string;
  type: "track" | "module" | "content";
  title: string;
  category: string;
  status: "published" | "draft";
  createdAt: string;
}

/**
 * Hook to list catalog resources (tracks, modules, content) for the admin panel.
 */
export function useCatalogResources(filters?: {
  type?: string;
  search?: string;
}) {
  const {
    data: tracks = [],
    isLoading: tracksLoading,
    error: tracksError,
    refetch: refetchTracks,
  } = useTracks();
  const {
    data: contents = [],
    isLoading: contentsLoading,
    error: contentsError,
    refetch: refetchContents,
  } = useListContent();
  const {
    data: modules = [],
    isLoading: modulesLoading,
    error: modulesError,
    refetch: refetchModules,
  } = useModules();

  const isLoading = tracksLoading || contentsLoading || modulesLoading;
  const error = tracksError ?? contentsError ?? modulesError;

  const data = useMemo(() => {
    const typeFilter = filters?.type;
    const searchFilter = filters?.search?.toLowerCase();

    const allResources: CatalogResource[] = [
      ...tracks.map((track) => ({
        id: track.id,
        type: "track" as const,
        title: track.title,
        category: "",
        status: "published" as const,
        createdAt: track.createdAt ?? new Date().toISOString(),
      })),
      ...contents.map((content) => ({
        id: content.id,
        type: "content" as const,
        title: content.title,
        category: content.category,
        status: "published" as const,
        createdAt: content.createdAt ?? new Date().toISOString(),
      })),
      ...modules.map((module) => ({
        id: module.id,
        type: "module" as const,
        title: module.title,
        category: "",
        status: "published" as const,
        createdAt: module.createdAt ?? new Date().toISOString(),
      })),
    ];

    return allResources.filter((resource) => {
      if (typeFilter && typeFilter !== "all" && resource.type !== typeFilter)
        return false;
      if (
        searchFilter &&
        !resource.title.toLowerCase().includes(searchFilter)
      )
        return false;
      return true;
    });
  }, [tracks, contents, modules, filters?.type, filters?.search]);

  const refetch = () => {
    void refetchTracks();
    void refetchContents();
    void refetchModules();
  };

  return { data, isLoading, error, refetch };
}

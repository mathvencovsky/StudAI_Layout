import { useMemo } from "react";
import { useTracks } from "@/hooks/track/use-tracks";
import { useListContent } from "@/hooks/content/use-list-content";
import { useListAssessments } from "@/hooks/assessment/use-list-assessments";

export interface SearchResult {
  id: string;
  type: "track" | "content" | "assessment";
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
}

/**
 * Client-side search hook that fetches Track, Content, and Assessment data
 * and filters locally by query string and type filter.
 */
export function useSearch(query: string, filters?: { type?: string }) {
  const { data: tracks = [], isLoading: tracksLoading } = useTracks();
  const { data: contents = [], isLoading: contentsLoading } = useListContent();
  const { data: assessments = [], isLoading: assessmentsLoading } =
    useListAssessments();

  const isLoading = tracksLoading || contentsLoading || assessmentsLoading;

  const data = useMemo(() => {
    if (query.length < 3) return [];

    const lowerQuery = query.toLowerCase();
    const typeFilter = filters?.type;

    const allResults: SearchResult[] = [
      ...tracks.map((track) => ({
        id: track.id,
        type: "track" as const,
        title: track.title,
        description: track.description,
        tags: [],
      })),
      ...contents.map((content) => ({
        id: content.id,
        type: "content" as const,
        title: content.title,
        description: content.description,
        thumbnail: content.thumbnailUrl ?? undefined,
        tags: content.category ? [content.category] : [],
      })),
      ...assessments.map((assessment) => ({
        id: assessment.id,
        type: "assessment" as const,
        title: assessment.title,
        description: assessment.description ?? "",
        tags: [],
      })),
    ];

    return allResults.filter((result) => {
      if (typeFilter && typeFilter !== "all" && result.type !== typeFilter)
        return false;
      return (
        result.title.toLowerCase().includes(lowerQuery) ||
        result.description.toLowerCase().includes(lowerQuery) ||
        result.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }, [query, filters?.type, tracks, contents, assessments]);

  return { data, isLoading };
}

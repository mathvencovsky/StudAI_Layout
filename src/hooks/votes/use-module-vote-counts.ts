import { useModule } from "@/hooks/modules/use-module";
import { type Schema } from "../../../amplify/data/resource";

/**
 * Hook to fetch vote counts for a module
 * Returns only the upvoteCount and downvoteCount properties from the module
 */
export function useModuleVoteCounts(moduleId: string) {
  const { data: module, ...rest } = useModule(moduleId);

  const voteCounts:
    | Pick<Schema["Module"]["type"], "upvoteCount" | "downvoteCount">
    | undefined = module
    ? {
        upvoteCount: module.upvoteCount,
        downvoteCount: module.downvoteCount,
      }
    : undefined;

  return {
    data: voteCounts,
    ...rest,
  };
}

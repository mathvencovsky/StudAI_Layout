import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vote, clearVote } from "@/api/votes";
import { type UserVoteState } from "@/model/vote";
import { getUserVoteQueryOptions } from "@/hooks/votes/use-get-user-vote";

interface VoteMutationParams {
  moduleId: string;
  uid: string;
  currentVoteState: UserVoteState;
  voteValue: 1 | -1;
}

/**
 * Handles vote mutations (upvote, downvote, and vote removal)
 */
async function handleVoteMutation(params: VoteMutationParams): Promise<void> {
  const { moduleId, currentVoteState, voteValue } = params;

  if (currentVoteState === voteValue) {
    await clearVote(moduleId);
  } else {
    await vote(moduleId, voteValue);
  }
}

/**
 * Hook for vote mutations with optimistic updates
 */
export function useVoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleVoteMutation,
    onMutate: async (params) => {
      const { moduleId, uid, currentVoteState, voteValue } = params;

      const getUserVoteQueryKey = getUserVoteQueryOptions(
        moduleId,
        uid,
      ).queryKey;

      await queryClient.cancelQueries({
        queryKey: getUserVoteQueryKey,
      });

      const previousVoteState =
        queryClient.getQueryData<UserVoteState>(getUserVoteQueryKey);

      const newVoteState = currentVoteState === voteValue ? null : voteValue;

      queryClient.setQueryData(getUserVoteQueryKey, newVoteState);

      return { previousVoteState };
    },
    onError: (_, params, context) => {
      if (context?.previousVoteState !== undefined) {
        const getUserVoteQueryKey = getUserVoteQueryOptions(
          params.moduleId,
          params.uid,
        ).queryKey;

        queryClient.setQueryData(
          getUserVoteQueryKey,
          context.previousVoteState,
        );
      }
    },
    onSuccess: (_, params) => {
      const getUserVoteQueryKey = getUserVoteQueryOptions(
        params.moduleId,
        params.uid,
      ).queryKey;

      queryClient.invalidateQueries({
        queryKey: getUserVoteQueryKey,
      });
    },
  });
}

import { useAuth } from "@/hooks/use-auth";
import { useGetUserVote } from "@/hooks/votes/use-get-user-vote";
import { useModuleVoteCounts } from "@/hooks/votes/use-module-vote-counts";
import { useVoteMutation } from "@/hooks/votes/use-vote-mutation";
import { VoteButtons } from "./vote-buttons";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface VoteButtonsContainerProps {
  moduleId: string;
}

/**
 * Container component for vote buttons
 * Manages voting logic, fetches user vote state and module counts, handles mutations
 */
export const VoteButtonsContainer = ({
  moduleId,
}: VoteButtonsContainerProps) => {
  const { user } = useAuth();
  const voteMutation = useVoteMutation();

  const { data: userVoteState, isLoading: isLoadingUserVote } = useGetUserVote(
    moduleId,
    user?.id ?? ""
  );

  const { data: voteCounts, isLoading: isLoadingCounts } =
    useModuleVoteCounts(moduleId);

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please log in to vote on modules.</AlertDescription>
      </Alert>
    );
  }

  const handleUpvote = () => {
    voteMutation.mutate({
      moduleId,
      uid: user.id,
      currentVoteState: userVoteState ?? null,
      voteValue: 1,
    });
  };

  const handleDownvote = () => {
    voteMutation.mutate({
      moduleId,
      uid: user.id,
      currentVoteState: userVoteState ?? null,
      voteValue: -1,
    });
  };

  const isLoading =
    isLoadingUserVote || isLoadingCounts || voteMutation.isPending;

  return (
    <VoteButtons
      upvoteCount={voteCounts?.upvoteCount}
      downvoteCount={voteCounts?.downvoteCount}
      userVoteState={userVoteState ?? null}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      isLoading={isLoading}
    />
  );
};

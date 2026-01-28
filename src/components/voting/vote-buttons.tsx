import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { type UserVoteState } from "@/model/vote";

export interface VoteButtonsProps {
  upvoteCount?: number;
  downvoteCount?: number;
  userVoteState: UserVoteState;
  onUpvote: () => void;
  onDownvote: () => void;
  isLoading?: boolean;
}

/**
 * Presentational component for vote buttons
 * Displays upvote and downvote buttons with counts and visual indication of current vote state
 */
export const VoteButtons = ({
  upvoteCount,
  downvoteCount,
  userVoteState,
  onUpvote,
  onDownvote,
  isLoading = false,
}: VoteButtonsProps) => {
  const isUpvoted = userVoteState === 1;
  const isDownvoted = userVoteState === -1;
  const shouldShowCount =
    upvoteCount !== undefined && downvoteCount !== undefined;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isUpvoted ? "default" : "outline"}
        size="sm"
        onClick={onUpvote}
        disabled={isLoading}
        className="gap-1"
      >
        <ThumbsUp className="h-4 w-4" />
        {shouldShowCount ? <span>{upvoteCount + downvoteCount}</span> : null}
      </Button>

      <Button
        variant={isDownvoted ? "default" : "outline"}
        size="sm"
        onClick={onDownvote}
        disabled={isLoading}
        className="gap-1"
      >
        <ThumbsDown className="h-4 w-4" />
        {shouldShowCount ? <span>{downvoteCount}</span> : null}
      </Button>
    </div>
  );
};

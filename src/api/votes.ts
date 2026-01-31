import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

export type UserVoteState = 1 | -1 | null;

/**
 * Fetches the current user's vote state for a module
 */
export const getUserVote = async (moduleId: string): Promise<UserVoteState> => {
  await getCurrentUserId();

  const result = await client.models.Vote.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!result.data || result.data.length === 0) {
    return null;
  }

  const vote = result.data[0];
  return vote.value as UserVoteState;
};

/**
 * Records or updates a user's vote on a module
 * @param moduleId - The ID of the module being voted on
 * @param value - The vote value: 1 for upvote, -1 for downvote
 */
export const vote = async (moduleId: string, value: 1 | -1): Promise<void> => {
  await getCurrentUserId();

  const existingResult = await client.models.Vote.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (existingResult.data && existingResult.data.length > 0) {
    const existing = existingResult.data[0];
    const updateInput: Schema["Vote"]["updateType"] = {
      id: existing.id,
      value,
      updatedAt: Date.now(),
    };

    const result = await client.models.Vote.update(updateInput);

    if (!result.data) {
      console.error("Failed to update vote:", result.errors);
      throw new Error("Failed to update vote");
    }
  } else {
    const createInput: Schema["Vote"]["createType"] = {
      moduleId,
      value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await client.models.Vote.create(createInput);

    if (!result.data) {
      console.error("Failed to create vote:", result.errors);
      throw new Error("Failed to create vote");
    }
  }

  await updateModuleVoteCounts(moduleId);
};

/**
 * Removes a user's vote from a module
 * @param moduleId - The ID of the module
 */
export const clearVote = async (moduleId: string): Promise<void> => {
  await getCurrentUserId();

  const existingResult = await client.models.Vote.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (existingResult.data && existingResult.data.length > 0) {
    const existing = existingResult.data[0];
    const deleteInput: Schema["Vote"]["deleteType"] = { id: existing.id };

    const result = await client.models.Vote.delete(deleteInput);

    if (!result.data) {
      console.error("Failed to delete vote:", result.errors);
      throw new Error("Failed to delete vote");
    }

    await updateModuleVoteCounts(moduleId);
  }
};

/**
 * Updates the vote counts for a module based on all votes
 * @param moduleId - The ID of the module to update counts for
 */
const updateModuleVoteCounts = async (moduleId: string): Promise<void> => {
  const votesResult = await client.models.Vote.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!votesResult.data) {
    console.error("Failed to get votes for count update:", votesResult.errors);
    return;
  }

  let upvoteCount = 0;
  let downvoteCount = 0;

  votesResult.data.forEach((vote) => {
    if (vote.value === 1) {
      upvoteCount++;
    } else if (vote.value === -1) {
      downvoteCount++;
    }
  });

  const updateInput: Schema["Module"]["updateType"] = {
    id: moduleId,
    upvoteCount,
    downvoteCount,
    updatedAt: Date.now(),
  };

  const result = await client.models.Module.update(updateInput);

  if (!result.data) {
    console.error("Failed to update module vote counts:", result.errors);
  }
};

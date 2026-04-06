import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type UserTrackProgress,
  type UserTrackProgressCreateInput,
} from "@/model/user-track-progress";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

/**
 * Start a track for the current user
 * Returns existing progress if already started, creates new if not
 * Uses get-or-create pattern with error handling for race conditions
 */
export const startTrack = async (input: {
  trackId: string;
}): Promise<UserTrackProgress> => {
  await getCurrentUserId();

  const existing = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: input.trackId } },
  });

  if (existing.data && existing.data.length > 0) {
    return existing.data[0];
  }

  const createInput: UserTrackProgressCreateInput = {
    trackId: input.trackId,
    startDate: Date.now(),
  };

  const result = await client.models.UserTrackProgress.create(createInput);

  if (!result.data) {
    const retryExisting = await client.models.UserTrackProgress.list({
      filter: { trackId: { eq: input.trackId } },
    });

    if (retryExisting.data && retryExisting.data.length > 0) {
      return retryExisting.data[0];
    }

    console.error("Failed to start track:", result.errors);
    throw new Error("Failed to start track");
  }

  return result.data;
};

/**
 * Get the current user's progress for a specific track
 */
export const getUserTrackProgress = async (
  trackId: string,
): Promise<UserTrackProgress | null> => {
  await getCurrentUserId();

  const result = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: trackId } },
  });

  if (!result.data || result.data.length === 0) {
    return null;
  }

  return result.data[0];
};

/**
 * Get the current user's most recently started incomplete track
 */
export const getLastStartedIncompleteTrack =
  async (): Promise<UserTrackProgress | null> => {
    await getCurrentUserId();

    const result = await client.models.UserTrackProgress.list();

    if (!result.data || result.data.length === 0) {
      return null;
    }

    const incompleteTracks = result.data.filter((p) => !p.completionDate);

    if (incompleteTracks.length === 0) {
      return null;
    }

    const sortedProgress = incompleteTracks.sort(
      (a, b) => b.startDate - a.startDate,
    );

    return sortedProgress[0];
  };

/**
 * Mark a track as completed for the current user
 */
export const completeTrack = async (
  trackId: string,
): Promise<UserTrackProgress> => {
  await getCurrentUserId();

  const result = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: trackId } },
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("Track progress not found");
  }

  const updateResult = await client.models.UserTrackProgress.update({
    id: result.data[0].id,
    completionDate: Date.now(),
  });

  if (!updateResult.data) {
    console.error("Failed to complete track:", updateResult.errors);
    throw new Error("Failed to complete track");
  }

  return updateResult.data;
};

/**
 * Mark a track as incomplete for the current user
 */
export const uncompleteTrack = async (
  trackId: string,
): Promise<UserTrackProgress> => {
  await getCurrentUserId();

  const result = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: trackId } },
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("Track progress not found");
  }

  const updateResult = await client.models.UserTrackProgress.update({
    id: result.data[0].id,
    completionDate: null,
  });

  if (!updateResult.data) {
    console.error("Failed to uncomplete track:", updateResult.errors);
    throw new Error("Failed to uncomplete track");
  }

  return updateResult.data;
};

/**
 * List all track progress records for the current user
 */
export const listUserTrackProgress = async (): Promise<UserTrackProgress[]> => {
  if (!client.models.UserTrackProgress) return [];
  const result = await client.models.UserTrackProgress.list();
  if (!result.data) {
    console.error("Failed to list user track progress:", result.errors);
    return [];
  }
  return result.data;
};

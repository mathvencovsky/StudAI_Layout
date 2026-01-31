import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type Track,
  type TrackIdentifier,
  type TrackCreateInput,
  type TrackUpdateInput,
  type TrackFull,
  trackSelectionSet,
} from "@/model/track";

const client = generateClient<Schema>();

/**
 * Get all tracks
 */
export const getTracks = async (): Promise<Track[]> => {
  const result = await client.models.Track.list();
  if (!result.data) return [];
  return result.data;
};

/**
 * Get a track by ID
 */
export const getTrack = async (
  identifier: TrackIdentifier,
): Promise<TrackFull | null> => {
  const result = await client.models.Track.get(identifier, {
    selectionSet: trackSelectionSet,
  });
  if (!result.data) return null;
  return result.data;
};

/**
 * Create a new track
 */
export const createTrack = async (input: TrackCreateInput): Promise<Track> => {
  const result = await client.models.Track.create(input);
  if (!result.data) throw new Error("Failed to create track");
  return result.data;
};

/**
 * Update a track
 */
export const updateTrack = async (input: TrackUpdateInput): Promise<Track> => {
  const result = await client.models.Track.update(input);
  if (!result.data) throw new Error("Failed to update track");
  return result.data;
};

/**
 * Delete a track
 */
export const deleteTrack = async (
  identifier: TrackIdentifier,
): Promise<void> => {
  const result = await client.models.Track.delete(identifier);
  if (!result.data) throw new Error("Failed to delete track");
};

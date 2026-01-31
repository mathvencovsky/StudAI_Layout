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

const parseJsonField = (value: unknown): Record<string, string> => {
  if (!value) return {};
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (typeof parsed !== "object") return {};
  return parsed as Record<string, string>;
};

/**
 * Get all tracks
 */
export const getTracks = async (): Promise<Track[]> => {
  const result = await client.models.Track.list();
  if (!result.data) return [];
  return result.data.map((track) => ({
    ...track,
    parentByModuleId: parseJsonField(track.parentByModuleId),
    positionByModuleId: parseJsonField(track.positionByModuleId),
  }));
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
  return {
    ...result.data,
    parentByModuleId: parseJsonField(result.data.parentByModuleId),
    positionByModuleId: parseJsonField(result.data.positionByModuleId),
  };
};

/**
 * Create a new track
 */
export const createTrack = async (input: TrackCreateInput): Promise<Track> => {
  const result = await client.models.Track.create({
    ...input,
    parentByModuleId: JSON.stringify(input.parentByModuleId),
    positionByModuleId: JSON.stringify(input.positionByModuleId),
  });
  if (!result.data) throw new Error("Failed to create track");
  return result.data;
};

/**
 * Update a track
 */
export const updateTrack = async (input: TrackUpdateInput): Promise<Track> => {
  const result = await client.models.Track.update({
    ...input,
    parentByModuleId: JSON.stringify(input.parentByModuleId),
    positionByModuleId: JSON.stringify(input.positionByModuleId),
  });
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

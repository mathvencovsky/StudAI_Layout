import { type SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export type Track = Schema["Track"]["type"];
export type TrackIdentifier = Schema["Track"]["identifier"];
export type TrackCreateInput = Schema["Track"]["createType"];
export type TrackUpdateInput = Schema["Track"]["updateType"];
export type TrackDeleteInput = Schema["Track"]["deleteType"];

export const trackSelectionSet = [
  "id",
  "title",
  "description",
  "rootModuleId",
  "parentByModuleId",
  "positionByModuleId",
  "categories",
  "createdAt",
  "updatedAt",
] as const;

export type TrackFull = SelectionSet<Track, typeof trackSelectionSet>;

import { type SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export type UserContentProgress = Schema["UserContentProgress"]["type"];
export type UserContentProgressIdentifier =
  Schema["UserContentProgress"]["identifier"];
export type UserContentProgressCreateInput =
  Schema["UserContentProgress"]["createType"];
export type UserContentProgressUpdateInput =
  Schema["UserContentProgress"]["updateType"];
export type UserContentProgressDeleteInput =
  Schema["UserContentProgress"]["deleteType"];

export const progressWithContentSelectionSet = [
  "id",
  "contentId",
  "isCompleted",
  "completionDate",
  "content.durationInSeconds",
  "content.type",
] as const;

export type UserContentProgressWithContent = SelectionSet<
  UserContentProgress,
  typeof progressWithContentSelectionSet
>;

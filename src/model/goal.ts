import { type Schema } from "../../amplify/data/resource";

export type Goal = Schema["Goal"]["type"];
export type GoalIdentifier = Schema["Goal"]["identifier"];
export type GoalCreateInput = Schema["Goal"]["createType"];
export type GoalUpdateInput = Schema["Goal"]["updateType"];
export type GoalDeleteInput = Schema["Goal"]["deleteType"];
export type GoalStatus = NonNullable<Goal["status"]>;

export const GOAL_STATUSES: GoalStatus[] = [
  "active",
  "completed",
  "paused",
  "cancelled",
];

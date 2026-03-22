import { type Schema } from "../../amplify/data/resource";

export type DailyTask = Schema["DailyTask"]["type"];
export type DailyTaskIdentifier = Schema["DailyTask"]["identifier"];
export type DailyTaskCreateInput = Schema["DailyTask"]["createType"];
export type DailyTaskUpdateInput = Schema["DailyTask"]["updateType"];
export type DailyTaskDeleteInput = Schema["DailyTask"]["deleteType"];
export type DailyTaskType = NonNullable<DailyTask["taskType"]>;

export const DAILY_TASK_TYPES: DailyTaskType[] = [
  "reading",
  "practice",
  "quiz",
  "summary",
];

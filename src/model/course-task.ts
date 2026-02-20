import { type Schema } from "../../amplify/data/resource";

export type CourseTask = Schema["CourseTask"]["type"];
export type CourseTaskIdentifier = Schema["CourseTask"]["identifier"];
export type CourseTaskCreateInput = Schema["CourseTask"]["createType"];
export type CourseTaskUpdateInput = Schema["CourseTask"]["updateType"];
export type CourseTaskDeleteInput = Schema["CourseTask"]["deleteType"];
export type CourseTaskType = NonNullable<CourseTask["type"]>;

export const COURSE_TASK_TYPES: CourseTaskType[] = [
  "practice",
  "reading",
  "project",
  "quiz",
  "review",
];

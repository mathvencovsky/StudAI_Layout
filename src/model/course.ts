import { type Schema } from "../../amplify/data/resource";

export type Course = Schema["Course"]["type"];
export type CourseIdentifier = Schema["Course"]["identifier"];
export type CourseCreateInput = Schema["Course"]["createType"];
export type CourseUpdateInput = Schema["Course"]["updateType"];
export type CourseDeleteInput = Schema["Course"]["deleteType"];
export type CourseLevel = NonNullable<Course["level"]>;
export type CourseStatus = NonNullable<Course["status"]>;

export const COURSE_LEVELS: CourseLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];
export const COURSE_STATUSES: CourseStatus[] = ["draft", "published", "archived"];

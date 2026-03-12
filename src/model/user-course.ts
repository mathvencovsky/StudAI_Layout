import { type Schema } from "../../amplify/data/resource";

export type UserCourse = Schema["UserCourse"]["type"];
export type UserCourseIdentifier = Schema["UserCourse"]["identifier"];
export type UserCourseCreateInput = Schema["UserCourse"]["createType"];
export type UserCourseUpdateInput = Schema["UserCourse"]["updateType"];
export type UserCourseDeleteInput = Schema["UserCourse"]["deleteType"];
export type UserCourseStatus = NonNullable<UserCourse["status"]>;

export const USER_COURSE_STATUSES: UserCourseStatus[] = [
  "not_started",
  "in_progress",
  "completed",
  "paused",
];

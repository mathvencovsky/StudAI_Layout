import { type Schema } from "../../amplify/data/resource";

export type UserPlan = Schema["UserPlan"]["type"];
export type UserPlanIdentifier = Schema["UserPlan"]["identifier"];
export type UserPlanCreateInput = Schema["UserPlan"]["createType"];
export type UserPlanUpdateInput = Schema["UserPlan"]["updateType"];
export type UserPlanDeleteInput = Schema["UserPlan"]["deleteType"];

export interface ModuleProgress {
  moduleId: string;
  hoursCompleted: number;
  hoursEstimated: number;
}

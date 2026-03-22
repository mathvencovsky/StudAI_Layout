import { type Schema } from "../../amplify/data/resource";

export type Assessment = Schema["Assessment"]["type"];
export type AssessmentIdentifier = Schema["Assessment"]["identifier"];
export type AssessmentCreateInput = Schema["Assessment"]["createType"];
export type AssessmentUpdateInput = Schema["Assessment"]["updateType"];
export type AssessmentDeleteInput = Schema["Assessment"]["deleteType"];

import { type Schema } from "../../amplify/data/resource";

export type Feedback = Schema["Feedback"]["type"];
export type FeedbackIdentifier = Schema["Feedback"]["identifier"];
export type FeedbackCreateInput = Schema["Feedback"]["createType"];
export type FeedbackUpdateInput = Schema["Feedback"]["updateType"];
export type FeedbackDeleteInput = Schema["Feedback"]["deleteType"];

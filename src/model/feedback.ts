import { type Schema } from "../../amplify/data/resource";

export type FeedbackInput = {
  rating: number;
  comment?: string | null;
};

export type Feedback = Schema["Feedback"]["type"];
export type FeedbackCreateInput = Schema["Feedback"]["createType"];

import { type Schema } from "../../amplify/data/resource";

export type ReviewItem = Schema["ReviewItem"]["type"];
export type ReviewItemIdentifier = Schema["ReviewItem"]["identifier"];
export type ReviewItemCreateInput = Schema["ReviewItem"]["createType"];
export type ReviewItemUpdateInput = Schema["ReviewItem"]["updateType"];
export type ReviewItemDeleteInput = Schema["ReviewItem"]["deleteType"];
export type ReviewPriority = NonNullable<ReviewItem["priority"]>;

export const REVIEW_PRIORITIES: ReviewPriority[] = ["low", "medium", "high"];

import { type Schema } from "../../amplify/data/resource";

export type Content = Schema["Content"]["type"];
export type ContentCreateInput = Schema["Content"]["createType"];
export type ContentUpdateInput = Schema["Content"]["updateType"];
export type ContentType = NonNullable<Content["type"]>;
export type ContentLevel = NonNullable<Content["level"]>;

export const CONTENT_TYPES: ContentType[] = [
  "youtube_video",
  "article",
  "quiz",
  "assignment",
  "lab",
];

export const CONTENT_LEVELS: ContentLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

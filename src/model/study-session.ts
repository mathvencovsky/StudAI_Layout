import { type Schema } from "../../amplify/data/resource";

export type StudySession = Schema["StudySession"]["type"];
export type StudySessionIdentifier = Schema["StudySession"]["identifier"];
export type StudySessionCreateInput = Schema["StudySession"]["createType"];
export type StudySessionUpdateInput = Schema["StudySession"]["updateType"];
export type StudySessionDeleteInput = Schema["StudySession"]["deleteType"];
export type StudySessionType = NonNullable<StudySession["type"]>;

export const STUDY_SESSION_TYPES: StudySessionType[] = [
  "ai_session",
  "quiz",
  "review",
  "reading",
  "practice",
];

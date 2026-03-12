import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateStudySessionInput = Schema["StudySession"]["createType"];
export type UpdateStudySessionInput = Schema["StudySession"]["updateType"];

/**
 * List user's study sessions
 */
export const listStudySessions = async (): Promise<Schema["StudySession"]["type"][]> => {
  const result = await client.models.StudySession.list();
  if (!result.data) {
    console.error("Failed to list study sessions:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get study session by ID
 */
export const getStudySession = async (
  identifier: Schema["StudySession"]["identifier"],
): Promise<Schema["StudySession"]["type"] | null> => {
  const result = await client.models.StudySession.get(identifier);
  if (!result.data) {
    console.error("Failed to get study session:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create study session
 */
export const createStudySession = async (
  input: CreateStudySessionInput,
): Promise<Schema["StudySession"]["type"]> => {
  const result = await client.models.StudySession.create(input);

  if (!result.data) {
    console.error("Failed to create study session:", result.errors);
    throw new Error("Failed to create study session");
  }

  return result.data;
};

/**
 * Update study session
 */
export const updateStudySession = async (
  input: UpdateStudySessionInput,
): Promise<Schema["StudySession"]["type"]> => {
  const result = await client.models.StudySession.update(input);

  if (!result.data) {
    console.error("Failed to update study session:", result.errors);
    throw new Error("Failed to update study session");
  }

  return result.data;
};

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * List user's assessments
 */
export const listAssessments = async (): Promise<Schema["Assessment"]["type"][]> => {
  const result = await client.models.Assessment.list();
  if (!result.data) {
    console.error("Failed to list assessments:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Create assessment
 */
export const createAssessment = async (
  input: Schema["Assessment"]["createType"],
): Promise<Schema["Assessment"]["type"]> => {
  const result = await client.models.Assessment.create(input);
  if (!result.data) {
    console.error("Failed to create assessment:", result.errors);
    throw new Error("Failed to create assessment");
  }
  return result.data;
};

/**
 * Update assessment
 */
export const updateAssessment = async (
  input: Schema["Assessment"]["updateType"],
): Promise<Schema["Assessment"]["type"]> => {
  const result = await client.models.Assessment.update(input);
  if (!result.data) {
    console.error("Failed to update assessment:", result.errors);
    throw new Error("Failed to update assessment");
  }
  return result.data;
};

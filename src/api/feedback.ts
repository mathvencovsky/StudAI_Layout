import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateFeedbackInput = Schema["Feedback"]["createType"];

/**
 * Creates a new feedback entry
 */
export const createFeedback = async (
  feedback: CreateFeedbackInput,
): Promise<Schema["Feedback"]["type"]> => {
  const result = await client.models.Feedback.create(feedback);

  if (!result.data) {
    console.error("Failed to create feedback:", result.errors);
    throw new Error("Failed to create feedback");
  }

  return result.data;
};

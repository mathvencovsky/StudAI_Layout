import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateFeedbackInput = Omit<
  Schema["Feedback"]["createType"],
  "createdAt" | "updatedAt"
>;

/**
 * Creates a new feedback document in Amplify with URL, rating, comment, and timestamp.
 */
export const createFeedback = async (
  feedback: CreateFeedbackInput,
): Promise<Schema["Feedback"]["type"]> => {
  const now = Date.now();
  const result = await client.models.Feedback.create({
    ...feedback,
    createdAt: now,
    updatedAt: now,
  });

  if (!result.data) {
    console.error("Failed to create feedback:", result.errors);
    throw new Error("Failed to create feedback");
  }

  return result.data;
};

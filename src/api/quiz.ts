import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateQuizInput = Schema["Quiz"]["createType"];
export type CreateQuizAttemptInput = Schema["QuizAttempt"]["createType"];

/**
 * List all quizzes
 */
export const listQuizzes = async (): Promise<Schema["Quiz"]["type"][]> => {
  const result = await client.models.Quiz.list();
  if (!result.data) {
    console.error("Failed to list quizzes:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get quiz by ID
 */
export const getQuiz = async (
  identifier: Schema["Quiz"]["identifier"],
): Promise<Schema["Quiz"]["type"] | null> => {
  const result = await client.models.Quiz.get(identifier);
  if (!result.data) {
    console.error("Failed to get quiz:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create quiz
 */
export const createQuiz = async (
  input: CreateQuizInput,
): Promise<Schema["Quiz"]["type"]> => {
  const result = await client.models.Quiz.create(input);

  if (!result.data) {
    console.error("Failed to create quiz:", result.errors);
    throw new Error("Failed to create quiz");
  }

  return result.data;
};

/**
 * List user's quiz attempts
 */
export const listQuizAttempts = async (): Promise<Schema["QuizAttempt"]["type"][]> => {
  const result = await client.models.QuizAttempt.list();
  if (!result.data) {
    console.error("Failed to list quiz attempts:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Create quiz attempt
 */
export const createQuizAttempt = async (
  input: CreateQuizAttemptInput,
): Promise<Schema["QuizAttempt"]["type"]> => {
  const result = await client.models.QuizAttempt.create(input);

  if (!result.data) {
    console.error("Failed to create quiz attempt:", result.errors);
    throw new Error("Failed to create quiz attempt");
  }

  return result.data;
};

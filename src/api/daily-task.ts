import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateDailyTaskInput = Schema["DailyTask"]["createType"];
export type UpdateDailyTaskInput = Schema["DailyTask"]["updateType"];

/**
 * List user's daily tasks
 */
export const listDailyTasks = async (): Promise<Schema["DailyTask"]["type"][]> => {
  if (!client.models.DailyTask) return [];
  const result = await client.models.DailyTask.list();
  if (!result.data) {
    console.error("Failed to list daily tasks:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get today's tasks
 */
export const getTodayTasks = async (): Promise<Schema["DailyTask"]["type"][]> => {
  const today = new Date().toISOString().split("t")[0];
  const result = await client.models.DailyTask.list();
  
  if (!result.data) {
    console.error("Failed to list daily tasks:", result.errors);
    return [];
  }
  
  return result.data.filter((task) => task.date === today);
};

/**
 * Create daily task
 */
export const createDailyTask = async (
  input: CreateDailyTaskInput,
): Promise<Schema["DailyTask"]["type"]> => {
  const result = await client.models.DailyTask.create(input);

  if (!result.data) {
    console.error("Failed to create daily task:", result.errors);
    throw new Error("Failed to create daily task");
  }

  return result.data;
};

/**
 * Update daily task
 */
export const updateDailyTask = async (
  input: UpdateDailyTaskInput,
): Promise<Schema["DailyTask"]["type"]> => {
  const result = await client.models.DailyTask.update(input);

  if (!result.data) {
    console.error("Failed to update daily task:", result.errors);
    throw new Error("Failed to update daily task");
  }

  return result.data;
};

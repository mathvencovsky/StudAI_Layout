import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * List all programs
 */
export const listPrograms = async (): Promise<Schema["Program"]["type"][]> => {
  if (!client.models.Program) return [];
  const result = await client.models.Program.list();
  if (!result.data) {
    console.error("Failed to list programs:", result.errors);
    return [];
  }
  return result.data;
};

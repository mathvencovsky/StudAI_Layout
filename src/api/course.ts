import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateCourseInput = Schema["Course"]["createType"];
export type UpdateCourseInput = Schema["Course"]["updateType"];

/**
 * List user's courses
 */
export const listCourses = async (): Promise<Schema["Course"]["type"][]> => {
  const result = await client.models.Course.list();
  if (!result.data) {
    console.error("Failed to list courses:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get course by ID
 */
export const getCourse = async (
  identifier: Schema["Course"]["identifier"],
): Promise<Schema["Course"]["type"] | null> => {
  const result = await client.models.Course.get(identifier);
  if (!result.data) {
    console.error("Failed to get course:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create course
 */
export const createCourse = async (
  input: CreateCourseInput,
): Promise<Schema["Course"]["type"]> => {
  const result = await client.models.Course.create(input);

  if (!result.data) {
    console.error("Failed to create course:", result.errors);
    throw new Error("Failed to create course");
  }

  return result.data;
};

/**
 * Update course
 */
export const updateCourse = async (
  input: UpdateCourseInput,
): Promise<Schema["Course"]["type"]> => {
  const result = await client.models.Course.update(input);

  if (!result.data) {
    console.error("Failed to update course:", result.errors);
    throw new Error("Failed to update course");
  }

  return result.data;
};

/**
 * Delete course
 */
export const deleteCourse = async (
  identifier: Schema["Course"]["identifier"],
): Promise<void> => {
  const result = await client.models.Course.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete course:", result.errors);
    throw new Error("Failed to delete course");
  }
};

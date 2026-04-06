import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateUserCourseInput = Schema["UserCourse"]["createType"];
export type UpdateUserCourseInput = Schema["UserCourse"]["updateType"];

/**
 * List user's course enrollments
 */
export const listUserCourses = async (): Promise<
  Schema["UserCourse"]["type"][]
> => {
  if (!client.models.UserCourse) return [];
  const result = await client.models.UserCourse.list();
  if (!result.data) {
    console.error("Failed to list user courses:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get user course by ID
 */
export const getUserCourse = async (
  identifier: Schema["UserCourse"]["identifier"],
): Promise<Schema["UserCourse"]["type"] | null> => {
  const result = await client.models.UserCourse.get(identifier);
  if (!result.data) {
    console.error("Failed to get user course:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create user course enrollment
 */
export const createUserCourse = async (
  input: CreateUserCourseInput,
): Promise<Schema["UserCourse"]["type"]> => {
  const result = await client.models.UserCourse.create(input);

  if (!result.data) {
    console.error("Failed to create user course:", result.errors);
    throw new Error("Failed to create user course");
  }

  return result.data;
};

/**
 * Update user course enrollment
 */
export const updateUserCourse = async (
  input: UpdateUserCourseInput,
): Promise<Schema["UserCourse"]["type"]> => {
  const result = await client.models.UserCourse.update(input);

  if (!result.data) {
    console.error("Failed to update user course:", result.errors);
    throw new Error("Failed to update user course");
  }

  return result.data;
};

/**
 * Delete user course enrollment
 */
export const deleteUserCourse = async (
  identifier: Schema["UserCourse"]["identifier"],
): Promise<void> => {
  const result = await client.models.UserCourse.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete user course:", result.errors);
    throw new Error("Failed to delete user course");
  }
};

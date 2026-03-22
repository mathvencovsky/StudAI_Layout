import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateCalendarEventInput = Schema["CalendarEvent"]["createType"];
export type UpdateCalendarEventInput = Schema["CalendarEvent"]["updateType"];

/**
 * List user's calendar events
 */
export const listCalendarEvents = async (): Promise<Schema["CalendarEvent"]["type"][]> => {
  const result = await client.models.CalendarEvent.list();
  if (!result.data) {
    console.error("Failed to list calendar events:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Create calendar event
 */
export const createCalendarEvent = async (
  input: CreateCalendarEventInput,
): Promise<Schema["CalendarEvent"]["type"]> => {
  const result = await client.models.CalendarEvent.create(input);

  if (!result.data) {
    console.error("Failed to create calendar event:", result.errors);
    throw new Error("Failed to create calendar event");
  }

  return result.data;
};

/**
 * Update calendar event
 */
export const updateCalendarEvent = async (
  input: UpdateCalendarEventInput,
): Promise<Schema["CalendarEvent"]["type"]> => {
  const result = await client.models.CalendarEvent.update(input);

  if (!result.data) {
    console.error("Failed to update calendar event:", result.errors);
    throw new Error("Failed to update calendar event");
  }

  return result.data;
};

/**
 * Delete calendar event
 */
export const deleteCalendarEvent = async (
  identifier: Schema["CalendarEvent"]["identifier"],
): Promise<void> => {
  const result = await client.models.CalendarEvent.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete calendar event:", result.errors);
    throw new Error("Failed to delete calendar event");
  }
};

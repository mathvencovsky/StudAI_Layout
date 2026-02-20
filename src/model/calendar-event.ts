import { type Schema } from "../../amplify/data/resource";

export type CalendarEvent = Schema["CalendarEvent"]["type"];
export type CalendarEventIdentifier = Schema["CalendarEvent"]["identifier"];
export type CalendarEventCreateInput = Schema["CalendarEvent"]["createType"];
export type CalendarEventUpdateInput = Schema["CalendarEvent"]["updateType"];
export type CalendarEventDeleteInput = Schema["CalendarEvent"]["deleteType"];
export type CalendarEventType = NonNullable<CalendarEvent["eventType"]>;

export const CALENDAR_EVENT_TYPES: CalendarEventType[] = [
  "session",
  "deadline",
  "exam",
  "reminder",
];

/**
 * System prompts have been moved to the backend.
 *
 * - The Chat conversation system prompt is defined in amplify/data/resource.ts
 *   on the Chat conversation model's `systemPrompt` field.
 * - Course builder, coach, and recommendations prompts are stored as
 *   ContentEnginePrompt records in the database (Admin-managed).
 *
 * DO NOT add system prompt text to this file. It would be bundled into the
 * client-side JavaScript and exposed to all users.
 */

/** @deprecated — prompts are backend-only. This export is kept for import compatibility only. */
export const STUDAI_SYSTEM_PROMPT = "";

/** @deprecated — prompts are backend-only. */
export const COURSE_BUILDER_PROMPT = "";

/** @deprecated — prompts are backend-only. */
export const COACH_PROMPT = "";

/** @deprecated — prompts are backend-only. */
export const RECOMMENDATIONS_PROMPT = "";

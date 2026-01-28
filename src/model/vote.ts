import { z } from "zod";

/**
 * Zod schema for vote input (what clients send)
 */
export const VoteInputSchema = z.object({
  value: z.enum(["1", "-1"]).transform((val) => parseInt(val) as 1 | -1),
});

export type VoteInput = z.infer<typeof VoteInputSchema>;

/**
 * Zod schema for vote as stored in Firestore
 */
export const VoteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
  updatedAt: z.preprocess((val) => {
    // Check if the value is a Firestore Timestamp object
    if (
      val &&
      typeof val === "object" &&
      "toDate" in val &&
      typeof val.toDate === "function"
    ) {
      return val.toDate();
    }
    return val;
  }, z.date()),
});

export type Vote = z.infer<typeof VoteSchema>;

/**
 * Vote with ID (as returned from Firestore)
 */
export type VoteWithId = Vote & { id: string };

/**
 * User's vote state for a module (null means no vote)
 */
export type UserVoteState = 1 | -1 | null;

export interface GetVotesDocOptions {
  moduleId: string;
  uid: string;
}

import { type Schema } from "../../amplify/data/resource";

export type Vote = Schema["Vote"]["type"];
export type VoteIdentifier = Schema["Vote"]["identifier"];
export type VoteCreateInput = Schema["Vote"]["createType"];
export type VoteUpdateInput = Schema["Vote"]["updateType"];
export type VoteDeleteInput = Schema["Vote"]["deleteType"];

export type UserVoteState = 1 | -1 | null;

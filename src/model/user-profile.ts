import { type Schema } from "../../amplify/data/resource";

export type UserProfile = Schema["UserProfile"]["type"];
export type UserProfileIdentifier = Schema["UserProfile"]["identifier"];
export type UserProfileCreateInput = Schema["UserProfile"]["createType"];
export type UserProfileUpdateInput = Schema["UserProfile"]["updateType"];
export type UserProfileDeleteInput = Schema["UserProfile"]["deleteType"];

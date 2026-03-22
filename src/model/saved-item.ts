import { type Schema } from "../../amplify/data/resource";

export type SavedItem = Schema["SavedItem"]["type"];
export type SavedItemIdentifier = Schema["SavedItem"]["identifier"];
export type SavedItemCreateInput = Schema["SavedItem"]["createType"];
export type SavedItemDeleteInput = Schema["SavedItem"]["deleteType"];

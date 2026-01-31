import { type Schema } from "../../amplify/data/resource";

export type Module = Schema["Module"]["type"];
export type ModuleCreateInput = Schema["Module"]["createType"];
export type ModuleUpdateInput = Schema["Module"]["updateType"];

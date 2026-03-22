import { type Schema } from "../../amplify/data/resource";

export type Quiz = Schema["Quiz"]["type"];
export type QuizIdentifier = Schema["Quiz"]["identifier"];
export type QuizCreateInput = Schema["Quiz"]["createType"];
export type QuizUpdateInput = Schema["Quiz"]["updateType"];
export type QuizDeleteInput = Schema["Quiz"]["deleteType"];

export type QuizAttempt = Schema["QuizAttempt"]["type"];
export type QuizAttemptIdentifier = Schema["QuizAttempt"]["identifier"];
export type QuizAttemptCreateInput = Schema["QuizAttempt"]["createType"];
export type QuizAttemptUpdateInput = Schema["QuizAttempt"]["updateType"];
export type QuizAttemptDeleteInput = Schema["QuizAttempt"]["deleteType"];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

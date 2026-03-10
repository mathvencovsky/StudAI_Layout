export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  options: QuizOption[];
  correctAnswer?: string; // Para short-answer e essay
  explanation?: string;
  order: number;
}

export interface QuizData {
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number; // em minutos
  allowRetry: boolean;
  showFeedbackImmediately: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  questions: QuizQuestion[];
}

export interface ExerciseStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ExerciseResource {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'file' | 'video';
}

export interface EvaluationCriterion {
  id: string;
  criterion: string;
  points: number;
}

export interface ExerciseData {
  title: string;
  description: string;
  instructions: ExerciseStep[];
  requiredResources: ExerciseResource[];
  evaluationCriteria: EvaluationCriterion[];
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  submissionType: 'text' | 'file' | 'link' | 'code';
}

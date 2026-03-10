// Learning System Types

export interface Track {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  estimatedHours: number;
  totalXP: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: Module[];
  progress: TrackProgress;
  certificate?: Certificate;
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  xpReward: number;
  order: number;
  lessons: Lesson[];
  finalAssessment?: Assessment;
  progress: ModuleProgress;
  isLocked: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  xpReward: number;
  order: number;
  content: LessonContent;
  checkpoints: Checkpoint[];
  exercises: Exercise[];
  resources: Resource[];
  progress: LessonProgress;
  isLocked: boolean;
}

export interface LessonContent {
  type: 'video' | 'text' | 'interactive';
  videoUrl?: string;
  chapters?: VideoChapter[];
  textContent?: string;
  interactiveElements?: InteractiveElement[];
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
}

export interface Checkpoint {
  id: string;
  lessonId: string;
  title: string;
  question: string;
  options: CheckpointOption[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  order: number;
  isCompleted: boolean;
}

export interface CheckpointOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  type: 'code' | 'quiz' | 'project';
  instructions: string;
  starterCode?: string;
  solution?: string;
  testCases?: TestCase[];
  xpReward: number;
  isCompleted: boolean;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'documentation' | 'article' | 'code' | 'external';
  url: string;
  description?: string;
}

// Progress Types
export interface TrackProgress {
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  xpEarned: number;
  totalXP: number;
  percentComplete: number;
  timeSpent: number; // in minutes
  currentStreak: number;
  lastStudyDate?: Date;
  estimatedTimeRemaining: number;
}

export interface ModuleProgress {
  completedLessons: number;
  totalLessons: number;
  xpEarned: number;
  totalXP: number;
  percentComplete: number;
  timeSpent: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface LessonProgress {
  isStarted: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent: number;
  videoProgress: number; // 0-100
  completedCheckpoints: string[];
  completedExercises: string[];
  xpEarned: number;
  lastPosition?: number; // for resuming video
}

// Assessment Types
export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  xpReward: number;
  timeLimit?: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code' | 'essay';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

// Certificate Types
export interface Certificate {
  id: string;
  trackId: string;
  title: string;
  description: string;
  issuedAt?: Date;
  certificateUrl?: string;
}

// AI Assistant Types
export interface AIAssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    lessonId?: string;
    moduleId?: string;
    trackId?: string;
    currentTopic?: string;
  };
}

export interface AIAssistantSuggestion {
  id: string;
  type: 'explanation' | 'practice' | 'review' | 'next-step';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

// Interactive Elements
export interface InteractiveElement {
  id: string;
  type: 'code-editor' | 'quiz' | 'drag-drop' | 'simulation';
  title: string;
  instructions: string;
  config: Record<string, any>;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  title: string;
  type: 'track' | 'module' | 'lesson';
  status: 'locked' | 'available' | 'current' | 'completed';
  progress?: number;
  children?: NavigationItem[];
}

// User Preferences
export interface LearningPreferences {
  playbackSpeed: number;
  autoplay: boolean;
  showTranscripts: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'none';
  difficultyPreference: 'adaptive' | 'fixed';
  practiceFrequency: 'high' | 'medium' | 'low';
}
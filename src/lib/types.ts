export type QuizQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "short_text"
  | "long_text";

export interface QuizOption {
  value: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  title: string;
  description?: string;
  type: QuizQuestionType;
  required?: boolean;
  points?: number;
  options?: QuizOption[];
  correctAnswers?: string[];
}

export interface QuizForm {
  version: 1;
  title: string;
  description?: string;
  isQuiz?: boolean;
  questions: QuizQuestion[];
}

export const SUPPORTED_TYPES: QuizQuestionType[] = [
  "single_choice",
  "multiple_choice",
  "dropdown",
  "short_text",
  "long_text",
];

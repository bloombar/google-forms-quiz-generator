/**
 * Public library API for the Quiz Generator.
 *
 * Exposes the auth-agnostic core so other apps (e.g. Slide Machine) can create,
 * update, and read Google Forms quizzes in-process by injecting their own
 * authorized OAuth2 client. The interactive CLI auth (`google-auth`) and local
 * deployment tracking (`deployments`) are intentionally NOT re-exported here —
 * they are CLI-only concerns and would drag CWD/browser assumptions into
 * library consumers.
 */
export {
  createGoogleFormFromQuiz,
  updateGoogleFormFromQuiz,
  downloadFormAsQuizFile,
} from "./lib/google-forms.js";
export type {
  CreateFormOptions,
  FormAuthOptions,
} from "./lib/google-forms.js";
export {
  buildTemplateQuizFile,
  readQuizFile,
  writeQuizFile,
} from "./lib/quiz-file.js";
export { validateQuizForm } from "./lib/validation.js";
export * from "./lib/types.js";

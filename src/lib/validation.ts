import { QuizForm, QuizQuestion, SUPPORTED_TYPES } from "./types.js";

function assertString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${fieldName}: expected non-empty string.`);
  }
  return value.trim();
}

function validateQuestion(question: QuizQuestion, index: number): QuizQuestion {
  const label = `questions[${index}]`;

  question.title = assertString(question.title, `${label}.title`);

  if (!SUPPORTED_TYPES.includes(question.type)) {
    throw new Error(
      `Invalid ${label}.type: expected one of ${SUPPORTED_TYPES.join(", ")}.`,
    );
  }

  if (question.description !== undefined) {
    question.description = assertString(
      question.description,
      `${label}.description`,
    );
  }

  if (question.points !== undefined) {
    if (!Number.isFinite(question.points) || question.points < 0) {
      throw new Error(
        `Invalid ${label}.points: expected a non-negative number.`,
      );
    }
  }

  const isChoiceQuestion =
    question.type === "single_choice" ||
    question.type === "multiple_choice" ||
    question.type === "dropdown";

  if (isChoiceQuestion) {
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error(
        `Invalid ${label}.options: choice questions require at least 2 options.`,
      );
    }

    question.options = question.options.map((option, optionIndex) => ({
      value: assertString(
        option.value,
        `${label}.options[${optionIndex}].value`,
      ),
      isCorrect: option.isCorrect,
    }));

    if (question.correctAnswers !== undefined) {
      if (!Array.isArray(question.correctAnswers)) {
        throw new Error(
          `Invalid ${label}.correctAnswers: expected a string array.`,
        );
      }

      question.correctAnswers = question.correctAnswers.map(
        (answer, answerIndex) =>
          assertString(answer, `${label}.correctAnswers[${answerIndex}]`),
      );
    }
  } else {
    if (question.options !== undefined) {
      throw new Error(
        `Invalid ${label}.options: not allowed for text questions.`,
      );
    }

    if (question.correctAnswers !== undefined) {
      if (!Array.isArray(question.correctAnswers)) {
        throw new Error(
          `Invalid ${label}.correctAnswers: expected a string array.`,
        );
      }

      question.correctAnswers = question.correctAnswers.map(
        (answer, answerIndex) =>
          assertString(answer, `${label}.correctAnswers[${answerIndex}]`),
      );
    }
  }

  return question;
}

export function validateQuizForm(raw: unknown): QuizForm {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid quiz file: expected an object at root level.");
  }

  const form = raw as QuizForm;

  if (form.version !== 1) {
    throw new Error("Invalid version: expected version: 1.");
  }

  form.title = assertString(form.title, "title");

  if (form.description !== undefined) {
    form.description = assertString(form.description, "description");
  }

  if (!Array.isArray(form.questions) || form.questions.length === 0) {
    throw new Error("Invalid questions: expected a non-empty array.");
  }

  form.questions = form.questions.map((question, index) =>
    validateQuestion(question, index),
  );

  if (form.isQuiz === undefined) {
    form.isQuiz = true;
  }

  return form;
}

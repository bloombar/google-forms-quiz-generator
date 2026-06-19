import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { QuizForm } from "./types.js";
import { validateQuizForm } from "./validation.js";

export async function readQuizFile(path: string): Promise<QuizForm> {
  const raw = await fs.readFile(path, "utf8");
  const parsed = yaml.load(raw);
  return validateQuizForm(parsed);
}

export async function writeQuizFile(
  filePath: string,
  data: QuizForm,
): Promise<void> {
  const output = yaml.dump(data, {
    noRefs: true,
    lineWidth: 110,
    sortKeys: false,
  });

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, output, "utf8");
}

export function buildTemplateQuizFile(): QuizForm {
  return {
    version: 1,
    title: "Sample Quiz",
    description: "Edit this file and upload it to Google Forms.",
    isQuiz: true,
    emailCollection: "verified",
    questions: [
      {
        title: "What is 2 + 2?",
        type: "single_choice",
        required: true,
        points: 1,
        options: [
          { value: "3" },
          { value: "4", isCorrect: true },
          { value: "5" },
        ],
      },
      {
        title: "Select all prime numbers.",
        type: "multiple_choice",
        points: 2,
        options: [
          { value: "2", isCorrect: true },
          { value: "3", isCorrect: true },
          { value: "4" },
          { value: "5", isCorrect: true },
        ],
      },
      {
        title: "Which language runs in the browser?",
        type: "dropdown",
        options: [
          { value: "Java" },
          { value: "TypeScript", isCorrect: true },
          { value: "C" },
        ],
      },
      {
        title: "One-word answer: largest ocean on Earth.",
        type: "short_text",
        correctAnswers: ["Pacific"],
      },
      {
        title: "Describe your favorite learning strategy.",
        type: "long_text",
      },
    ],
  };
}

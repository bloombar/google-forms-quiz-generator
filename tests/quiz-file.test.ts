import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildTemplateQuizFile,
  readQuizFile,
  writeQuizFile,
} from "../src/lib/quiz-file.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dir) => fs.rm(dir, { recursive: true, force: true })),
  );
});

describe("quiz-file", () => {
  it("buildTemplateQuizFile returns a valid template shape", () => {
    const template = buildTemplateQuizFile();

    expect(template.version).toBe(1);
    expect(template.title).toBe("Sample Quiz");
    expect(template.questions.length).toBeGreaterThanOrEqual(5);
  });

  it("writes and reads a quiz file round-trip", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "quiz-file-test-"));
    tempDirs.push(dir);

    const filePath = path.join(dir, "quiz.yaml");
    const quiz = buildTemplateQuizFile();

    await writeQuizFile(filePath, quiz);
    const readBack = await readQuizFile(filePath);

    expect(readBack.title).toBe(quiz.title);
    expect(readBack.questions.length).toBe(quiz.questions.length);
    expect(readBack.questions[0]?.type).toBe(quiz.questions[0]?.type);
  });

  it("throws for invalid YAML content", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "quiz-file-test-"));
    tempDirs.push(dir);

    const filePath = path.join(dir, "bad.yaml");
    await fs.writeFile(filePath, "not: [valid", "utf8");

    await expect(readQuizFile(filePath)).rejects.toThrow();
  });
});

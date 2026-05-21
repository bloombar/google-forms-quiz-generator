import { describe, expect, it } from "vitest";
import { validateQuizForm } from "../src/lib/validation.js";

describe("validateQuizForm", () => {
  it("validates and normalizes a valid quiz", () => {
    const result = validateQuizForm({
      version: 1,
      title: "  Sample Quiz  ",
      questions: [
        {
          title: "  Question 1  ",
          type: "single_choice",
          options: [{ value: " A " }, { value: " B " }],
        },
      ],
    });

    expect(result.title).toBe("Sample Quiz");
    expect(result.isQuiz).toBe(true);
    expect(result.questions[0]?.title).toBe("Question 1");
    expect(result.questions[0]?.options?.[0]?.value).toBe("A");
  });

  it("rejects invalid version", () => {
    expect(() =>
      validateQuizForm({
        version: 2,
        title: "Quiz",
        questions: [{ title: "Q", type: "short_text" }],
      }),
    ).toThrow("Invalid version");
  });

  it("rejects choice questions without enough options", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [
          {
            title: "Q",
            type: "single_choice",
            options: [{ value: "A" }],
          },
        ],
      }),
    ).toThrow("require at least 2 options");
  });

  it("rejects options on text questions", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [
          {
            title: "Q",
            type: "short_text",
            options: [{ value: "A" }, { value: "B" }],
          },
        ],
      }),
    ).toThrow("not allowed for text questions");
  });

  it("rejects negative points", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [
          {
            title: "Q",
            type: "short_text",
            points: -1,
          },
        ],
      }),
    ).toThrow("non-negative number");
  });

  it("rejects unsupported question type", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [
          {
            title: "Q",
            type: "unknown_type",
          },
        ],
      }),
    ).toThrow("expected one of");
  });

  it("rejects non-array correctAnswers", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [
          {
            title: "Q",
            type: "short_text",
            correctAnswers: "yes",
          },
        ],
      }),
    ).toThrow("expected a string array");
  });

  it("rejects empty description", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        description: "   ",
        questions: [
          {
            title: "Q",
            type: "short_text",
          },
        ],
      }),
    ).toThrow("Invalid description");
  });

  it("defaults isQuiz to true when omitted", () => {
    const result = validateQuizForm({
      version: 1,
      title: "Quiz",
      questions: [
        {
          title: "Q",
          type: "short_text",
        },
      ],
    });

    expect(result.isQuiz).toBe(true);
  });

  it("rejects non-object root input", () => {
    expect(() => validateQuizForm(null)).toThrow(
      "expected an object at root level",
    );
  });

  it("rejects empty questions array", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [],
      }),
    ).toThrow("expected a non-empty array");
  });

  it("normalizes question description text", () => {
    const result = validateQuizForm({
      version: 1,
      title: "Quiz",
      questions: [
        {
          title: "Q",
          type: "short_text",
          description: "  details  ",
        },
      ],
    });

    expect(result.questions[0]?.description).toBe("details");
  });

  it("normalizes choice-question correctAnswers entries", () => {
    const result = validateQuizForm({
      version: 1,
      title: "Quiz",
      questions: [
        {
          title: "Q",
          type: "single_choice",
          options: [{ value: "A" }, { value: "B" }],
          correctAnswers: ["  A  ", "B"],
        },
      ],
    });

    expect(result.questions[0]?.correctAnswers).toEqual(["A", "B"]);
  });

  it("rejects non-array correctAnswers on choice questions", () => {
    expect(() =>
      validateQuizForm({
        version: 1,
        title: "Quiz",
        questions: [
          {
            title: "Q",
            type: "single_choice",
            options: [{ value: "A" }, { value: "B" }],
            correctAnswers: "A",
          },
        ],
      }),
    ).toThrow("expected a string array");
  });
});

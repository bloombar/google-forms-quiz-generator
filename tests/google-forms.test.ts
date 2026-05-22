import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { QuizForm } from "../src/lib/types.js";

const formsCreateMock = vi.fn();
const formsGetMock = vi.fn();
const formsBatchUpdateMock = vi.fn();
const driveGetMock = vi.fn();
const driveUpdateMock = vi.fn();
const googleFormsFactoryMock = vi.fn(() => ({
  forms: {
    create: formsCreateMock,
    get: formsGetMock,
    batchUpdate: formsBatchUpdateMock,
  },
}));
const googleDriveFactoryMock = vi.fn(() => ({
  files: {
    get: driveGetMock,
    update: driveUpdateMock,
  },
}));

vi.mock("googleapis", () => ({
  google: {
    forms: googleFormsFactoryMock,
    drive: googleDriveFactoryMock,
  },
}));

const sampleQuiz: QuizForm = {
  version: 1,
  title: "Sample Quiz",
  description: "Description",
  isQuiz: true,
  questions: [
    {
      title: "What is 2 + 2?",
      type: "single_choice",
      points: 1,
      required: true,
      options: [{ value: "3" }, { value: "4", isCorrect: true }],
    },
  ],
};

const textOnlyQuiz: QuizForm = {
  version: 1,
  title: "Text Quiz",
  isQuiz: true,
  questions: [
    {
      title: "Explain your answer",
      type: "long_text",
      required: false,
    },
  ],
};

const mixedChoiceQuiz: QuizForm = {
  version: 1,
  title: "Mixed Choice Quiz",
  isQuiz: true,
  questions: [
    {
      title: "Select many",
      type: "multiple_choice",
      points: 2,
      options: [{ value: "A" }, { value: "B" }],
    },
    {
      title: "Select one",
      type: "dropdown",
      options: [{ value: "X" }, { value: "Y" }],
    },
  ],
};

let tempDir = "";
let originalEnvCredentials = "";
let originalEnvToken = "";

async function importFormsModule() {
  vi.resetModules();
  return import("../src/lib/google-forms.js");
}

describe("google-forms core functions", () => {
  beforeEach(async () => {
    formsCreateMock.mockReset();
    formsGetMock.mockReset();
    formsBatchUpdateMock.mockReset();
    driveGetMock.mockReset();
    driveUpdateMock.mockReset();
    googleFormsFactoryMock.mockClear();
    googleDriveFactoryMock.mockClear();

    originalEnvCredentials = process.env.GOOGLE_CREDENTIALS_PATH ?? "";
    originalEnvToken = process.env.GOOGLE_TOKEN_PATH ?? "";

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "google-forms-test-"));
    const tokenPath = path.join(tempDir, "tokens", "google-oauth.json");

    await fs.mkdir(path.dirname(tokenPath), { recursive: true });
    await fs.writeFile(
      tokenPath,
      JSON.stringify({
        type: "authorized_user",
        client_id: "id",
        client_secret: "secret",
        refresh_token: "refresh",
      }),
      "utf8",
    );

    process.env.GOOGLE_TOKEN_PATH = tokenPath;
    process.env.GOOGLE_CREDENTIALS_PATH = path.join(
      tempDir,
      "credentials.json",
    );
  });

  afterEach(async () => {
    if (originalEnvCredentials) {
      process.env.GOOGLE_CREDENTIALS_PATH = originalEnvCredentials;
    } else {
      delete process.env.GOOGLE_CREDENTIALS_PATH;
    }

    if (originalEnvToken) {
      process.env.GOOGLE_TOKEN_PATH = originalEnvToken;
    } else {
      delete process.env.GOOGLE_TOKEN_PATH;
    }

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("creates a form and applies metadata and questions", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-123" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-123", name: "Sample Quiz", parents: [] },
    });
    formsGetMock.mockResolvedValue({
      data: {
        responderUri: "https://example.com/view",
      },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    const result = await createGoogleFormFromQuiz(sampleQuiz);

    expect(result.formId).toBe("form-123");
    expect(result.responderUri).toBe("https://example.com/view");

    expect(formsCreateMock).toHaveBeenCalledWith({
      requestBody: {
        info: {
          title: "Sample Quiz",
        },
      },
    });

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };
    expect(batchCall.requestBody.requests.length).toBeGreaterThanOrEqual(3);
    expect(batchCall.requestBody.requests[0]).toHaveProperty("updateFormInfo");
    expect(googleDriveFactoryMock).toHaveBeenCalledTimes(1);
    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-123",
      requestBody: {
        name: "Sample Quiz",
      },
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });

  it("creates a form with long_text question mapped as paragraph text and no grading", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-789" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-789", name: "Text Quiz", parents: [] },
    });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(textOnlyQuiz);

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };
    const createItemRequest = batchCall.requestBody.requests.find(
      (request) => "createItem" in request,
    ) as {
      createItem: {
        item: {
          questionItem?: {
            question?: {
              grading?: unknown;
              textQuestion?: { paragraph?: boolean };
            };
          };
        };
      };
    };

    expect(
      createItemRequest.createItem.item.questionItem?.question?.textQuestion,
    ).toEqual({
      paragraph: true,
    });
    expect(
      createItemRequest.createItem.item.questionItem?.question?.grading,
    ).toBeUndefined();
  });

  it("maps multiple_choice and dropdown create question types and allows grading without answers", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-999" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-999", name: "Mixed Choice Quiz", parents: [] },
    });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(mixedChoiceQuiz);

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };

    const createRequests = batchCall.requestBody.requests.filter(
      (request) => "createItem" in request,
    ) as Array<{
      createItem: {
        item: {
          questionItem?: {
            question?: {
              grading?: { correctAnswers?: unknown; pointValue?: number };
              choiceQuestion?: { type?: string };
            };
          };
        };
      };
    }>;

    expect(
      createRequests[0]?.createItem.item.questionItem?.question?.choiceQuestion
        ?.type,
    ).toBe("CHECKBOX");
    expect(
      createRequests[1]?.createItem.item.questionItem?.question?.choiceQuestion
        ?.type,
    ).toBe("DROP_DOWN");
    expect(
      createRequests[0]?.createItem.item.questionItem?.question?.grading
        ?.pointValue,
    ).toBe(2);
    expect(
      createRequests[0]?.createItem.item.questionItem?.question?.grading
        ?.correctAnswers,
    ).toBeUndefined();
  });

  it("handles choice questions with undefined options during create mapping", async () => {
    const malformedQuiz = {
      version: 1,
      title: "Malformed Quiz",
      isQuiz: true,
      questions: [
        {
          title: "Broken choice",
          type: "single_choice",
          options: undefined,
        },
      ],
    } as unknown as QuizForm;

    formsCreateMock.mockResolvedValue({ data: { formId: "form-mal" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-mal", name: "Malformed Quiz", parents: [] },
    });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(malformedQuiz);

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };
    const createItemRequest = batchCall.requestBody.requests.find(
      (request) => "createItem" in request,
    ) as {
      createItem: {
        item: {
          questionItem?: {
            question?: {
              choiceQuestion?: { options?: unknown[] };
            };
          };
        };
      };
    };

    expect(
      createItemRequest.createItem.item.questionItem?.question?.choiceQuestion
        ?.options,
    ).toEqual([]);
  });

  it("moves created form to folder when folderId is provided", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-123" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });
    driveGetMock.mockResolvedValue({
      data: { parents: ["root", "old-parent"] },
    });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-123", name: "Sample Quiz", parents: ["folder-999"] },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(sampleQuiz, { folderId: "folder-999" });

    expect(driveGetMock).toHaveBeenCalledWith({
      fileId: "form-123",
      fields: "parents",
      supportsAllDrives: true,
    });
    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-123",
      requestBody: {
        name: "Sample Quiz",
      },
      addParents: "folder-999",
      removeParents: "root,old-parent",
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });

  it("renames the drive file even when folderId is blank after trimming", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-123" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-123", name: "Sample Quiz", parents: [] },
    });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(sampleQuiz, { folderId: "   " });

    expect(googleDriveFactoryMock).toHaveBeenCalledTimes(1);
    expect(driveGetMock).not.toHaveBeenCalled();
    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-123",
      requestBody: {
        name: "Sample Quiz",
      },
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });

  it("moves form and omits removeParents when no existing parents", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-123" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });
    driveGetMock.mockResolvedValue({ data: { parents: [] } });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-123", name: "Sample Quiz", parents: ["folder-999"] },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(sampleQuiz, { folderId: "folder-999" });

    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-123",
      requestBody: {
        name: "Sample Quiz",
      },
      addParents: "folder-999",
      removeParents: undefined,
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });

  it("throws when create does not return formId", async () => {
    formsCreateMock.mockResolvedValue({ data: {} });

    const { createGoogleFormFromQuiz } = await importFormsModule();

    await expect(createGoogleFormFromQuiz(sampleQuiz)).rejects.toThrow(
      "formId",
    );
  });

  it("downloads and maps Google Form items into quiz format", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        info: {
          title: "Downloaded Quiz",
          description: "From Google",
        },
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        items: [
          {
            title: "Choice Q",
            description: "Pick one",
            questionItem: {
              question: {
                required: true,
                grading: {
                  pointValue: 2,
                  correctAnswers: {
                    answers: [{ value: "A" }],
                  },
                },
                choiceQuestion: {
                  type: "RADIO",
                  options: [{ value: "A" }, { value: "B" }],
                },
              },
            },
          },
          {
            title: "Text Q",
            questionItem: {
              question: {
                textQuestion: {
                  paragraph: true,
                },
              },
            },
          },
          {
            title: "Non-question item",
          },
        ],
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-1");

    expect(result.title).toBe("Downloaded Quiz");
    expect(result.questions).toHaveLength(2);
    expect(result.questions[0]?.type).toBe("single_choice");
    expect(result.questions[0]?.options?.[0]?.isCorrect).toBe(true);
    expect(result.questions[1]?.type).toBe("long_text");
  });

  it("maps text question correctAnswers and filters unknown question shapes", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        info: {
          title: "Downloaded Quiz",
        },
        items: [
          {
            title: "Text Q",
            questionItem: {
              question: {
                grading: {
                  correctAnswers: {
                    answers: [{ value: "Pacific" }],
                  },
                },
                textQuestion: {
                  paragraph: false,
                },
              },
            },
          },
          {
            title: "Unknown Q",
            questionItem: {
              question: {
                required: true,
              },
            },
          },
        ],
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-2");

    expect(result.questions).toHaveLength(1);
    expect(result.questions[0]?.type).toBe("short_text");
    expect(result.questions[0]?.correctAnswers).toEqual(["Pacific"]);
  });

  it("maps checkbox and dropdown question types", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        info: {
          title: "Downloaded Quiz",
        },
        items: [
          {
            title: "Checkbox Q",
            questionItem: {
              question: {
                choiceQuestion: {
                  type: "CHECKBOX",
                  options: [{ value: "A" }, { value: "B" }],
                },
              },
            },
          },
          {
            title: "Dropdown Q",
            questionItem: {
              question: {
                choiceQuestion: {
                  type: "DROP_DOWN",
                  options: [{ value: "X" }, { value: "Y" }],
                },
              },
            },
          },
        ],
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-3");

    expect(result.questions[0]?.type).toBe("multiple_choice");
    expect(result.questions[1]?.type).toBe("dropdown");
  });

  it("returns undefined responderUri when create get response has no responderUri", async () => {
    formsCreateMock.mockResolvedValue({ data: { formId: "form-555" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-555", name: "Sample Quiz", parents: [] },
    });
    formsGetMock.mockResolvedValue({ data: {} });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    const result = await createGoogleFormFromQuiz(sampleQuiz);

    expect(result.formId).toBe("form-555");
    expect(result.responderUri).toBeUndefined();
  });

  it("downloads with defaults when title/settings are missing", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        items: [],
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-1");

    expect(result.title).toBe("Untitled form");
    expect(result.isQuiz).toBe(true);
    expect(result.questions).toEqual([]);
  });

  it("downloads with undefined items and returns empty questions", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        info: {
          title: "Quiz Without Items",
        },
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-4");

    expect(result.title).toBe("Quiz Without Items");
    expect(result.questions).toEqual([]);
  });

  it("maps choice question with missing options as empty options array", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        info: {
          title: "Downloaded Quiz",
        },
        items: [
          {
            title: "Choice without options",
            questionItem: {
              question: {
                choiceQuestion: {
                  type: "RADIO",
                },
              },
            },
          },
        ],
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-5");

    expect(result.questions).toHaveLength(1);
    expect(result.questions[0]?.type).toBe("single_choice");
    expect(result.questions[0]?.options).toEqual([]);
  });

  it("uses fallback title for question items without a title", async () => {
    formsGetMock.mockResolvedValue({
      data: {
        info: {
          title: "Downloaded Quiz",
        },
        items: [
          {
            questionItem: {
              question: {
                textQuestion: {
                  paragraph: false,
                },
              },
            },
          },
        ],
      },
    });

    const { downloadFormAsQuizFile } = await importFormsModule();
    const result = await downloadFormAsQuizFile("form-6");

    expect(result.questions[0]?.title).toBe("Untitled question");
  });

  it("updates a form by deleting existing items and recreating quiz items", async () => {
    formsGetMock
      .mockResolvedValueOnce({
        data: {
          items: [{}, {}, {}],
        },
      })
      .mockResolvedValueOnce({
        data: {
          responderUri: "https://example.com/updated",
        },
      });

    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-123", name: "Sample Quiz", parents: [] },
    });

    const { updateGoogleFormFromQuiz } = await importFormsModule();
    const result = await updateGoogleFormFromQuiz("form-123", sampleQuiz);

    expect(result.formId).toBe("form-123");
    expect(result.responderUri).toBe("https://example.com/updated");

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };

    const requests = batchCall.requestBody.requests;
    expect(requests[0]).toHaveProperty("updateFormInfo");
    expect(requests[1]).toHaveProperty("updateSettings");
    expect(requests[2]).toEqual({ deleteItem: { location: { index: 2 } } });
    expect(requests[3]).toEqual({ deleteItem: { location: { index: 1 } } });
    expect(requests[4]).toEqual({ deleteItem: { location: { index: 0 } } });
    expect(requests.some((request) => "createItem" in request)).toBe(true);
    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-123",
      requestBody: {
        name: "Sample Quiz",
      },
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });

  it("updates a form with empty existing items and default quiz setting", async () => {
    const quizWithoutIsQuiz: QuizForm = {
      version: 1,
      title: "No Quiz Flag",
      questions: [
        {
          title: "Q",
          type: "short_text",
        },
      ],
    };

    formsGetMock
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} });

    formsBatchUpdateMock.mockResolvedValue({ data: {} });

    const { updateGoogleFormFromQuiz } = await importFormsModule();
    const result = await updateGoogleFormFromQuiz(
      "form-777",
      quizWithoutIsQuiz,
    );

    expect(result.formId).toBe("form-777");
    expect(result.responderUri).toBeUndefined();

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };

    const requests = batchCall.requestBody.requests;
    expect(requests[1]).toEqual({
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        updateMask: "quizSettings.isQuiz",
      },
    });
    expect(requests.some((request) => "deleteItem" in request)).toBe(false);
    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-777",
      requestBody: {
        name: "No Quiz Flag",
      },
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });

  it("creates with default isQuiz and moves to folder when existing parents are undefined", async () => {
    const quizWithoutIsQuiz: QuizForm = {
      version: 1,
      title: "No Quiz Flag",
      questions: [
        {
          title: "Q",
          type: "short_text",
        },
      ],
    };

    formsCreateMock.mockResolvedValue({ data: { formId: "form-888" } });
    formsBatchUpdateMock.mockResolvedValue({ data: {} });
    formsGetMock.mockResolvedValue({
      data: { responderUri: "https://example.com/view" },
    });
    driveGetMock.mockResolvedValue({ data: {} });
    driveUpdateMock.mockResolvedValue({
      data: { id: "form-888", parents: ["folder-777"] },
    });

    const { createGoogleFormFromQuiz } = await importFormsModule();
    await createGoogleFormFromQuiz(quizWithoutIsQuiz, {
      folderId: "folder-777",
    });

    const batchCall = formsBatchUpdateMock.mock.calls[0]?.[0] as {
      requestBody: { requests: Array<Record<string, unknown>> };
    };
    expect(batchCall.requestBody.requests[1]).toEqual({
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        updateMask: "quizSettings.isQuiz",
      },
    });

    expect(driveUpdateMock).toHaveBeenCalledWith({
      fileId: "form-888",
      requestBody: {
        name: "No Quiz Flag",
      },
      addParents: "folder-777",
      removeParents: undefined,
      fields: "id,name,parents",
      supportsAllDrives: true,
    });
  });
});

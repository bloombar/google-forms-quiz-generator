import { drive_v3, forms_v1, google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import {
  DEFAULT_EMAIL_COLLECTION_MODE,
  EmailCollectionMode,
  QuizForm,
  QuizOption,
  QuizQuestion,
} from "./types.js";

export interface CreateFormOptions {
  /** An authorized OAuth2 client acting as the form owner. */
  auth: OAuth2Client;
  folderId?: string;
}

/** Auth for operations that only need an authorized client (update / download). */
export interface FormAuthOptions {
  /** An authorized OAuth2 client acting as the form owner. */
  auth: OAuth2Client;
}

const EMAIL_COLLECTION_MODE_TO_API: Record<EmailCollectionMode, string> = {
  verified: "VERIFIED",
  responder_input: "RESPONDER_INPUT",
  none: "DO_NOT_COLLECT",
};

function emailCollectionTypeFromApi(
  value: string | null | undefined,
): EmailCollectionMode {
  if (value === "RESPONDER_INPUT") return "responder_input";
  if (value === "DO_NOT_COLLECT") return "none";
  return "verified";
}

function buildSettings(quiz: QuizForm): {
  settings: forms_v1.Schema$FormSettings;
  updateMask: string;
} {
  const mode = quiz.emailCollection ?? DEFAULT_EMAIL_COLLECTION_MODE;
  return {
    settings: {
      quizSettings: {
        isQuiz: quiz.isQuiz ?? true,
      },
      emailCollectionType: EMAIL_COLLECTION_MODE_TO_API[mode],
    },
    updateMask: "quizSettings.isQuiz,emailCollectionType",
  };
}

function questionTypeToGoogleType(
  type: QuizQuestion["type"],
): "RADIO" | "CHECKBOX" | "DROP_DOWN" {
  if (type === "single_choice") return "RADIO";
  if (type === "multiple_choice") return "CHECKBOX";
  return "DROP_DOWN";
}

function mapQuestionToGoogleItem(question: QuizQuestion): forms_v1.Schema$Item {
  const isChoiceQuestion =
    question.type === "single_choice" ||
    question.type === "multiple_choice" ||
    question.type === "dropdown";

  const correctAnswers = (
    question.correctAnswers ??
    question.options
      ?.filter((option) => option.isCorrect)
      .map((option) => option.value) ??
    []
  ).map((value) => ({ value }));

  const grading: forms_v1.Schema$Grading | undefined =
    correctAnswers.length > 0 || question.points !== undefined
      ? {
          pointValue: question.points,
          correctAnswers:
            correctAnswers.length > 0
              ? {
                  answers: correctAnswers,
                }
              : undefined,
        }
      : undefined;

  const baseQuestion: forms_v1.Schema$Question = {
    required: question.required,
    grading,
  };

  if (isChoiceQuestion) {
    baseQuestion.choiceQuestion = {
      type: questionTypeToGoogleType(question.type),
      options: (question.options ?? []).map((option) => ({
        value: option.value,
      })),
      shuffle: false,
    };
  } else {
    baseQuestion.textQuestion = {
      paragraph: question.type === "long_text",
    };
  }

  return {
    title: question.title,
    description: question.description,
    questionItem: {
      question: baseQuestion,
    },
  };
}

function mapGoogleItemToQuestion(
  item: forms_v1.Schema$Item,
): QuizQuestion | null {
  const question = item.questionItem?.question;
  if (!question) {
    return null;
  }

  const base: QuizQuestion = {
    title: item.title ?? "Untitled question",
    description: item.description ?? undefined,
    required: question.required ?? false,
    points: question.grading?.pointValue ?? undefined,
    type: "short_text",
  };

  const answers = question.grading?.correctAnswers?.answers ?? [];
  const answerSet = new Set(
    answers
      .map((answer) => answer.value)
      .filter((value): value is string => !!value),
  );

  if (question.choiceQuestion) {
    const type = question.choiceQuestion.type;
    if (type === "CHECKBOX") {
      base.type = "multiple_choice";
    } else if (type === "DROP_DOWN") {
      base.type = "dropdown";
    } else {
      base.type = "single_choice";
    }

    const options: QuizOption[] = (question.choiceQuestion.options ?? [])
      .map((option) => option.value)
      .filter((value): value is string => !!value)
      .map((value) => ({
        value,
        isCorrect: answerSet.has(value) || undefined,
      }));

    base.options = options;

    if (answerSet.size > 0) {
      base.correctAnswers = [...answerSet];
    }

    return base;
  }

  if (question.textQuestion) {
    base.type = question.textQuestion.paragraph ? "long_text" : "short_text";
    if (answerSet.size > 0) {
      base.correctAnswers = [...answerSet];
    }
    return base;
  }

  return null;
}

function getFormsClient(auth: OAuth2Client): forms_v1.Forms {
  return google.forms({ version: "v1", auth });
}

function getDriveClient(auth: OAuth2Client): drive_v3.Drive {
  return google.drive({ version: "v3", auth });
}

async function syncDriveFileMetadata(
  auth: OAuth2Client,
  formId: string,
  title: string,
  folderId?: string,
): Promise<void> {
  const drive = getDriveClient(auth);
  const trimmedFolderId = folderId?.trim();

  const updateRequest: drive_v3.Params$Resource$Files$Update = {
    fileId: formId,
    requestBody: {
      name: title,
    },
    fields: "id,name,parents",
    supportsAllDrives: true,
  };

  try {
    if (trimmedFolderId) {
      const current = await drive.files.get({
        fileId: formId,
        fields: "parents",
        supportsAllDrives: true,
      });

      const parentIds = current.data.parents ?? [];
      updateRequest.addParents = trimmedFolderId;
      updateRequest.removeParents =
        parentIds.length > 0 ? parentIds.join(",") : undefined;
    }

    await drive.files.update(updateRequest);
  } catch (error) {
    // The Drive rename/move only keeps the Drive file's display name in sync
    // with the form title. The `drive.file` OAuth scope grants access only to
    // files this app created, so forms created elsewhere (e.g. in the Forms UI)
    // return HTTP 403 here — but the Forms API calls above already applied the
    // questions, title, description, and quiz settings. Treat 403 as a
    // non-fatal warning rather than failing the whole command.
    if ((error as { status?: number }).status === 403) {
      console.warn(
        `Warning: the form content was saved, but its Google Drive file could not be renamed or moved because this app did not create it (HTTP 403). The questions, title, description, and quiz settings were applied successfully.`,
      );
      return;
    }

    throw error;
  }
}

function buildCreateRequests(quiz: QuizForm): forms_v1.Schema$Request[] {
  const requests: forms_v1.Schema$Request[] = [
    {
      updateSettings: buildSettings(quiz),
    },
  ];

  quiz.questions.forEach((question, index) => {
    requests.push({
      createItem: {
        item: mapQuestionToGoogleItem(question),
        location: { index },
      },
    });
  });

  return requests;
}

export async function downloadFormAsQuizFile(
  formId: string,
  options: FormAuthOptions,
): Promise<QuizForm> {
  const forms = getFormsClient(options.auth);
  const response = await forms.forms.get({ formId });
  const form = response.data;

  const questions = (form.items ?? [])
    .map((item) => mapGoogleItemToQuestion(item))
    .filter((question): question is QuizQuestion => question !== null);

  return {
    version: 1,
    title: form.info?.title ?? "Untitled form",
    description: form.info?.description ?? undefined,
    isQuiz: form.settings?.quizSettings?.isQuiz ?? true,
    emailCollection: emailCollectionTypeFromApi(
      form.settings?.emailCollectionType,
    ),
    questions,
  };
}

export async function createGoogleFormFromQuiz(
  quiz: QuizForm,
  options: CreateFormOptions,
): Promise<{ formId: string; responderUri?: string }> {
  const forms = getFormsClient(options.auth);

  const createResponse = await forms.forms.create({
    requestBody: {
      info: {
        title: quiz.title,
      },
    },
  });

  const formId = createResponse.data.formId;
  if (!formId) {
    throw new Error("Google Forms did not return a formId.");
  }

  const requests = buildCreateRequests(quiz);
  requests.unshift({
    updateFormInfo: {
      info: {
        title: quiz.title,
        description: quiz.description,
      },
      updateMask: "title,description",
    },
  });

  await forms.forms.batchUpdate({
    formId,
    requestBody: { requests },
  });

  await syncDriveFileMetadata(options.auth, formId, quiz.title, options.folderId);

  const created = await forms.forms.get({ formId });

  return {
    formId,
    responderUri: created.data.responderUri ?? undefined,
  };
}

export async function updateGoogleFormFromQuiz(
  formId: string,
  quiz: QuizForm,
  options: FormAuthOptions,
): Promise<{ formId: string; responderUri?: string }> {
  const forms = getFormsClient(options.auth);
  const existing = await forms.forms.get({ formId });

  const existingCount = existing.data.items?.length ?? 0;

  const requests: forms_v1.Schema$Request[] = [
    {
      updateFormInfo: {
        info: {
          title: quiz.title,
          description: quiz.description,
        },
        updateMask: "title,description",
      },
    },
    {
      updateSettings: buildSettings(quiz),
    },
  ];

  for (let index = existingCount - 1; index >= 0; index -= 1) {
    requests.push({
      deleteItem: {
        location: { index },
      },
    });
  }

  quiz.questions.forEach((question, index) => {
    requests.push({
      createItem: {
        item: mapQuestionToGoogleItem(question),
        location: { index },
      },
    });
  });

  await forms.forms.batchUpdate({
    formId,
    requestBody: { requests },
  });

  await syncDriveFileMetadata(options.auth, formId, quiz.title);

  const updated = await forms.forms.get({ formId });

  return {
    formId,
    responderUri: updated.data.responderUri ?? undefined,
  };
}

import { drive_v3, forms_v1, google } from "googleapis";
import { getAuthorizedClient } from "./google-auth.js";
import { QuizForm, QuizOption, QuizQuestion } from "./types.js";

export interface CreateFormOptions {
  folderId?: string;
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

async function getFormsClient(): Promise<forms_v1.Forms> {
  const auth = await getAuthorizedClient();
  return google.forms({ version: "v1", auth });
}

async function getDriveClient(): Promise<drive_v3.Drive> {
  const auth = await getAuthorizedClient();
  return google.drive({ version: "v3", auth });
}

async function moveFormToFolder(
  formId: string,
  folderId: string,
): Promise<void> {
  const drive = await getDriveClient();
  const trimmedFolderId = folderId.trim();

  if (trimmedFolderId.length === 0) {
    return;
  }

  const current = await drive.files.get({
    fileId: formId,
    fields: "parents",
    supportsAllDrives: true,
  });

  const parentIds = current.data.parents ?? [];
  const removeParents = parentIds.length > 0 ? parentIds.join(",") : undefined;

  await drive.files.update({
    fileId: formId,
    addParents: trimmedFolderId,
    removeParents,
    fields: "id,parents",
    supportsAllDrives: true,
  });
}

function buildCreateRequests(quiz: QuizForm): forms_v1.Schema$Request[] {
  const requests: forms_v1.Schema$Request[] = [
    {
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: quiz.isQuiz ?? true,
          },
        },
        updateMask: "quizSettings.isQuiz",
      },
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
): Promise<QuizForm> {
  const forms = await getFormsClient();
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
    questions,
  };
}

export async function createGoogleFormFromQuiz(
  quiz: QuizForm,
  options?: CreateFormOptions,
): Promise<{ formId: string; responderUri?: string }> {
  const forms = await getFormsClient();

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

  if (options?.folderId) {
    await moveFormToFolder(formId, options.folderId);
  }

  const created = await forms.forms.get({ formId });

  return {
    formId,
    responderUri: created.data.responderUri ?? undefined,
  };
}

export async function updateGoogleFormFromQuiz(
  formId: string,
  quiz: QuizForm,
): Promise<{ formId: string; responderUri?: string }> {
  const forms = await getFormsClient();
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
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: quiz.isQuiz ?? true,
          },
        },
        updateMask: "quizSettings.isQuiz",
      },
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

  const updated = await forms.forms.get({ formId });

  return {
    formId,
    responderUri: updated.data.responderUri ?? undefined,
  };
}

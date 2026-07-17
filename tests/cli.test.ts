import { beforeEach, describe, expect, it, vi } from "vitest";

const yargsFactoryMock = vi.fn();
const hideBinMock = vi.fn();
const dotenvConfigMock = vi.fn();

const buildTemplateQuizFileMock = vi.fn();
const readQuizFileMock = vi.fn();
const writeQuizFileMock = vi.fn();
const downloadFormAsQuizFileMock = vi.fn();
const createGoogleFormFromQuizMock = vi.fn();
const updateGoogleFormFromQuizMock = vi.fn();
const trackDeploymentMock = vi.fn();
const getAuthorizedClientMock = vi.fn();

/** Stand-in for the OAuth2 client the CLI acquires and threads into the lib. */
const fakeAuthClient = { id: "auth" };

vi.mock("dotenv", () => ({
  default: {
    config: dotenvConfigMock,
  },
}));

vi.mock("yargs", () => ({
  default: yargsFactoryMock,
}));

vi.mock("yargs/helpers", () => ({
  hideBin: hideBinMock,
}));

vi.mock("../src/lib/quiz-file.js", () => ({
  buildTemplateQuizFile: buildTemplateQuizFileMock,
  readQuizFile: readQuizFileMock,
  writeQuizFile: writeQuizFileMock,
}));

vi.mock("../src/lib/google-forms.js", () => ({
  createGoogleFormFromQuiz: createGoogleFormFromQuizMock,
  downloadFormAsQuizFile: downloadFormAsQuizFileMock,
  updateGoogleFormFromQuiz: updateGoogleFormFromQuizMock,
}));

vi.mock("../src/lib/deployments.js", () => ({
  trackDeployment: trackDeploymentMock,
}));

vi.mock("../src/lib/google-auth.js", () => ({
  getAuthorizedClient: getAuthorizedClientMock,
}));

interface FakeCommandBuilder {
  option: (name: string, config: unknown) => FakeCommandBuilder;
}

function createFakeYargs(
  selectedCommand: string,
  argvForHandler: Record<string, string>,
) {
  const handlers = new Map<
    string,
    (argv: Record<string, string>) => Promise<void> | void
  >();

  const fakeCmd: FakeCommandBuilder = {
    option: () => fakeCmd,
  };

  const chain = {
    scriptName: () => chain,
    usage: () => chain,
    command: (
      name: string,
      _description: string,
      builder: (cmd: FakeCommandBuilder) => FakeCommandBuilder,
      handler: (argv: Record<string, string>) => Promise<void> | void,
    ) => {
      builder(fakeCmd);
      handlers.set(name, handler);
      return chain;
    },
    demandCommand: () => chain,
    strict: () => chain,
    help: () => chain,
    parseAsync: async () => {
      const handler = handlers.get(selectedCommand);
      if (!handler) {
        throw new Error(`Missing handler for command: ${selectedCommand}`);
      }
      await handler(argvForHandler);
    },
  };

  return chain;
}

function createFailingYargs(errorToThrow: unknown) {
  const chain = {
    scriptName: () => chain,
    usage: () => chain,
    command: () => chain,
    demandCommand: () => chain,
    strict: () => chain,
    help: () => chain,
    parseAsync: async () => {
      throw errorToThrow;
    },
  };

  return chain;
}

async function importCliModule() {
  vi.resetModules();
  await import("../src/cli.ts");
}

describe("cli command handlers", () => {
  beforeEach(() => {
    yargsFactoryMock.mockReset();
    hideBinMock.mockReset();
    dotenvConfigMock.mockReset();

    buildTemplateQuizFileMock.mockReset();
    readQuizFileMock.mockReset();
    writeQuizFileMock.mockReset();
    downloadFormAsQuizFileMock.mockReset();
    createGoogleFormFromQuizMock.mockReset();
    updateGoogleFormFromQuizMock.mockReset();
    trackDeploymentMock.mockReset();
    getAuthorizedClientMock.mockReset();
    getAuthorizedClientMock.mockResolvedValue(fakeAuthClient);

    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("runs init-template command", async () => {
    hideBinMock.mockReturnValue(["init-template", "--output", "quiz.yaml"]);
    yargsFactoryMock.mockImplementation(() =>
      createFakeYargs("init-template", { output: "quiz.yaml" }),
    );

    const template = { version: 1, title: "Quiz", questions: [] };
    buildTemplateQuizFileMock.mockReturnValue(template);

    await importCliModule();

    expect(dotenvConfigMock).toHaveBeenCalledTimes(1);
    expect(buildTemplateQuizFileMock).toHaveBeenCalledTimes(1);
    expect(writeQuizFileMock).toHaveBeenCalledWith("quiz.yaml", template);
  });

  it("runs download command", async () => {
    hideBinMock.mockReturnValue([
      "download",
      "--form-id",
      "form-1",
      "--output",
      "quiz.yaml",
    ]);
    yargsFactoryMock.mockImplementation(() =>
      createFakeYargs("download", { "form-id": "form-1", output: "quiz.yaml" }),
    );

    const quiz = { version: 1, title: "Quiz", questions: [] };
    downloadFormAsQuizFileMock.mockResolvedValue(quiz);

    await importCliModule();

    expect(downloadFormAsQuizFileMock).toHaveBeenCalledWith("form-1", {
      auth: fakeAuthClient,
    });
    expect(writeQuizFileMock).toHaveBeenCalledWith("quiz.yaml", quiz);
  });

  it("runs create command and tracks deployment including optional folder", async () => {
    hideBinMock.mockReturnValue([
      "create",
      "--input",
      "quiz.yaml",
      "--folder-id",
      "folder-123",
    ]);
    yargsFactoryMock.mockImplementation(() =>
      createFakeYargs("create", {
        input: "quiz.yaml",
        "folder-id": "folder-123",
      }),
    );

    const quiz = { version: 1, title: "Quiz", questions: [] };
    readQuizFileMock.mockResolvedValue(quiz);
    createGoogleFormFromQuizMock.mockResolvedValue({
      formId: "form-1",
      responderUri: "https://example.com/form",
    });
    trackDeploymentMock.mockResolvedValue(".deployments/deployments.json");

    await importCliModule();

    expect(readQuizFileMock).toHaveBeenCalledWith("quiz.yaml");
    expect(createGoogleFormFromQuizMock).toHaveBeenCalledWith(quiz, {
      auth: fakeAuthClient,
      folderId: "folder-123",
    });
    expect(trackDeploymentMock).toHaveBeenCalledWith({
      title: "Quiz",
      formId: "form-1",
      responderUrl: "https://example.com/form",
      folderId: "folder-123",
    });
  });

  it("runs update command", async () => {
    hideBinMock.mockReturnValue([
      "update",
      "--form-id",
      "form-1",
      "--input",
      "quiz.yaml",
    ]);
    yargsFactoryMock.mockImplementation(() =>
      createFakeYargs("update", { "form-id": "form-1", input: "quiz.yaml" }),
    );

    const quiz = { version: 1, title: "Quiz", questions: [] };
    readQuizFileMock.mockResolvedValue(quiz);
    updateGoogleFormFromQuizMock.mockResolvedValue({
      formId: "form-1",
      responderUri: "https://example.com/form",
    });

    await importCliModule();

    expect(readQuizFileMock).toHaveBeenCalledWith("quiz.yaml");
    expect(updateGoogleFormFromQuizMock).toHaveBeenCalledWith("form-1", quiz, {
      auth: fakeAuthClient,
    });
  });

  it("logs and exits on parse error", async () => {
    hideBinMock.mockReturnValue(["create", "--input", "quiz.yaml"]);
    yargsFactoryMock.mockImplementation(() => createFailingYargs("bad parse"));

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await importCliModule();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(console.error).toHaveBeenCalledWith("Error: bad parse");
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  it("logs Error instance message on parse failure", async () => {
    hideBinMock.mockReturnValue(["create", "--input", "quiz.yaml"]);
    yargsFactoryMock.mockImplementation(() =>
      createFailingYargs(new Error("boom")),
    );

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await importCliModule();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(console.error).toHaveBeenCalledWith("Error: boom");
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});

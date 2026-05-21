import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { trackDeployment } from "../src/lib/deployments.js";

let originalCwd = "";
let tempDir = "";

describe("trackDeployment", () => {
  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "deployments-test-"));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("creates deployments file and writes first record", async () => {
    const outputPath = await trackDeployment({
      title: "Quiz 1",
      formId: "form-1",
      responderUrl: "https://example.com/form-1",
    });

    expect(outputPath).toBe(path.join(".deployments", "deployments.json"));

    const raw = await fs.readFile(outputPath, "utf8");
    const parsed = JSON.parse(raw) as Array<Record<string, string>>;

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.title).toBe("Quiz 1");
    expect(parsed[0]?.formId).toBe("form-1");
    expect(parsed[0]?.deployedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("appends records and stores optional folderId", async () => {
    await trackDeployment({
      title: "Quiz 1",
      formId: "form-1",
      responderUrl: "https://example.com/form-1",
    });

    await trackDeployment({
      title: "Quiz 2",
      formId: "form-2",
      responderUrl: "https://example.com/form-2",
      folderId: "folder-123",
    });

    const raw = await fs.readFile(
      path.join(".deployments", "deployments.json"),
      "utf8",
    );
    const parsed = JSON.parse(raw) as Array<Record<string, string>>;

    expect(parsed).toHaveLength(2);
    expect(parsed[1]?.title).toBe("Quiz 2");
    expect(parsed[1]?.folderId).toBe("folder-123");
  });

  it("handles malformed existing file formats and keeps valid entries only", async () => {
    await fs.mkdir(".deployments", { recursive: true });

    await fs.writeFile(
      path.join(".deployments", "deployments.json"),
      JSON.stringify({ not: "an-array" }),
      "utf8",
    );

    await trackDeployment({
      title: "Quiz 1",
      formId: "form-1",
      responderUrl: "https://example.com/form-1",
    });

    await fs.writeFile(
      path.join(".deployments", "deployments.json"),
      JSON.stringify([
        null,
        { title: "Missing ID" },
        {
          title: "Bad Folder",
          formId: "form-bad",
          deployedAt: "2026-01-01T00:00:00.000Z",
          folderId: 42,
        },
        {
          title: "Keep Me",
          formId: "form-keep",
          deployedAt: "2026-01-01T00:00:00.000Z",
        },
      ]),
      "utf8",
    );

    await trackDeployment({
      title: "Quiz 2",
      formId: "form-2",
      responderUrl: "https://example.com/form-2",
    });

    const raw = await fs.readFile(
      path.join(".deployments", "deployments.json"),
      "utf8",
    );
    const parsed = JSON.parse(raw) as Array<Record<string, string>>;

    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.title).toBe("Keep Me");
    expect(parsed[1]?.title).toBe("Quiz 2");
  });
});

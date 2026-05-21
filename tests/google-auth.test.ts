import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authenticateMock = vi.fn();

vi.mock("@google-cloud/local-auth", () => ({
  authenticate: authenticateMock,
}));

let originalEnvCredentials = "";
let originalEnvToken = "";
let tempDir = "";
let originalCwd = "";

async function importAuthModule() {
  vi.resetModules();
  return import("../src/lib/google-auth.js");
}

describe("getAuthorizedClient", () => {
  beforeEach(async () => {
    authenticateMock.mockReset();

    originalEnvCredentials = process.env.GOOGLE_CREDENTIALS_PATH ?? "";
    originalEnvToken = process.env.GOOGLE_TOKEN_PATH ?? "";
    originalCwd = process.cwd();

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "google-auth-test-"));
    process.env.GOOGLE_CREDENTIALS_PATH = path.join(
      tempDir,
      "credentials.json",
    );
    process.env.GOOGLE_TOKEN_PATH = path.join(
      tempDir,
      "tokens",
      "google-oauth.json",
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
    process.chdir(originalCwd);
  });

  it("uses saved token when available", async () => {
    await fs.mkdir(path.join(tempDir, "tokens"), { recursive: true });
    await fs.writeFile(
      path.join(tempDir, "tokens", "google-oauth.json"),
      JSON.stringify({
        type: "authorized_user",
        client_id: "client-id",
        client_secret: "client-secret",
        refresh_token: "refresh-token",
      }),
      "utf8",
    );

    const { getAuthorizedClient } = await importAuthModule();
    const client = await getAuthorizedClient();

    expect(client.credentials.refresh_token).toBe("refresh-token");
    expect(authenticateMock).not.toHaveBeenCalled();
  });

  it("authenticates and writes token when no saved token exists", async () => {
    await fs.writeFile(
      path.join(tempDir, "credentials.json"),
      JSON.stringify({
        installed: {
          client_id: "installed-client-id",
          client_secret: "installed-client-secret",
        },
      }),
      "utf8",
    );

    authenticateMock.mockResolvedValue({
      credentials: {
        refresh_token: "new-refresh-token",
      },
    });

    const { getAuthorizedClient } = await importAuthModule();
    await getAuthorizedClient();

    expect(authenticateMock).toHaveBeenCalledTimes(1);
    const authCall = authenticateMock.mock.calls[0]?.[0] as {
      keyfilePath: string;
      scopes: string[];
    };
    expect(authCall.keyfilePath).toBe(path.join(tempDir, "credentials.json"));
    expect(authCall.scopes).toContain(
      "https://www.googleapis.com/auth/drive.file",
    );

    const savedTokenRaw = await fs.readFile(
      path.join(tempDir, "tokens", "google-oauth.json"),
      "utf8",
    );
    const savedToken = JSON.parse(savedTokenRaw) as Record<string, string>;

    expect(savedToken.client_id).toBe("installed-client-id");
    expect(savedToken.client_secret).toBe("installed-client-secret");
    expect(savedToken.refresh_token).toBe("new-refresh-token");
  });

  it("throws when auth does not return a refresh token", async () => {
    await fs.writeFile(
      path.join(tempDir, "credentials.json"),
      JSON.stringify({
        installed: {
          client_id: "installed-client-id",
          client_secret: "installed-client-secret",
        },
      }),
      "utf8",
    );

    authenticateMock.mockResolvedValue({
      credentials: {},
    });

    const { getAuthorizedClient } = await importAuthModule();

    await expect(getAuthorizedClient()).rejects.toThrow("refresh token");
  });

  it("falls back to authenticate when saved token is missing required fields", async () => {
    await fs.mkdir(path.join(tempDir, "tokens"), { recursive: true });
    await fs.writeFile(
      path.join(tempDir, "tokens", "google-oauth.json"),
      JSON.stringify({
        type: "authorized_user",
        client_id: "client-id",
        client_secret: "client-secret",
      }),
      "utf8",
    );

    await fs.writeFile(
      path.join(tempDir, "credentials.json"),
      JSON.stringify({
        installed: {
          client_id: "installed-client-id",
          client_secret: "installed-client-secret",
        },
      }),
      "utf8",
    );

    authenticateMock.mockResolvedValue({
      credentials: {
        refresh_token: "new-refresh-token",
      },
    });

    const { getAuthorizedClient } = await importAuthModule();
    const client = await getAuthorizedClient();

    expect(authenticateMock).toHaveBeenCalledTimes(1);
    expect(client.credentials.refresh_token).toBe("new-refresh-token");
  });

  it("throws when credentials file has no installed or web client", async () => {
    await fs.writeFile(
      path.join(tempDir, "credentials.json"),
      JSON.stringify({}),
      "utf8",
    );

    authenticateMock.mockResolvedValue({
      credentials: {
        refresh_token: "new-refresh-token",
      },
    });

    const { getAuthorizedClient } = await importAuthModule();

    await expect(getAuthorizedClient()).rejects.toThrow(
      "expected installed or web client data",
    );
  });

  it("uses default credential/token paths when env vars are unset", async () => {
    delete process.env.GOOGLE_CREDENTIALS_PATH;
    delete process.env.GOOGLE_TOKEN_PATH;

    process.chdir(tempDir);
    await fs.writeFile(
      path.join(tempDir, "credentials.json"),
      JSON.stringify({
        installed: {
          client_id: "installed-client-id",
          client_secret: "installed-client-secret",
        },
      }),
      "utf8",
    );

    authenticateMock.mockResolvedValue({
      credentials: {
        refresh_token: "new-refresh-token",
      },
    });

    const { getAuthorizedClient } = await importAuthModule();
    await getAuthorizedClient();

    const savedTokenRaw = await fs.readFile(
      path.join(tempDir, "tokens", "google-oauth.json"),
      "utf8",
    );
    const savedToken = JSON.parse(savedTokenRaw) as Record<string, string>;
    expect(savedToken.refresh_token).toBe("new-refresh-token");
  });
});

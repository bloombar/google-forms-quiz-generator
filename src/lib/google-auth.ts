import fs from "node:fs/promises";
import path from "node:path";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/forms.body",
  "https://www.googleapis.com/auth/forms.body.readonly",
];

function getCredentialsPath(): string {
  return process.env.GOOGLE_CREDENTIALS_PATH ?? "credentials.json";
}

function getTokenPath(): string {
  return process.env.GOOGLE_TOKEN_PATH ?? "tokens/google-oauth.json";
}

async function loadSavedToken(tokenPath: string): Promise<OAuth2Client | null> {
  try {
    const raw = await fs.readFile(tokenPath, "utf8");
    const parsed = JSON.parse(raw) as {
      client_id?: string;
      client_secret?: string;
      refresh_token?: string;
      type?: string;
    };

    if (!parsed.client_id || !parsed.client_secret || !parsed.refresh_token) {
      return null;
    }

    const client = new OAuth2Client(parsed.client_id, parsed.client_secret);
    client.setCredentials({
      refresh_token: parsed.refresh_token,
    });
    return client;
  } catch {
    return null;
  }
}

async function saveToken(
  client: OAuth2Client,
  tokenPath: string,
  credentialsPath: string,
): Promise<void> {
  const credentialsRaw = await fs.readFile(credentialsPath, "utf8");
  const credentialsParsed = JSON.parse(credentialsRaw) as {
    installed?: { client_id: string; client_secret: string };
    web?: { client_id: string; client_secret: string };
  };

  const selected = credentialsParsed.installed ?? credentialsParsed.web;
  if (!selected) {
    throw new Error(
      "Invalid credentials.json format: expected installed or web client data.",
    );
  }

  const refreshToken = client.credentials.refresh_token;
  if (!refreshToken) {
    throw new Error(
      "OAuth did not return a refresh token. Revoke access and try again.",
    );
  }

  await fs.mkdir(path.dirname(tokenPath), { recursive: true });
  await fs.writeFile(
    tokenPath,
    JSON.stringify(
      {
        type: "authorized_user",
        client_id: selected.client_id,
        client_secret: selected.client_secret,
        refresh_token: refreshToken,
      },
      null,
      2,
    ),
    "utf8",
  );
}

export async function getAuthorizedClient(): Promise<OAuth2Client> {
  const credentialsPath = getCredentialsPath();
  const tokenPath = getTokenPath();

  const existing = await loadSavedToken(tokenPath);
  if (existing) {
    return existing;
  }

  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: credentialsPath,
  });

  await saveToken(client, tokenPath, credentialsPath);
  return client;
}

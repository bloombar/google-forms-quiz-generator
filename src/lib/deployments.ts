import fs from "node:fs/promises";
import path from "node:path";

const DEPLOYMENTS_DIR = ".deployments";
const DEPLOYMENTS_FILE = "deployments.json";

export interface DeploymentRecord {
  title: string;
  formId: string;
  responderUrl?: string;
  folderId?: string;
  deployedAt: string;
}

function getDeploymentsPath(): string {
  return path.join(DEPLOYMENTS_DIR, DEPLOYMENTS_FILE);
}

async function readDeploymentRecords(
  deploymentsPath: string,
): Promise<DeploymentRecord[]> {
  try {
    const raw = await fs.readFile(deploymentsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is DeploymentRecord => {
      if (typeof item !== "object" || item === null) {
        return false;
      }

      const candidate = item as Partial<DeploymentRecord>;
      return (
        typeof candidate.title === "string" &&
        typeof candidate.formId === "string" &&
        (candidate.folderId === undefined ||
          typeof candidate.folderId === "string") &&
        typeof candidate.deployedAt === "string"
      );
    });
  } catch {
    return [];
  }
}

export async function trackDeployment(
  deployment: Omit<DeploymentRecord, "deployedAt">,
): Promise<string> {
  const deploymentsPath = getDeploymentsPath();
  const deploymentsDir = path.dirname(deploymentsPath);

  await fs.mkdir(deploymentsDir, { recursive: true });

  const existing = await readDeploymentRecords(deploymentsPath);
  const nextRecord: DeploymentRecord = {
    ...deployment,
    deployedAt: new Date().toISOString(),
  };

  existing.push(nextRecord);

  await fs.writeFile(
    deploymentsPath,
    `${JSON.stringify(existing, null, 2)}\n`,
    "utf8",
  );

  return deploymentsPath;
}

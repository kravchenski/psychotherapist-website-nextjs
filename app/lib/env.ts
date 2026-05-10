type AdminEnv = {
  username?: string;
  password?: string;
  sessionSecret?: string;
};

type DeployEnv = {
  deployHookUrl?: string;
  mode: "hook" | "unconfigured";
};

const DATABASE_URL_CANDIDATES = [
  "DATABASE_URL",
  "PRISMA_DATABASE_URL",
  "POSTGRES_URL",
] as const;

const DATABASE_URL_PLACEHOLDER_FRAGMENTS = [
  "USER:PASSWORD@HOST",
  "HOST:5432/DATABASE",
  "enter-your-database-url-here",
] as const;

const SSL_MODES_THAT_NOW_MAP_TO_VERIFY_FULL = new Set([
  "prefer",
  "require",
  "verify-ca",
]);

function isConfiguredDatabaseUrl(value: string) {
  return !DATABASE_URL_PLACEHOLDER_FRAGMENTS.some((fragment) => value.includes(fragment));
}

function normalizeDatabaseUrl(value: string) {
  try {
    const url = new URL(value);
    const sslMode = url.searchParams.get("sslmode");
    const useLibpqCompat = url.searchParams.get("uselibpqcompat");

    if (
      sslMode &&
      SSL_MODES_THAT_NOW_MAP_TO_VERIFY_FULL.has(sslMode) &&
      useLibpqCompat !== "true"
    ) {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }
  } catch {
    return value;
  }

  return value;
}

export function getAdminEnv(): AdminEnv {
  return {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.ADMIN_SESSION_SECRET,
  };
}

export function getDatabaseUrl() {
  for (const key of DATABASE_URL_CANDIDATES) {
    const value = process.env[key]?.trim();
    if (value && isConfiguredDatabaseUrl(value)) {
      return normalizeDatabaseUrl(value);
    }
  }

  return undefined;
}

export function getBranchEnv() {
  return (
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "master"
  );
}

export function getDeployEnv(): DeployEnv {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL || process.env.DEPLOY_HOOK_URL;
  const hasDeployHook = Boolean(deployHookUrl);

  return {
    deployHookUrl,
    mode: hasDeployHook ? "hook" : "unconfigured",
  };
}

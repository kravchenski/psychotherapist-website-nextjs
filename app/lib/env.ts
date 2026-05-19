type AdminEnv = {
  username?: string;
  password?: string;
  sessionSecret?: string;
  isConfigured: boolean;
};

type DeployEnv = {
  deployHookUrl?: string;
  mode: "hook" | "unconfigured";
};

export function getAdminEnv(): AdminEnv {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const isConfigured = Boolean(
    username &&
      password &&
      sessionSecret &&
      password.length >= 12 &&
      sessionSecret.length >= 32 &&
      password !== "admin" &&
      password !== "change-me" &&
      sessionSecret !== "replace-with-a-long-random-secret",
  );

  return {
    username,
    password,
    sessionSecret,
    isConfigured,
  };
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

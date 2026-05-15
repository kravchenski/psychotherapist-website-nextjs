type AdminEnv = {
  username?: string;
  password?: string;
  sessionSecret?: string;
};

type DeployEnv = {
  deployHookUrl?: string;
  mode: "hook" | "unconfigured";
};

export function getAdminEnv(): AdminEnv {
  return {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.ADMIN_SESSION_SECRET,
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

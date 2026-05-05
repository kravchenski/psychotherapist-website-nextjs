type AdminEnv = {
  username?: string;
  password?: string;
  sessionSecret?: string;
};

type DeployEnv = {
  host?: string;
  user: string;
  password?: string;
  path: string;
  port: string;
  targetLabel: string;
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
  const host = process.env.DEPLOY_HOST;
  const user = process.env.DEPLOY_USER || "root";
  const path = process.env.DEPLOY_PATH || "/var/www/html";
  const port = process.env.DEPLOY_PORT || "22";

  return {
    host,
    user,
    password: process.env.DEPLOY_PASSWORD,
    path,
    port,
    targetLabel: host ? `${user}@${host}:${path}` : path,
  };
}

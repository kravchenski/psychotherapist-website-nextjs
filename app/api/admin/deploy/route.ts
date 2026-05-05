import { NextResponse } from "next/server";
import { execFileSync, type ExecFileSyncOptions } from "child_process";
import { verifyAdminRequest } from "@/app/lib/adminSession";
import { getAdminEnv, getDeployEnv } from "@/app/lib/env";

export const dynamic = "force-dynamic";

function escapeForDoubleQuotes(value: string) {
  return value.replace(/(["\\$`])/g, "\\$1");
}

function normalizeRemoteDir(remoteDir: string) {
  if (remoteDir === "~") {
    return "$HOME";
  }

  if (remoteDir.startsWith("~/")) {
    return `$HOME/${remoteDir.slice(2)}`;
  }

  return remoteDir;
}

function getCleanBuildEnv() {
  const env = { ...process.env };

  delete env.TURBOPACK;
  delete env.NEXT_DISABLE_TURBOPACK;

  env.NODE_ENV = "production";

  return env;
}

function runCommand(command: string, args: string[], options?: ExecFileSyncOptions) {
  execFileSync(command, args, {
    stdio: "inherit",
    ...options,
  });
}

function runRemoteCommand(password: string, port: string, user: string, host: string, command: string) {
  runCommand("sshpass", [
    "-p",
    password,
    "ssh",
    "-o",
    "StrictHostKeyChecking=no",
    "-p",
    port,
    `${user}@${host}`,
    command,
  ]);
}

export async function POST(request: Request) {
  let stepsCompleted = 0;

  try {
    const isAuthenticated = await verifyAdminRequest(
      request.headers.get("cookie") || "",
      getAdminEnv().sessionSecret,
    );

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deployEnv = getDeployEnv();

    if (!deployEnv.host || !deployEnv.password) {
      return NextResponse.json(
        {
          success: false,
          error: "DEPLOY_HOST or DEPLOY_PASSWORD is not configured in .env",
          stepsCompleted,
        },
        { status: 400 },
      );
    }

    runCommand("sshpass", ["-V"]);

    console.log("Step 1/4: Starting build process...");
    runCommand("npm", ["run", "build"], { env: getCleanBuildEnv() });
    stepsCompleted = 1;

    console.log("Step 2/4: Exporting static files...");
    runCommand("npm", ["run", "export"], { env: getCleanBuildEnv() });
    stepsCompleted = 2;

    const remoteDir = normalizeRemoteDir(deployEnv.path);
    const escapedRemoteDir = escapeForDoubleQuotes(remoteDir);

    console.log("Step 3/4: Preparing remote directory...");
    runRemoteCommand(
      deployEnv.password,
      deployEnv.port,
      deployEnv.user,
      deployEnv.host,
      `mkdir -p "${escapedRemoteDir}" && find "${escapedRemoteDir}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +`,
    );
    stepsCompleted = 3;

    console.log("Step 4/4: Uploading files...");
    runCommand("sshpass", [
      "-p",
      deployEnv.password,
      "scp",
      "-o",
      "StrictHostKeyChecking=no",
      "-P",
      deployEnv.port,
      "-r",
      "out/.",
      `${deployEnv.user}@${deployEnv.host}:${deployEnv.path}`,
    ]);
    stepsCompleted = 4;

    return NextResponse.json(
      {
        success: true,
        message: `Создана папка out с новым index.html, файлы отправлены на ${deployEnv.targetLabel}`,
        stepsCompleted,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Deployment error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown deployment error",
        stepsCompleted,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

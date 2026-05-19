import { NextResponse } from "next/server";
import { verifyConfiguredAdminRequest } from "@/app/lib/adminSession";
import { getAdminEnv, getDeployEnv } from "@/app/lib/env";

export const dynamic = "force-dynamic";

async function triggerDeployHook(deployHookUrl: string) {
  const response = await fetch(deployHookUrl, {
    method: "POST",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Deploy Hook failed with status ${response.status}`);
  }
}

export async function POST(request: Request) {
  let stepsCompleted = 0;

  try {
    const isAuthenticated = await verifyConfiguredAdminRequest(
      request.headers.get("cookie") || "",
      getAdminEnv(),
    );

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deployEnv = getDeployEnv();

    if (deployEnv.mode === "unconfigured") {
      return NextResponse.json(
        {
          success: false,
          error: "Deploy is not configured. Set VERCEL_DEPLOY_HOOK_URL.",
          stepsCompleted,
        },
        { status: 400 },
      );
    }

    await triggerDeployHook(deployEnv.deployHookUrl!);
    stepsCompleted = 1;

    return NextResponse.json(
      {
        success: true,
        message: "Deploy Hook успешно вызван. Vercel начал новый deploy проекта.",
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

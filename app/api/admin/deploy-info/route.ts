import { NextResponse } from "next/server";
import { verifyConfiguredAdminRequest } from "@/app/lib/adminSession";
import { getAdminEnv, getDeployEnv } from "@/app/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const isAuthenticated = await verifyConfiguredAdminRequest(
      request.headers.get("cookie") || "",
      getAdminEnv(),
    );

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deployEnv = getDeployEnv();

    return NextResponse.json({
      success: true,
      deployMode: deployEnv.mode,
      isConfigured: deployEnv.mode !== "unconfigured",
    }, { status: 200 });
  } catch {
    return NextResponse.json({
      success: false,
      error: "Failed to get deployment info",
    }, { status: 500 });
  }
}

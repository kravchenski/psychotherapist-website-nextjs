import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/app/lib/adminSession";
import { getAdminEnv, getDeployEnv } from "@/app/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const isAuthenticated = await verifyAdminRequest(
      request.headers.get("cookie") || "",
      getAdminEnv().sessionSecret,
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

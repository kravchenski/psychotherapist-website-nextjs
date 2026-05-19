import { NextRequest, NextResponse } from "next/server";
import { verifyConfiguredAdminRequest } from "@/app/lib/adminSession";
import { getAdminEnv } from "@/app/lib/env";
import { getHomeContent, isHomeContent, saveHomeContent } from "@/app/lib/contentStore";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  return verifyConfiguredAdminRequest(
    request.headers.get("cookie") || "",
    getAdminEnv(),
  );
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await requireAdmin(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const content = await getHomeContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error reading content:", error);
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await requireAdmin(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!isHomeContent(data)) {
      return NextResponse.json(
        { error: "Invalid content structure" },
        { status: 400 }
      );
    }

    await saveHomeContent(data);

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

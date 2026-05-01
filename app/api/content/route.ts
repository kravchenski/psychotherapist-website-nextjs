import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/app/lib/adminSession";
import { getAdminEnv } from "@/app/lib/env";

const CONTENT_DIR = join(process.cwd(), "content");

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const { sessionSecret: ADMIN_SESSION_SECRET } = getAdminEnv();

  if (!ADMIN_SESSION_SECRET) {
    return false;
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE_NAME}=`))
    ?.slice(ADMIN_SESSION_COOKIE_NAME.length + 1);

  return await verifyAdminSessionToken(token, ADMIN_SESSION_SECRET);
}

export async function GET() {
  try {
    const filePath = join(CONTENT_DIR, "home.json");
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
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
    // Check if user is authenticated
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const filePath = join(CONTENT_DIR, "home.json");

    // Validate the data structure
    if (!data.hero || !data.about || !data.services || !data.contacts) {
      return NextResponse.json(
        { error: "Invalid content structure" },
        { status: 400 }
      );
    }

    await writeFile(filePath, JSON.stringify(data, null, 2));

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

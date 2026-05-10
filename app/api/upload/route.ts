import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyAdminRequest } from "@/app/lib/adminSession";
import { getAdminEnv } from "@/app/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminRequest(
      request.headers.get("cookie") || "",
      getAdminEnv().sessionSecret,
    );
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 500 }
      );
    }

    const extension = file.name.includes(".") ? file.name.split(".").pop() : undefined;
    const safeBaseName = (file.name.replace(/\.[^.]+$/, "") || "photo")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "photo";
    const pathname = `uploads/${Date.now()}-${safeBaseName}${extension ? `.${extension}` : ""}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

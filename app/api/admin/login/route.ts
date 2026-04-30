import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
} from "../../../lib/adminSession";
import { getAdminEnv } from "../../../lib/env";

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}

function getClientIp(request: NextRequest) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function timingSafeMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isSameOrigin(request: NextRequest) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!host) {
    return false;
  }

  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return true;
}

// Validate input type and length
function validateInput(input: unknown): input is { username?: string; password?: string } {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const obj = input as Record<string, unknown>;

  if (
    (obj.username !== undefined && typeof obj.username !== "string") ||
    (obj.password !== undefined && typeof obj.password !== "string")
  ) {
    return false;
  }

  // Limit input length to prevent DoS
  const username = (obj.username as string) || "";
  const password = (obj.password as string) || "";

  return username.length <= 256 && password.length <= 256;
}

export async function POST(request: NextRequest) {
  const {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    sessionSecret: ADMIN_SESSION_SECRET,
  } = getAdminEnv();

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Admin is not configured" },
      { status: 500 },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!validateInput(payload)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const username = payload.username ?? "";
  const password = payload.password ?? "";

  const usernameOk = timingSafeMatch(username, ADMIN_USERNAME);
  const passwordOk = timingSafeMatch(password, ADMIN_PASSWORD);

  if (!usernameOk || !passwordOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const maxAgeSeconds = getAdminSessionMaxAgeSeconds();
  const adminSessionToken = await createAdminSessionToken(
    ADMIN_SESSION_SECRET,
    Date.now(),
    maxAgeSeconds,
  );
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: adminSessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeSeconds,
  });

  return response;
}

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
} from "../../../lib/adminSession";

function timingSafeMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local." },
      { status: 500 },
    );
  }

  let payload: { username?: string; password?: string } = {};

  try {
    payload = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const username = payload.username ?? "";
  const password = payload.password ?? "";

  const usernameOk = timingSafeMatch(username, ADMIN_USERNAME);
  const passwordOk = timingSafeMatch(password, ADMIN_PASSWORD);

  if (!usernameOk || !passwordOk) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const adminSessionToken = await createAdminSessionToken(ADMIN_SESSION_SECRET);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: adminSessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
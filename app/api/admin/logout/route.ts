import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, shouldUseSecureAdminCookie } from "../../../lib/adminSession";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: shouldUseSecureAdminCookie(request.headers, request.url),
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}

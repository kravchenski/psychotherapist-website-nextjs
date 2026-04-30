import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "../../../lib/adminSession";
import { getAdminEnv } from "../../../lib/env";

export async function GET(request: Request) {
  const {
    username: ADMIN_USERNAME,
    sessionSecret: ADMIN_SESSION_SECRET,
  } = getAdminEnv();

  if (!ADMIN_SESSION_SECRET || !ADMIN_USERNAME) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 500 });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE_NAME}=`))
    ?.slice(ADMIN_SESSION_COOKIE_NAME.length + 1);

  const isValid = await verifyAdminSessionToken(token, ADMIN_SESSION_SECRET);

  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: ADMIN_USERNAME,
      role: "admin",
    },
  });
}

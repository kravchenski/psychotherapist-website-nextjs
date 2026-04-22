import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "./app/lib/adminSession";

const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

async function isAuthorized(request: NextRequest) {
  if (!ADMIN_SESSION_SECRET) {
    return false;
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token, ADMIN_SESSION_SECRET);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const authorized = await isAuthorized(request);

  if (pathname === "/admin") {
    if (authorized) {
      return NextResponse.redirect(new URL("/admin/index.html", request.url));
    }

    return NextResponse.next();
  }

  if (!authorized) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
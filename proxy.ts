import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "./app/lib/adminSession";
import { getAdminEnv } from "./app/lib/env";

const { sessionSecret: ADMIN_SESSION_SECRET } = getAdminEnv();

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const apiRequests = new Map<string, { count: number; resetTime: number }>();
const API_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_API_REQUESTS = 120;

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

function checkApiRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = apiRequests.get(key);

  if (!bucket || now > bucket.resetTime) {
    apiRequests.set(key, { count: 1, resetTime: now + API_RATE_LIMIT_WINDOW });
    return true;
  }

  if (bucket.count >= MAX_API_REQUESTS) {
    return false;
  }

  bucket.count++;
  return true;
}

function getClientIp(request: NextRequest) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

async function isAuthorized(request: NextRequest) {
  if (!ADMIN_SESSION_SECRET) {
    return false;
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token, ADMIN_SESSION_SECRET);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  if (pathname.startsWith("/api/") && pathname !== "/api/admin/login") {
    if (!checkApiRateLimit(ip)) {
      const response = NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 },
      );
      addSecurityHeaders(response, pathname);
      return response;
    }
  }

  // Rate limiting for login endpoint
  if (request.method === "POST" && pathname === "/api/admin/login") {
    if (!checkRateLimit(ip)) {
      const response = NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        { status: 429 },
      );
        addSecurityHeaders(response, pathname);
      return response;
    }
  }

  if (!pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    addSecurityHeaders(response, pathname);
    return response;
  }

  const authorized = await isAuthorized(request);

  if (pathname === "/admin") {
    if (authorized) {
      const response = NextResponse.redirect(new URL("/admin/index.html", request.url));
        addSecurityHeaders(response, pathname);
      return response;
    }

    const response = NextResponse.next();
      addSecurityHeaders(response, pathname);
    return response;
  }

  if (!authorized) {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    addSecurityHeaders(response, pathname);
    return response;
  }

  const response = NextResponse.next();
  addSecurityHeaders(response, pathname);
  return response;
}

function addSecurityHeaders(response: NextResponse, pathname = "") {
  const allowTinaDevAssets = pathname.startsWith("/admin");
  const devViteOrigin = "http://localhost:4001";
  const devWsOrigin = "ws://localhost:4001";

  const scriptSrc = allowTinaDevAssets
    ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${devViteOrigin}; script-src-elem 'self' 'unsafe-inline' ${devViteOrigin}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: ${devViteOrigin} ${devWsOrigin}; frame-ancestors 'none';`
    : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';";

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Content-Security-Policy", scriptSrc);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|woff|woff2)$).*)",
  ],
};

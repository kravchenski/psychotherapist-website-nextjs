import type { NextApiRequest, NextApiResponse } from "next";
import { TinaNodeBackend } from "@tinacms/datalayer";
import databaseClient from "../../../tina/__generated__/databaseClient";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "../../../app/lib/adminSession";
import { getAdminEnv } from "../../../app/lib/env";

const { sessionSecret: ADMIN_SESSION_SECRET } = getAdminEnv();

function readCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) {
    return undefined;
  }

  const parts = cookieHeader.split(";");

  for (const part of parts) {
    const [key, ...valueParts] = part.trim().split("=");

    if (key === name) {
      return valueParts.join("=");
    }
  }

  return undefined;
}

/**
 * Self-hosted auth provider that verifies the signed admin session cookie.
 */
let cachedHandler: ReturnType<typeof TinaNodeBackend> | null = null;

function createHandler() {
  if (cachedHandler) return cachedHandler;

  cachedHandler = TinaNodeBackend({
    authProvider: {
      async isAuthorized(req) {
        if (!ADMIN_SESSION_SECRET) {
          return {
            isAuthorized: false,
            errorMessage: "Admin is not configured",
            errorCode: 500,
          };
        }

        const token = readCookieValue(req.headers.cookie, ADMIN_SESSION_COOKIE_NAME);
        const isAuthorized = await verifyAdminSessionToken(token, ADMIN_SESSION_SECRET);

        if (!isAuthorized) {
          return {
            isAuthorized: false,
            errorMessage: "Unauthorized",
            errorCode: 401,
          };
        }

        return { isAuthorized: true };
      },
    },
    databaseClient,
  });

  return cachedHandler;
}

/**
 * Prevent GraphQL introspection queries in production to avoid schema leakage.
 */
function isIntrospectionQuery(body: string): boolean {
  try {
    const parsed = JSON.parse(body);
    const query = parsed?.query ?? "";
    return /(__schema|__type|introspectionQuery)/.test(query);
  } catch {
    return false;
  }
}

/**
 * API Route handler
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Block GraphQL introspection in production to prevent schema leakage
  if (process.env.NODE_ENV === "production" && req.method === "POST") {
    let bodyStr = "";

    if (typeof req.body === "string") {
      bodyStr = req.body;
    } else {
      try {
        bodyStr = JSON.stringify(req.body);
      } catch {
        bodyStr = "";
      }
    }

    if (isIntrospectionQuery(bodyStr)) {
      return res.status(403).json({
        errors: [{ message: "Introspection queries are not allowed" }],
      });
    }
  }

  const tinaHandler = createHandler();
  return tinaHandler(req, res);
}

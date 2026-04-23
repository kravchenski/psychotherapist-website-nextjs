import type { NextApiRequest, NextApiResponse } from "next";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import databaseClient from "../../../tina/__generated__/databaseClient";

/**
 * Always use LocalBackendAuthProvider — no Tina Cloud or Auth.js required.
 * Authentication is handled by the custom /admin login page and session cookie.
 */
let cachedHandler: any = null;

function createHandler() {
  if (cachedHandler) return cachedHandler;

  cachedHandler = TinaNodeBackend({
    authProvider: LocalBackendAuthProvider(),
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

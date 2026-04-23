import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import type { NextApiRequest, NextApiResponse } from "next";

import databaseClient from "../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const nextAuthSecret = process.env.NEXTAUTH_SECRET || "replace-this-secret-in-production";

// Block introspection queries in production to prevent schema leakage
function isIntrospectionQuery(body: string): boolean {
  try {
    const query = JSON.parse(body).query || "";
    return /(__schema|__type|introspectionQuery)/.test(query);
  } catch {
    return false;
  }
}

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient,
          secret: nextAuthSecret,
        }),
      }),
  databaseClient,
});

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Block GraphQL introspection in production
  if (process.env.NODE_ENV === "production" && req.method === "POST") {
    let bodyStr = "";
    
    if (typeof req.body === "string") {
      bodyStr = req.body;
    } else {
      bodyStr = JSON.stringify(req.body);
    }

    if (isIntrospectionQuery(bodyStr)) {
      return res.status(403).json({ 
        errors: [{ message: "Introspection queries are not allowed" }] 
      });
    }
  }

  return handler(req, res);
};

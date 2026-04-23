import type { NextApiRequest, NextApiResponse } from "next";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import databaseClient from "../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const nextAuthSecret =
  process.env.NEXTAUTH_SECRET || "replace-this-secret-in-production";

// Block introspection queries in production to prevent schema leakage
function isIntrospectionQuery(body: string): boolean {
  try {
    const query = JSON.parse(body).query || "";
    return /(__schema|__type|introspectionQuery)/.test(query);
  } catch {
    return false;
  }
}

let cachedHandler: any = null;

function createHandler() {
  if (cachedHandler) {
    return cachedHandler;
  }

  if (isLocal) {
    cachedHandler = TinaNodeBackend({
      authProvider: LocalBackendAuthProvider(),
      databaseClient,
    });
    return cachedHandler;
  }

  // Try to use AuthJs provider if available
  try {
    // Use a computed require name to avoid static analysis by Turbopack/webpack.
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const pkgName = "tinacms-authjs";
    // Use eval('require') to avoid bundler static analysis while still requiring at runtime.
    // This prevents the build-time "Can't resolve 'tinacms-authjs'" error when the package
    // is intentionally optional.
    // @ts-ignore
    const authjsModule = (0, eval)("require")(pkgName);
    const { AuthJsBackendAuthProvider, TinaAuthJSOptions } = authjsModule;

    cachedHandler = TinaNodeBackend({
      authProvider: AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: nextAuthSecret,
        }),
      }),
      databaseClient,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      "[tina] tinacms-authjs not available, falling back to LocalBackendAuthProvider",
      err instanceof Error ? err.message : String(err)
    );

    cachedHandler = TinaNodeBackend({
      authProvider: LocalBackendAuthProvider(),
      databaseClient,
    });
  }

  return cachedHandler;
}

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
        errors: [{ message: "Introspection queries are not allowed" }],
      });
    }
  }

  const handler = createHandler();
  return handler(req, res);
};

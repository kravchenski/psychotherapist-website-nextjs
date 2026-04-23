import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import type { NextApiRequest, NextApiResponse } from "next";

import databaseClient from "../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const nextAuthSecret = process.env.NEXTAUTH_SECRET || "replace-this-secret-in-production";

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
  // Modify the request here if you need to
  return handler(req, res);
};

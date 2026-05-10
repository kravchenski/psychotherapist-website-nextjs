import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { getDatabaseUrl } from "./app/lib/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getDatabaseUrl() ?? env("DATABASE_URL"),
  },
});

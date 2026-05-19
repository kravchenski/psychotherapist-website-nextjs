/* eslint-disable @typescript-eslint/no-require-imports */
const { loadEnvConfig } = require("@next/env");
const { createServer } = require("node:http");
const fs = require("node:fs");

function forceWebpackBundler() {
  delete process.env.TURBOPACK;
  delete process.env.IS_TURBOPACK_TEST;
}

forceWebpackBundler();
const next = require("next");

const projectDir = __dirname;
loadEnvConfig(projectDir, process.env.NODE_ENV !== "production");
forceWebpackBundler();

const dev = process.env.NODE_ENV !== "production";
const hostname =
  process.env.INSTANCE_HOST || process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const socket = process.env.SOCKET;

const app = next({ dev, hostname, port, dir: projectDir, webpack: true });
const handle = app.getRequestHandler();
const allowedMethods = new Set(["GET", "HEAD", "POST"]);

function addEarlySecurityHeaders(res) {
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const rawPath = (req.url || "").split("?")[0];

    if (!allowedMethods.has(req.method || "")) {
      addEarlySecurityHeaders(res);
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD, POST");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    if (rawPath.includes("://") || rawPath.includes("//") || rawPath.includes("\\")) {
      addEarlySecurityHeaders(res);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Bad request" }));
      return;
    }

    handle(req, res);
  });

  if (socket) {
    if (fs.existsSync(socket)) {
      fs.unlinkSync(socket);
    }

    server.listen(socket, () => {
      fs.chmodSync(socket, 0o660);
      console.log(`Next.js server is listening on ${socket}`);
    });

    return;
  }

  server.listen(port, hostname, () => {
    console.log(
      `Next.js server is running on http://${hostname}:${port} in ${
        dev ? "development" : "production"
      } mode`,
    );
  });
});

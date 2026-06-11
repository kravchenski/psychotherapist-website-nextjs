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
const loadedEnv = loadEnvConfig(projectDir, process.env.NODE_ENV !== "production");
forceWebpackBundler();

const dev = process.env.NODE_ENV !== "production";
const hostname =
  process.env.INSTANCE_HOST || process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const socket = process.env.SOCKET;

const app = next({ dev, hostname, port, dir: projectDir, webpack: true });
const handle = app.getRequestHandler();
const allowedMethods = new Set(["GET", "HEAD", "POST"]);
const bePaidDirectPaymentUrl =
  process.env.NEXT_PUBLIC_BEPAID_PAYMENT_URL?.trim() ||
  process.env.BEPAID_DIRECT_PAYMENT_URL?.trim() ||
  "https://api.bepaid.by/products/prd_5e2c12758bd61836/pay";

function getAdminConfigIssues() {
  const issues = [];
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!username) {
    issues.push("ADMIN_USERNAME is missing");
  }

  if (!password) {
    issues.push("ADMIN_PASSWORD is missing");
  } else if (password.length < 12) {
    issues.push("ADMIN_PASSWORD must be at least 12 characters");
  } else if (password === "admin" || password === "change-me") {
    issues.push("ADMIN_PASSWORD must not be a placeholder");
  }

  if (!sessionSecret) {
    issues.push("ADMIN_SESSION_SECRET is missing");
  } else if (sessionSecret.length < 32) {
    issues.push("ADMIN_SESSION_SECRET must be at least 32 characters");
  } else if (sessionSecret === "replace-with-a-long-random-secret") {
    issues.push("ADMIN_SESSION_SECRET must not be a placeholder");
  }

  return issues;
}

function logAdminConfigStatus() {
  const issues = getAdminConfigIssues();

  if (issues.length === 0) {
    return;
  }

  const envFiles =
    loadedEnv.loadedEnvFiles.map((file) => file.path).join(", ") || "none";

  console.warn(
    `Admin is not configured. Loaded env files: ${envFiles}. Issues: ${issues.join("; ")}`,
  );
}

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

    if (req.method === "POST" && rawPath === "/api/payment/bepaid") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify({ redirectUrl: bePaidDirectPaymentUrl }));
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
      logAdminConfigStatus();
      console.log(`Next.js server is listening on ${socket}`);
    });

    return;
  }

  server.listen(port, hostname, () => {
    logAdminConfigStatus();
    console.log(
      `Next.js server is running on http://${hostname}:${port} in ${
        dev ? "development" : "production"
      } mode`,
    );
  });
});

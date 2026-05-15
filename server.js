/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("node:http");
const fs = require("node:fs");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname =
  process.env.INSTANCE_HOST || process.env.HOSTNAME || process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const socket = process.env.SOCKET;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
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

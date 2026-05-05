#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

const sourceIndexHtml = path.join(".next", "server", "app", "index.html");
const outDir = path.join("out");
const destIndexHtml = path.join(outDir, "index.html");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirectoryContents(sourceDir, destinationDir) {
  ensureDir(destinationDir);

  for (const entry of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, entry), path.join(destinationDir, entry), {
      recursive: true,
      force: true,
    });
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
ensureDir(outDir);

if (!fs.existsSync(sourceIndexHtml)) {
  console.error('Error: index.html not found in .next/server/app/');
  console.error('Please run "npm run build" first');
  process.exit(1);
}

let htmlContent = fs.readFileSync(sourceIndexHtml, "utf8");

htmlContent = htmlContent.replace(
  /src="\/_next\/image\?url=([^&]+)&amp;w=\d+&amp;q=\d+"/g,
  (_match, url) => `src="${decodeURIComponent(url)}"`,
);

htmlContent = htmlContent.replace(
  /imageSrcSet="([^"]*)"/g,
  (_match, srcset) => `imageSrcSet="${srcset.replace(
    /\/_next\/image\?url=([^&]+)&amp;w=\d+&amp;q=\d+/g,
    (_imgMatch, imgUrl) => decodeURIComponent(imgUrl),
  )}"`,
);

htmlContent = htmlContent.replace(
  /srcSet="([^"]*)"/g,
  (_match, srcset) => `srcSet="${srcset.replace(
    /\/_next\/image\?url=([^&]+)&amp;w=\d+&amp;q=\d+/g,
    (_imgMatch, imgUrl) => decodeURIComponent(imgUrl),
  )}"`,
);

htmlContent = htmlContent.replace(/href="\/favicon\.ico\?[^"]+"/g, 'href="/favicon.ico"');

fs.writeFileSync(destIndexHtml, htmlContent);

const staticSource = path.join(".next", "static");
const staticDest = path.join(outDir, "_next", "static");

if (fs.existsSync(staticSource)) {
  copyDirectoryContents(staticSource, staticDest);
  console.log("✓ Copied static assets");
}

const publicSource = path.join("public");

if (fs.existsSync(publicSource)) {
  copyDirectoryContents(publicSource, outDir);
  console.log("✓ Copied public assets");
}

const faviconMediaDir = path.join(".next", "static", "media");
const faviconDest = path.join(outDir, "favicon.ico");

if (fs.existsSync(faviconMediaDir)) {
  const faviconFile = fs
    .readdirSync(faviconMediaDir)
    .find((file) => file.startsWith("favicon.") && file.endsWith(".ico"));

  if (faviconFile) {
    fs.copyFileSync(path.join(faviconMediaDir, faviconFile), faviconDest);
    console.log("✓ Copied favicon.ico");
  }
}

console.log("✓ Successfully exported to out/");
console.log("  Main HTML:", destIndexHtml);

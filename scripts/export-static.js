#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source and destination paths
const sourceIndexHtml = path.join('.next', 'server', 'app', 'index.html');
const outDir = path.join('out');
const destIndexHtml = path.join(outDir, 'index.html');

// Create output directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Check if source file exists
if (!fs.existsSync(sourceIndexHtml)) {
  console.error('Error: index.html not found in .next/server/app/');
  console.error('Please run "npm run build" first');
  process.exit(1);
}

// Copy index.html to out directory
let htmlContent = fs.readFileSync(sourceIndexHtml, 'utf8');

// Fix image paths to use direct public asset paths instead of Next.js image optimizer
htmlContent = htmlContent.replace(
  /src="\/_next\/image\?url=([^&]+)&amp;w=\d+&amp;q=\d+"/g,
  (match, url) => {
    const decodedUrl = decodeURIComponent(url);
    return `src="${decodedUrl}"`;
  }
);

// Fix preload imageSrcSet paths
htmlContent = htmlContent.replace(
  /imageSrcSet="([^"]*)"/g,
  (match, srcset) => {
    const fixedSrcset = srcset.replace(
      /\/_next\/image\?url=([^&]+)&amp;w=\d+&amp;q=\d+/g,
      (imgMatch, imgUrl) => {
        const decodedUrl = decodeURIComponent(imgUrl);
        return decodedUrl;
      }
    );
    return `imageSrcSet="${fixedSrcset}"`;
  }
);

// Fix image srcset paths
htmlContent = htmlContent.replace(
  /srcSet="([^"]*)"/g,
  (match, srcset) => {
    const fixedSrcset = srcset.replace(
      /\/_next\/image\?url=([^&]+)&amp;w=\d+&amp;q=\d+/g,
      (imgMatch, imgUrl) => {
        const decodedUrl = decodeURIComponent(imgUrl);
        return decodedUrl;
      }
    );
    return `srcSet="${fixedSrcset}"`;
  }
);

// Fix favicon path
htmlContent = htmlContent.replace(
  /href="\/favicon\.ico\?[^\"]+"/g,
  'href="/favicon.ico"'
);

fs.writeFileSync(destIndexHtml, htmlContent);

// Copy static assets
const staticSource = path.join('.next', 'static');
const staticDest = path.join(outDir, '_next', 'static');

if (fs.existsSync(staticSource)) {
  // Create parent directory first
  const staticParentDir = path.join(outDir, '_next');
  if (!fs.existsSync(staticParentDir)) {
    fs.mkdirSync(staticParentDir, { recursive: true });
  }
  execSync(`cp -r ${staticSource} ${staticDest}`);
  console.log('✓ Copied static assets');
}

// Copy public assets
const publicSource = path.join('public');
if (fs.existsSync(publicSource)) {
  execSync(`cp -r ${publicSource} ${outDir}`);
  console.log('✓ Copied public assets');
}

// Copy favicon from static media to root
const faviconSource = path.join('.next', 'static', 'media', 'favicon.0-wlrqdzz-te..ico');
const faviconDest = path.join(outDir, 'favicon.ico');
if (fs.existsSync(faviconSource)) {
  fs.copyFileSync(faviconSource, faviconDest);
  console.log('✓ Copied favicon.ico');
}

console.log('✓ Successfully exported to out/');
console.log('  Main HTML:', destIndexHtml);
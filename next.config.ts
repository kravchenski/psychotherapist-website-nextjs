import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["www.anna-pochebyt.by", "anna-pochebyt.by"],
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
  experimental: {
    cpus: 1,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 110, 128, 256, 384],
    qualities: [60, 70, 72, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;

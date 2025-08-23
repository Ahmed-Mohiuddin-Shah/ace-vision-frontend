import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_BACKEND_URL
      ? [new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/**`)]
      : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb", // ⬅️ set this higher (e.g., 10mb, 50mb, 100mb)
    },
  },
};

export default nextConfig;

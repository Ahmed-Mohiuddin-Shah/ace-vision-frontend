import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_BACKEND_URL
      ? [new URL(process.env.NEXT_PUBLIC_BACKEND_URL)]
      : [],
  },
};

export default nextConfig;

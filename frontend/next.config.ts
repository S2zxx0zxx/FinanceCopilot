import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",  // Only for Docker/self-hosted — remove for Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:3001"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
    return [
      {
        source: "/api/evaluate",
        destination: `${backend}/evaluate`,
      },
      {
        source: "/api/feedback",
        destination: `${backend}/feedback`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${backend}/auth/:path*`,
      },
      {
        source: "/api/repos",
        destination: `${backend}/repos`,
      },
      {
        source: "/api/history",
        destination: `${backend}/history`,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/evaluate",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluate`,
      },
      {
        source: "/api/feedback",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`,
      },
    ];
  },
};

export default nextConfig;

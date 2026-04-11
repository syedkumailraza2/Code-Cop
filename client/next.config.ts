import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/evaluate",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluate`,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/evaluate",
        destination: "http://localhost:8000/evaluate",
      },
    ];
  },
};

export default nextConfig;

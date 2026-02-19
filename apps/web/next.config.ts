import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ais/shared",
    "@ais/db",
    "@ais/ai-engine",
    "@ais/analysis",
    "@ais/matching",
    "@ais/counseling",
    "@ais/report",
    "@ais/ui",
  ],
};

export default nextConfig;

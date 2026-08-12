import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@linguaflow/ui",
    "@linguaflow/config",
    "@linguaflow/contracts",
    "@linguaflow/domain",
  ],
};

export default nextConfig;


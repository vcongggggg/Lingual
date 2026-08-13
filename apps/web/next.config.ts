import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@linguaflow/ui",
    "@linguaflow/config",
    "@linguaflow/contracts",
    "@linguaflow/domain",
  ],
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent filesystem cache in dev mode on Windows to prevent HMR pack cache corruption
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@strandos/tenant-configuration", "@strandos/ui"],
};

export default nextConfig;

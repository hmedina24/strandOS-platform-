import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows workspaces synchronized by OneDrive may block Next's standalone
  // symlinks. Docker builds run on Linux and still emit the standalone server.
  ...(process.platform === "win32" ? {} : { output: "standalone" }),
};

export default nextConfig;

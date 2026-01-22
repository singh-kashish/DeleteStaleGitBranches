import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

export default nextConfig;

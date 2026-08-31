import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ensure Turbopack evaluates tailwind layers across internal source boundaries */
  transpilePackages: ["@tailwindcss/postcss"],
};

export default nextConfig;

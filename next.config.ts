import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIXED: Removed output: 'export' to ensure serverless API routes work natively on Vercel
  reactStrictMode: true,
};

export default nextConfig;

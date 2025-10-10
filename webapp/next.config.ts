import type { NextConfig } from 'next';

/**
 * Build a clean list of allowed origins from env:
 * - AMPLIFY_APP_ORIGIN can be a single origin or comma-separated list
 * - ALLOWED_ORIGIN_HOST is supported for backward-compatibility
 * - NEXTAUTH_URL (optional) is added if present
 */
const fromEnv = [
  process.env.AMPLIFY_APP_ORIGIN,        // e.g. "https://main.xxx.amplifyapp.com,http://localhost:3000"
  process.env.ALLOWED_ORIGIN_HOST,       // legacy single host/origin
  process.env.NEXTAUTH_URL               // optional if you use NextAuth
]
  .filter(Boolean)                        // drop undefined
  .flatMap(v => v!.split(','))            // split comma lists
  .map(s => s.trim())                     // trim whitespace
  .filter(s => s.length > 0);             // drop empties

// Always include localhost (with protocol)
const allowedOrigins = Array.from(new Set<string>([
  'http://localhost:3000',
  ...fromEnv,
]));

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverActions: {
      // Next.js expects an array of strings; we ensure no undefined entries
      allowedOrigins,
    },
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TS_BUILD === 'true',
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ (optionnel) ne fait pas échouer `next build` si TypeScript trouve des erreurs
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ (optionnel) ne fait pas échouer `next build` si TypeScript trouve des erreurs
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);

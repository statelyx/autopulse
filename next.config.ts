import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Environment değişkenlerinin client-side erişimi için
  env: {
    // Build time'da gerekli env var'lar buraya eklenebilir
  },
};

export default nextConfig;

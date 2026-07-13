import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ukearrelfuxaxvexoavl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  output: 'standalone'
  /* config options here */
};

export default nextConfig;

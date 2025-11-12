import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn1.bazaraki.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.bazaraki.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn3.bazaraki.com',
      },
    ],
  },
};

export default nextConfig;

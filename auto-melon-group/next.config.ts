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
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'autotrader.co.uk',
      },
      {
        protocol: 'https',
        hostname: '**.autotrader.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'atcdn.co.uk',
      },
      {
        protocol: 'https',
        hostname: '**.atcdn.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
      },
    ],
  },
};

export default nextConfig;

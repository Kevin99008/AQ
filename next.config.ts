import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_NO_ESLINT === 'true',
  },
  reactStrictMode: false, // Disable Strict Mode
  images: {
    domains: ["irrgwghpvvwcgalcfkmh.supabase.co", "sryesoktrkolkclrolcf.supabase.co"], // Add your Supabase storage domain
  },
};

export default nextConfig;
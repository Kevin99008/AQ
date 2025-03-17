import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable Strict Mode
  images: {
    domains: ["irrgwghpvvwcgalcfkmh.supabase.co"], // Add your Supabase storage domain
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: Next.js 14.1.0 generates legacy error pages (/404, /500) during build
  // which causes prerender warnings. These can be safely ignored as we have
  // App Router error boundaries (error.tsx, not-found.jsx, global-error.tsx).
  // The runtime app will use the App Router error pages, not the legacy ones.
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;

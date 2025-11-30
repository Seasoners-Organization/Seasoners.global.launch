/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: Next.js 14.1.0 generates legacy error pages (/404, /500) during build
  // which causes prerender warnings. These can be safely ignored as we have
  // App Router error boundaries (error.tsx, not-found.jsx, global-error.tsx).
  // The runtime app will use the App Router error pages, not the legacy ones.
  
  // Force clean build cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

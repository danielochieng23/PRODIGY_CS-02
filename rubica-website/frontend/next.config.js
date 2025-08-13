/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'rubica.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL || 'http://localhost:5000/api/:path*',
      },
    ];
  },
  env: {
    SITE_NAME: 'Rubica',
    SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
  },
};

module.exports = nextConfig;
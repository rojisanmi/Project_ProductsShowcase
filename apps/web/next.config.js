/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
    qualities: [75, 85],
  },
  // Silence workspace root warning - root should be the project root (where package.json is)
  turbopack: {
    root: path.resolve(__dirname, '..', '..'),
  },
};

module.exports = nextConfig;
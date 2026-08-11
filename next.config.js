/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'conextlab.net',
      },
    ],
  },
};

module.exports = nextConfig;

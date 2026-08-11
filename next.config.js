/** @type {import('next').NextConfig} */
const nextConfig = {
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*amazonaws.com',
      },
    ],
  },
  env: {
    TZ: 'America/Bogota',
  },
}

module.exports = nextConfig 
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'quejate.s3.us-east-2.amazonaws.com',
          port: '',
          pathname: '**',
          search: '',
        },
      ],
    },
};

export default nextConfig;

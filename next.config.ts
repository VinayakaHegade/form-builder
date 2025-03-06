import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ['app', 'components', 'lib'],
  },
};

export default nextConfig;

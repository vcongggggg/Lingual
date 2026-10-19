import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: process.platform !== 'win32' || process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@linguaflow/contracts', '@linguaflow/domain'],
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  async redirects() {
    return [
      {
        source: '/toeic',
        destination: '/exam-practice/toeic',
        permanent: false,
      },
      {
        source: '/exam',
        destination: '/exam-practice',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

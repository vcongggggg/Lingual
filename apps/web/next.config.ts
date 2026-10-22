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
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4000/api/v1/:path*',
      },
    ];
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
      {
        source: '/practice/cow-eavesdrop',
        destination: '/practice?view=eavesdrop',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Enable optimized package imports
    optimizePackageImports: ['react-icons', 'lucide-react', '@radix-ui/react-dialog'],
  },
  // Optimize compilation
  typescript: {
    // Disable type checking during build for faster compilation
    ignoreBuildErrors: false,
  },
  eslint: {
    // Disable ESLint during build for faster compilation
    ignoreDuringBuilds: true,
  },
  webpack(config, { dev, isServer }) {
    // Optimize webpack for development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          icons: {
            test: /[\\/]node_modules[\\/](react-icons|lucide-react)[\\/]/,
            name: 'icons',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
    ],
  },

  // Add headers for font loading
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para Vercel
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
    ],
  },

  // Otimizações para Vercel
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig

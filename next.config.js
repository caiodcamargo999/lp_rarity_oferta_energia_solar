/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para arquivos estáticos
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
        },
      },
    })
    return config
  },
  // Headers otimizados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Headers para CSS
      {
        source: '/(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
        // Headers para vídeo otimizados
  {
    source: '/(.*).mp4',
    headers: [
      {
        key: 'Accept-Ranges',
        value: 'bytes',
      },
      {
        key: 'Content-Type',
        value: 'video/mp4',
      },
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
    ],
  },
  // Headers para WebM
  {
    source: '/(.*).webm',
    headers: [
      {
        key: 'Accept-Ranges',
        value: 'bytes',
      },
      {
        key: 'Content-Type',
        value: 'video/webm',
      },
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
      // Headers para imagens
      {
        source: '/(.*).(jpg|jpeg|png|gif|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Configuração de trailing slash
  trailingSlash: false,
  // Configuração de compressão
  compress: true,
  // Configuração de power by header
  poweredByHeader: false,
}

module.exports = nextConfig

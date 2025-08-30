import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// ===== FONTE INTER DESIGNERFLIX =====
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Escale sua Empresa de Energia Solar - Desbloqueia as Vendas | Rarity Agency',
  description: 'Transforme sua empresa de energia solar em uma máquina de vendas. Implementamos sistemas que automatizam 80% do processo de vendas usando IA + Anúncios Online. Agende sua sessão estratégica gratuita.',
  keywords: 'energia solar, vendas energia solar, marketing energia solar, automação vendas, IA marketing, anúncios online, crescimento empresa solar, agência marketing solar',
  authors: [{ name: 'Rarity Agency' }],
  creator: 'Rarity Agency',
  publisher: 'Rarity Agency',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rarityagency.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Escale sua Empresa de Energia Solar - Desbloqueia as Vendas',
    description: 'Transforme sua empresa de energia solar em uma máquina de vendas. Sistemas automatizados com IA + Anúncios Online para multiplicar resultados.',
    url: 'https://rarityagency.io',
    siteName: 'Rarity Agency',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/rarity_logo.png',
        width: 1200,
        height: 630,
        alt: 'Rarity Agency - Especialistas em Marketing para Energia Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Escale sua Empresa de Energia Solar - Desbloqueia as Vendas',
    description: 'Transforme sua empresa de energia solar em uma máquina de vendas. Sistemas automatizados com IA + Anúncios Online.',
    images: ['/rarity_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/rarity_logo.png" as="image" type="image/png" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* Favicon and viewport */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Performance optimizations */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#0F6AE7" />
      </head>
      <body className={`${inter.variable} font-inter bg-black min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

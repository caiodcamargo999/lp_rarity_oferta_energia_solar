import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rarity Agency - Crescimento e Vendas para Empresas de Energia Solar',
  description: 'Dobramos suas vendas de placas solares em 90 dias. Estratégias comprovadas de marketing digital para empresas de energia solar no Brasil.',
  keywords: 'marketing digital, energia solar, placas solares, vendas, crescimento, agência, Brasil',
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
    title: 'Rarity Agency - Crescimento e Vendas para Empresas de Energia Solar',
    description: 'Dobramos suas vendas de placas solares em 90 dias. Estratégias comprovadas de marketing digital.',
    url: 'https://rarityagency.io',
    siteName: 'Rarity Agency',
    images: [
      {
        url: '/thumbmail_1_e_2.jpg',
        width: 1200,
        height: 630,
        alt: 'Rarity Agency - Especialistas em Marketing Digital para Energia Solar',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rarity Agency - Crescimento e Vendas para Empresas de Energia Solar',
    description: 'Dobramos suas vendas de placas solares em 90 dias. Estratégias comprovadas de marketing digital.',
    images: ['/thumbmail_1_e_2.jpg'],
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
        {/* Favicon e ícones */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta tags adicionais */}
        <meta name="theme-color" content="#8A2BE2" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Rarity Agency",
              "url": "https://rarityagency.io",
              "logo": "https://rarityagency.io/rarity_logo.png",
              "description": "Especialistas em Marketing Digital para Empresas de Energia Solar",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Portuguese"
              },
              "sameAs": [
                "https://rarityagency.io"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

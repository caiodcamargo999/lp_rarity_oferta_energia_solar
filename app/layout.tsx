import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import './globals.css'


const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Rarity Agency - Growth for Startups | Unlock Your Growth Engine',
  description: 'Transform your startup with Rarity Agency\'s proven growth strategies. AI, automation, and business scaling solutions that deliver results. Book your free strategy call today.',
  keywords: 'growth agency, startup growth, digital marketing, AI automation, business scaling, growth strategies',
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
    title: 'Rarity Agency - Growth for Startups',
    description: 'Unlock Your Growth Engine with proven strategies for AI, automation, and business scaling.',
    url: 'https://rarityagency.io',
    siteName: 'Rarity Agency',
    images: [
      {
        url: '/rarity_logo.png',
        width: 1200,
        height: 630,
        alt: 'Rarity Agency Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rarity Agency - Growth for Startups',
    description: 'Unlock Your Growth Engine with proven strategies for AI, automation, and business scaling.',
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
    <html lang="en">
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
        <meta name="theme-color" content="#8A2BE2" />
      </head>
      <body className={`${poppins.variable} font-poppins`}>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}

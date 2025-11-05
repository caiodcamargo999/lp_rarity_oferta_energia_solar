import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rarity Agency - Google Ads e Landing Pages para Energia Solar',
  description: 'Capture clientes que já estão procurando energia solar no Google. Anúncios ultra-segmentados e landing pages de alta conversão.',
  openGraph: {
    title: 'Rarity Agency - Google Ads e Landing Pages para Energia Solar',
    description: 'Capture clientes que já estão procurando energia solar no Google. Anúncios ultra-segmentados e landing pages de alta conversão.',
    images: [
      {
        url: '/thumbmail_3_e_4.jpg',
        width: 1200,
        height: 630,
        alt: 'Rarity Agency - Google Ads e Landing Pages para Energia Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rarity Agency - Google Ads e Landing Pages para Energia Solar',
    description: 'Capture clientes que já estão procurando energia solar no Google. Anúncios ultra-segmentados e landing pages de alta conversão.',
    images: ['/thumbmail_3_e_4.jpg'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

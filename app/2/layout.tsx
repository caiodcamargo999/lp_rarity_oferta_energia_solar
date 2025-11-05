import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rarity Agency - Crescimento e Vendas para Empresas de Energia Solar',
  description: 'Dobramos suas vendas de placas solares em 90 dias. Estratégias comprovadas de marketing digital para empresas de energia solar no Brasil.',
  openGraph: {
    title: 'Rarity Agency - Crescimento e Vendas para Empresas de Energia Solar',
    description: 'Dobramos suas vendas de placas solares em 90 dias. Estratégias comprovadas de marketing digital.',
    images: [
      {
        url: 'https://rarityagency.com.br/thumbmail_1_e_2.jpg',
        width: 1200,
        height: 630,
        alt: 'Rarity Agency - Especialistas em Marketing Digital para Energia Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rarity Agency - Crescimento e Vendas para Empresas de Energia Solar',
    description: 'Dobramos suas vendas de placas solares em 90 dias. Estratégias comprovadas de marketing digital.',
    images: ['https://rarityagency.com.br/thumbmail_1_e_2.jpg'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

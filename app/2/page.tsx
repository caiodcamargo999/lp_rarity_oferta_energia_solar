'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for better performance
const VideoSection = dynamic(() => import('@/components/VideoSection'), {
  loading: () => <div className="w-full h-48 bg-gray-800 animate-pulse rounded-lg" />,
  ssr: false
})

const SuccessCases = dynamic(() => import('@/components/SuccessCases'), {
  loading: () => <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg" />,
  ssr: false
})

export default function HomePageV2() {
  // Versão /2: Com delays solicitados

  return (
    <main className="min-h-screen w-full">
      {/* Header Section - Logo centralizada */}
      <motion.header 
        className="absolute top-0 left-0 right-0 z-50 p-8 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="w-48 h-32 md:w-64 md:h-40">
          <Image
            src="/rarity_logo.png"
            alt="Rarity Agency Logo"
            width={256}
            height={160}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </motion.header>

      {/* Hero Section - Copywriting focado em energia solar */}
      <motion.section 
        className="pt-24 md:pt-28 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
            <span className="gradient-text">DOBRE</span> suas Vendas de Placas Solares<br/>
            <span className="text-2xl md:text-3xl lg:text-4xl text-text-secondary mt-4 block">
              em 60 dias
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-text-primary">Empresas de energia solar</strong> estão perdendo milhões em vendas por não usar <span className="gradient-text">IA + Anúncios Online</span>. 
            <br/><br/>
            Nós implementamos sistemas que <strong className="text-primary">automatizam 80% do processo de vendas</strong> e multiplicam seus resultados usando estratégias comprovadas de <span className="gradient-text">copywriting persuasivo</span>, <span className="text-primary">automação inteligente</span> e <span className="gradient-text">anúncios online em escala</span>.
          </p>
        </div>
      </motion.section>

      {/* Video Section - Versão com delays */}
      <Suspense fallback={
        <div className="px-4 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-full h-48 bg-gray-800 animate-pulse rounded-lg"></div>
          </div>
        </div>
      }>
        <VideoSection version="2" />
      </Suspense>

      {/* Success Cases Section */}
      <Suspense fallback={
        <div className="px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg"></div>
          </div>
        </div>
      }>
        <SuccessCases />
      </Suspense>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-text-secondary mb-4">
            Transforme sua empresa de energia solar em uma máquina de vendas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link 
              href="https://rarityagency.io" 
              className="text-primary-500 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit rarityagency.io
            </Link>
            <span className="text-text-secondary">|</span>
            <Link 
              href="https://www.instagram.com/rarity.brasil/" 
              className="text-primary-500 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow @rarity.brasil
            </Link>
          </div>
          <p className="text-text-secondary text-sm">
            Rarity Agency © 2025 | Especialistas em Marketing Digital para Energia Solar
          </p>
        </div>
      </footer>
    </main>
  )
}

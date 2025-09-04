'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import VideoSection from '../../components/VideoSection'
import SuccessCases from '../../components/SuccessCases'
import LeadCaptureModal from '../../components/LeadCaptureModal'

export default function HomePageV2() {
  // Versão /2: Com delays solicitados
  const [showUrgency, setShowUrgency] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  const handleVideoTimeUpdate = (time: number) => {
    // Versão 2: timing controlado pelo VideoSection
    console.log(`⏱️ Tempo do vídeo: ${Math.floor(time)}s`)
  }

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
          <h1 className="text-h1 font-bold text-text-primary mb-6 leading-tight tracking-tight">
            <span className="gradient-text">DOBRE</span> suas Vendas de Placas Solares<br/>
            <span className="text-h3 font-semibold text-text-secondary mt-4 block">
              em 90 dias
            </span>
          </h1>
          
          <p className="text-body text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed tracking-normal">
            <strong className="text-text-primary">Empresas de energia solar</strong> estão perdendo milhões em vendas por não usar <span className="gradient-text">IA + Anúncios Online</span>. 
            <br/><br/>
            Nós implementamos sistemas que <strong className="text-text-primary">automatizam 80% do processo de vendas</strong> e multiplicam seus resultados usando estratégias comprovadas de <span className="gradient-text">copywriting persuasivo</span>, <span className="text-primary">automação inteligente</span> e <span className="gradient-text">anúncios online em escala</span>.
          </p>
        </div>
      </motion.section>

      {/* Video Section - Versão com delays */}
      <VideoSection 
        version="2" 
        onTimeUpdate={handleVideoTimeUpdate}
        onUrgencyChange={setShowUrgency}
        onCTAChange={setShowCTA}
        onOpenModal={() => setIsLeadModalOpen(true)}
      />

      {/* Success Cases Section */}
      <SuccessCases 
        version="2" 
        showUrgency={showUrgency}
        showCTA={showCTA}
      />

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-text-secondary mb-4">
            Transforme sua empresa de energia solar em uma máquina de vendas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a 
              href="https://rarityagency.io" 
              className="text-primary-500 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit rarityagency.io
            </a>
            <span className="text-text-secondary">|</span>
            <a 
              href="https://www.instagram.com/rarity.brasil/" 
              className="text-primary-500 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow @rarity.brasil
            </a>
          </div>
          <p className="text-text-secondary text-sm">
            Rarity Agency © 2025 | Especialistas em Marketing Digital para Energia Solar
          </p>
        </div>
      </footer>

      {/* Modal de Captação de Leads */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </main>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import SuccessCases from '../../components/SuccessCases'
import LeadCaptureModal from '../../components/LeadCaptureModal'
import VideoSectionV3 from '../../components/VideoSectionV3'

export default function GoogleAdsPage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  return (
    <main className="min-h-screen w-full overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <motion.header
        className="relative z-50 pt-8 pb-4 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-40 md:w-52">
          <Image
            src="/rarity_logo.png"
            alt="Rarity Agency Logo"
            width={208}
            height={130}
            className="w-full h-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 pt-12 pb-8 px-4 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <span className="glass-pill text-xs md:text-sm tracking-widest">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              ESTRATÉGIA DE ALTA PERFORMANCE
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
            Domine o Google e Venda <br className="hidden md:block" />
            <span className="gradient-text text-glow">Energia Solar Todos os Dias</span>
          </h1>

          <p className="text-lg md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
            Não desperdice dinheiro com cliques curiosos. Use nossa <strong className="text-white">tecnologia de intenção de compra</strong> para aparecer apenas para quem já quer instalar placas solares agora.
          </p>
        </div>
      </motion.section>

      {/* Video Section */}
      <div className="relative z-20">
        <VideoSectionV3
          version="1"
          videoId="novo3"
          onOpenModal={() => setIsLeadModalOpen(true)}
        />
      </div>

      {/* Success Cases */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <SuccessCases
          version="1"
          showUrgency={true}
          showCTA={true}
        />
      </div>

      {/* Footer */}
      <footer className="text-center py-12 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-text-secondary mb-6 text-sm">
            &copy; 2025 Rarity Agency. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm font-medium">
            <a href="https://rarityagency.io" target="_blank" className="text-white/60 hover:text-primary-400 transition-colors">
              Site Oficial
            </a>
            <a href="https://www.instagram.com/rarity.solar" target="_blank" className="text-white/60 hover:text-primary-400 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </main>
  )
}

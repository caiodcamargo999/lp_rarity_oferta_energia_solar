'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Image from 'next/image'
import VideoSection from '../components/VideoSection'
import SuccessCases from '../components/SuccessCases'
import LeadCaptureModal from '../components/LeadCaptureModal'
import { useState } from 'react'

export default function HomePage() {
  const [showUrgency, setShowUrgency] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  const handleVideoTimeUpdate = (time: number) => {
    // Logic for timing if needed
  }

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
          {/* Glass Pill Tag */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <span className="glass-pill text-xs md:text-sm tracking-widest">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
              MÉTODO EXCLUSIVO PARA INTEGRADORES SOLARES
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
            Transforme Desconhecidos em <br className="hidden md:block" />
            <span className="gradient-text text-glow">Clientes de Energia Solar</span>
          </h1>

          <p className="text-lg md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
            Instale uma <strong className="text-white font-semibold">Máquina de Vendas Automática</strong> que atrai, qualifica e agenda reuniões com leads prontos para fechar contrato. <span className="text-primary-400">Sem depender de indicações.</span>
          </p>
        </div>
      </motion.section>

      {/* Video Section */}
      <div className="relative z-20">
        <VideoSection
          version="1"
          onTimeUpdate={handleVideoTimeUpdate}
          onUrgencyChange={setShowUrgency}
          onCTAChange={setShowCTA}
          onOpenModal={() => setIsLeadModalOpen(true)}
        />
      </div>

      {/* Success Cases */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <SuccessCases
          version="1"
          showUrgency={showUrgency}
          showCTA={showCTA}
        />
      </div>

      {/* Footer */}
      <footer className="text-center py-12 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-text-secondary mb-6 text-sm">
            &copy; 2025 Rarity Agency. Todos os direitos reservados.
            <br />Especialistas em Escala para Energia Solar.
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

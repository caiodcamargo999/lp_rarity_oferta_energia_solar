'use client'

import { Button } from '@/components/ui/Button'
import { ArrowRight, Play, CheckCircle, Star, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import SuccessCases from '../../components/SuccessCases'
import LeadCaptureModal from '../../components/LeadCaptureModal'
import VideoSectionV3 from '../../components/VideoSectionV3'
import { useState } from 'react'

export default function GoogleAdsPage() {
  // Página /3 - Google Ads e Landing Pages (mesma estrutura da página principal)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

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

      {/* Hero Section - Copywriting focado em Google Ads e Landing Pages */}
      <motion.section 
        className="pt-24 md:pt-32 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* ===== TÍTULO PRINCIPAL COM TIPOGRAFIA DESIGNERFLIX ===== */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-4 md:mb-5 leading-tight tracking-tight">
            <span className="gradient-text">DOBRE</span> suas vendas de placas solares <span className="gradient-text">em 90 dias</span><br/>
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-text-secondary mt-3 md:mt-4 block">
              com Google Ads e Landing Pages de Alta Conversão
            </span>
          </h1>
          
          {/* ===== SUBTÍTULO COM TIPOGRAFIA DESIGNERFLIX ===== */}
          <p className="text-base sm:text-lg md:text-lg text-text-secondary mb-1 md:mb-2 max-w-3xl mx-auto leading-relaxed tracking-normal">
            <strong className="text-text-primary">Empresas de energia solar</strong> estão perdendo milhões em vendas por não usar <span className="gradient-text">Google Ads + Landing Pages de alta conversão</span>. 
            <br/><br/>
            Nós implementamos sistemas que <strong className="text-text-primary">capturam clientes que já estão procurando energia solar no Google</strong> e multiplicam seus resultados usando estratégias comprovadas de <span className="gradient-text">anúncios ultra-segmentados</span>, <span className="text-primary">landing pages otimizadas</span> e <span className="text-primary">conversão maximizada</span>.
          </p>

        </div>
      </motion.section>

      {/* Video Section - Usando componente otimizado para R2 */}
      <VideoSectionV3 
        version="1"
        videoId="novo3"
        onOpenModal={() => setIsLeadModalOpen(true)}
      />


      {/* Success Cases Section */}
      <SuccessCases 
        version="1" 
        showUrgency={true}
        showCTA={true}
      />

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-body text-text-secondary mb-4">
            Transforme sua empresa de energia solar em uma máquina de vendas com Google Ads
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
          <p className="text-small text-text-secondary">
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

'use client'

import { Button } from '@/components/ui/Button'
import { ArrowRight, Play, CheckCircle, Star, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import SuccessCases from '../../components/SuccessCases'
import LeadCaptureModal from '../../components/LeadCaptureModal'
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
        className="pt-24 md:pt-28 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* ===== TÍTULO PRINCIPAL COM TIPOGRAFIA DESIGNERFLIX ===== */}
          <h1 className="text-h1 font-bold text-text-primary mb-6 leading-tight tracking-tight">
            <span className="gradient-text">DOBRE</span> suas Vendas de Placas Solares<br/>
            <span className="text-h3 font-semibold text-text-secondary mt-4 block">
              com Google Ads + Landing Pages
            </span>
          </h1>
          
          {/* ===== SUBTÍTULO COM TIPOGRAFIA DESIGNERFLIX ===== */}
          <p className="text-body text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed tracking-normal">
            <strong className="text-text-primary">Empresas de energia solar</strong> estão perdendo milhões em vendas por não usar <span className="gradient-text">Google Ads + Landing Pages de alta conversão</span>. 
            <br/><br/>
            Nós implementamos sistemas que <strong className="text-text-primary">capturam clientes que já estão procurando energia solar no Google</strong> e multiplicam seus resultados usando estratégias comprovadas de <span className="gradient-text">anúncios ultra-segmentados</span>, <span className="text-primary">landing pages otimizadas</span> e <span className="text-primary">conversão maximizada</span>.
          </p>
        </div>
      </motion.section>

      {/* Video Section - Formato reels com play no meio */}
      <motion.section 
        className="py-12 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-sm mx-auto">
          {/* Retângulo do vídeo formato reels (9:16) */}
          <motion.div
            className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fundo cinza do vídeo */}
            <div className="absolute inset-0 bg-gray-800"></div>
            
            {/* Botão de play centralizado NO MEIO do retângulo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                className="w-24 h-24 bg-black/80 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-12 h-12 text-white ml-1" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Botão CTA da página abaixo do vídeo - IDÊNTICO ao da página principal */}
      <motion.div
        className="mt-8 flex justify-center w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => setIsLeadModalOpen(true)}
          className="btn-minimal w-full max-w-md bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          AGENDAR SESSÃO ESTRATÉGICA
        </button>
      </motion.div>

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

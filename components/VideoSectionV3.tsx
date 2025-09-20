'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import OptimizedVideo from './OptimizedVideo'

interface VideoSectionV3Props {
  version?: "1" | "2" | "4"
  videoId?: string // ID do vídeo específico
  onTimeUpdate?: (time: number) => void
  onUrgencyChange?: (show: boolean) => void
  onCTAChange?: (show: boolean) => void
  onOpenModal?: () => void
}

export default function VideoSectionV3({ 
  version = "1", 
  videoId = "default",
  onTimeUpdate, 
  onUrgencyChange, 
  onCTAChange, 
  onOpenModal 
}: VideoSectionV3Props) {
  const [showCTA, setShowCTA] = useState(false)
  const [showUrgency, setShowUrgency] = useState(false)
  const [currentVideoTime, setCurrentVideoTime] = useState(0)

  // ===== CONFIGURAÇÃO DE VÍDEOS POR ID =====
  const videoConfigs = {
    default: {
      r2: process.env.NEXT_PUBLIC_VIDEO_URL || "https://seu-bucket.r2.cloudflarestorage.com/video-de-vendas.mp4",
      proxy: "/api/video-proxy",
      local: "/video-de-vendas.mp4",
      thumbnail: "/thumbmail_vsl.png"
    },
    googleads: {
      r2: process.env.NEXT_PUBLIC_VIDEO_URL_GOOGLEADS || "https://pub-16c2712dc3da48989f1715cd08cfe1b1.r2.dev/video-google-ads.mp4",
      proxy: "/api/video-proxy-googleads",
      local: "/video-google-ads.mp4",
      thumbnail: "/thumbmail_vsl_google_ads.png"
    },
    landingpages: {
      r2: process.env.NEXT_PUBLIC_VIDEO_URL_LANDINGPAGES || "https://seu-bucket.r2.cloudflarestorage.com/video-landing-pages.mp4",
      proxy: "/api/video-proxy-landingpages",
      local: "/video-landing-pages.mp4",
      thumbnail: "/video-thumbnail-landingpages.jpg"
    }
  }

  // ===== DETERMINAR CONFIGURAÇÃO DO VÍDEO =====
  const getVideoConfig = () => {
    return videoConfigs[videoId as keyof typeof videoConfigs] || videoConfigs.default
  }

  // ===== DETERMINAR MELHOR FONTE DE VÍDEO =====
  const getBestVideoSource = () => {
    const config = getVideoConfig()
    
    // Usar URL pública do R2 (mais confiável)
    if (config.r2 && !config.r2.includes('seu-bucket.r2.cloudflarestorage.com')) {
      console.log(`🎬 [${videoId}] Usando URL pública do R2:`, config.r2)
      return config.r2
    }
    console.log(`🎬 [${videoId}] Usando API Proxy como fallback`)
    return config.proxy
  }

  const getBestThumbnail = () => {
    const config = getVideoConfig()
    return config.thumbnail
  }

  useEffect(() => {
    // Apenas nas versões 2 e 4: mostrar seções com delays
    if (version === "2") {
      // Mostrar seção de urgência após 1:00 (60 segundos) de vídeo
      if (currentVideoTime >= 60 && !showUrgency) {
        console.log(`⏰ [${videoId}] 1:00 atingido - Mostrando seção de urgência!`)
        setShowUrgency(true)
        if (onUrgencyChange) onUrgencyChange(true)
      }
      
      // Mostrar CTA após 1:20 (80 segundos) de vídeo
      if (currentVideoTime >= 80 && !showCTA) {
        console.log(`🎯 [${videoId}] 1:20 atingido - Mostrando CTA!`)
        setShowCTA(true)
        if (onCTAChange) onCTAChange(true)
      }
    } else if (version === "4") {
      // Mostrar seção de urgência após 4:00 (240 segundos) de vídeo
      if (currentVideoTime >= 240 && !showUrgency) {
        console.log(`⏰ [${videoId}] 4:00 atingido - Mostrando seção de urgência!`)
        setShowUrgency(true)
        if (onUrgencyChange) onUrgencyChange(true)
      }
      
      // Mostrar CTA após 4:20 (260 segundos) de vídeo
      if (currentVideoTime >= 260 && !showCTA) {
        console.log(`🎯 [${videoId}] 4:20 atingido - Mostrando CTA!`)
        setShowCTA(true)
        if (onCTAChange) onCTAChange(true)
      }
    }
  }, [currentVideoTime, version, showUrgency, showCTA, onUrgencyChange, onCTAChange, videoId])

  const handleVideoTimeUpdate = (time: number) => {
    setCurrentVideoTime(time)
    if (onTimeUpdate) {
      onTimeUpdate(time)
    }
  }

  const handleVideoPlay = () => {
    console.log(`🎬 [${videoId}] Vídeo iniciado!`)
  }

  const handleVideoPause = () => {
    console.log(`⏸️ [${videoId}] Vídeo pausado!`)
  }

  return (
    <motion.section 
      className="py-12 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Label do Vídeo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-text-primary">
            ASSISTA COMO FUNCIONA
          </h2>
          
          {/* Flechinha para baixo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4"
          >
            <svg
              className="w-6 h-6 mx-auto text-text-primary animate-bounce"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Vídeo Otimizado para R2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="w-full max-w-sm mx-auto aspect-[9/16]">
            <OptimizedVideo
              src={getBestVideoSource()}
              poster={getBestThumbnail()}
              onTimeUpdate={handleVideoTimeUpdate}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              className="w-full h-full"
            />
          </div>
        </motion.div>

      {/* CTA Button - Sempre visível na versão 1, com delays nas versões 2 e 4 */}
      {(version === "1" || showCTA) && (
          <motion.div
            className="mt-8 flex justify-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={onOpenModal}
              className="btn-minimal w-full max-w-md bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              AGENDAR SESSÃO ESTRATÉGICA
            </button>
          </motion.div>
        )}

        {/* Seção de Urgência - Apenas nas versões 2 e 4 com delay */}
        {(version === "2" || version === "4") && showUrgency && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-text-primary mb-3">
              ⚠️ ATENÇÃO: Oportunidade Limitada!
            </h3>
            <p className="text-text-secondary mb-4">
              Esta estratégia está funcionando para empresas de energia solar e as vagas são limitadas. 
              Não perca a chance de transformar seu negócio!
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

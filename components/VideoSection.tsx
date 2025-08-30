'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface VideoSectionProps {
  version?: "1" | "2"
  onTimeUpdate?: (time: number) => void
}

export default function VideoSection({ version = "1", onTimeUpdate }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [showUrgency, setShowUrgency] = useState(false)
  const [showOnGoingVideo, setShowOnGoingVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime)
      }
      
      // Apenas na versão 2: mostrar seções com delays
      if (version === "2") {
        // Mostrar seção de urgência após 1:00 (60 segundos) de vídeo
        if (video.currentTime >= 60 && !showUrgency) {
          setShowUrgency(true)
        }
        
        // Mostrar CTA após 1:20 (80 segundos) de vídeo
        if (video.currentTime >= 80 && !showCTA) {
          setShowCTA(true)
        }
      }
    }

    const handleLoadedData = () => {
      console.log('🎥 Vídeo carregado com sucesso!', {
        duration: video.duration,
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      })
    }

    const handleError = (e: Event) => {
      console.error('❌ Erro ao carregar vídeo:', e)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [onTimeUpdate, showCTA, showUrgency, version])

  const handleVideoClick = async () => {
    console.log('🎬 handleVideoClick chamado!')
    const video = videoRef.current
    if (!video) {
      console.error('❌ videoRef não encontrado')
      return
    }

    console.log('📹 Estado atual do vídeo:', {
      paused: video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState
    })

    if (video.paused) {
      try {
        console.log('▶️ Tentando iniciar vídeo...')
        // Primeiro tenta com som
        video.muted = false
        setIsMuted(false)
        await video.play()
        console.log('✅ Vídeo iniciado com sucesso!')
        setIsPlaying(true)
        
        // Mostrar símbolo "on going video" por 2 segundos
        setShowOnGoingVideo(true)
        setTimeout(() => {
          setShowOnGoingVideo(false)
        }, 2000)
        
      } catch (err) {
        console.error("❌ Falha ao iniciar vídeo com som:", err)
        // Fallback: tenta mutado
        try {
          video.muted = true
          setIsMuted(true)
          await video.play()
          console.log("✅ Vídeo iniciado no modo mudo como fallback.")
          setIsPlaying(true)
          
          // Mostrar símbolo "on going video" por 2 segundos
          setShowOnGoingVideo(true)
          setTimeout(() => {
            setShowOnGoingVideo(false)
          }, 2000)
          
        } catch (fallbackErr) {
          console.error("❌ Falha ao iniciar vídeo no modo mudo:", fallbackErr)
          setIsPlaying(false)
        }
      }
    } else {
      console.log('⏸️ Pausando vídeo...')
      video.pause()
      setIsPlaying(false)
    }
  }

  const unmuteVideo = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (video) {
      video.muted = false
      setIsMuted(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="text-center mb-4">
        <p className="text-lg text-text-primary font-semibold mb-2">
          ASSISTA COMO FUNCIONA
        </p>
        <p className="text-text-secondary text-sm">
          Descubra como empresas de energia solar estão multiplicando vendas
        </p>
      </div>

      <div className="relative group">
        <video
          ref={videoRef}
          className="w-full aspect-[9/16] object-cover rounded-2xl shadow-2xl cursor-pointer"
          playsInline
          loop
          muted
          onClick={handleVideoClick}
        >
          <source src="/video-de-vendas.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>

        {!isPlaying && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl transition-all duration-300"
            onClick={handleVideoClick}
          >
            {/* Overlay escuro semi-transparente cobrindo todo o vídeo */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl"></div>
            
            {/* Botão de Play Circular Centralizado */}
            <div className="relative z-10 text-center text-white pointer-events-auto">
              {/* Círculo escuro com backdrop-blur */}
              <div 
                className="w-24 h-24 mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('🎯 Clique no botão de play!')
                  handleVideoClick()
                }}
              >
                <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                  {/* Ícone de Play triangular branco */}
                  <svg
                    className="w-12 h-12 text-white ml-1 drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Texto "Clique para assistir" */}
              <p className="text-lg font-medium text-white">
                Clique para assistir
              </p>
            </div>
          </div>
        )}

        {/* Símbolo "On Going Video" - Aparece por 2 segundos após clicar play */}
        {showOnGoingVideo && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/80 backdrop-blur-md rounded-full p-6 border border-white/30 shadow-2xl">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-3">
                  <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium">Reproduzindo...</p>
              </div>
            </div>
          </motion.div>
        )}

        {isPlaying && isMuted && (
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={unmuteVideo}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
              title="Ativar som"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </button>
          </div>
        )}

        {isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl z-10"
            onClick={handleVideoClick}
          >
            <div className="w-16 h-16 bg-black/60 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Urgência - Apenas na versão 2 com delays */}
      {version === "2" && showUrgency && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">⏰</span>
                <h3 className="text-xl font-bold text-red-400">
                  URGENTE: Oportunidade Limitada
                </h3>
              </div>
              <p className="text-text-secondary mb-4">
                <strong className="text-red-400">Apenas 3 empresas</strong> serão selecionadas para implementar nosso sistema este mês.
                <br />
                <span className="text-red-300 font-semibold">Quem implementar primeiro, vende primeiro!</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTA Button - Apenas na versão 2 com delays */}
      {version === "2" && showCTA && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/strategy-call"
            className="btn-minimal px-8 py-4 text-lg font-medium w-full"
          >
            Agendar Consultoria Gratuita
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

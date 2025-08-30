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
      console.log('✅ Vídeo carregado com sucesso!', {
        duration: video.duration,
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      })
    }

    const handleCanPlay = () => {
      console.log('🎬 Vídeo pronto para reprodução!')
    }

    const handleError = (e: Event) => {
      console.error('Erro ao carregar vídeo:', e)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [onTimeUpdate, showCTA, showUrgency, version])

  const handleVideoClick = async () => {
    console.log('handleVideoClick chamado!')
    const video = videoRef.current
    if (!video) {
      console.error('❌ videoRef não encontrado')
      return
    }

    console.log('📊 Estado atual do vídeo:', {
      paused: video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState,
      networkState: video.networkState
    })

    if (video.paused) {
      try {
        console.log('▶️ Tentando iniciar vídeo...')
        
        // Garantir que o vídeo está pronto
        if (video.readyState < 2) {
          console.log('⏳ Vídeo ainda não está pronto, aguardando...')
          await new Promise(resolve => {
            video.addEventListener('canplay', resolve, { once: true })
          })
        }
        
        // Configurar áudio obrigatório
        video.muted = false
        video.volume = 1
        
        // Tentar reproduzir
        await video.play()
        console.log('✅ Vídeo iniciado com sucesso!')
        setIsPlaying(true)
        
        // Mostrar símbolo "on going video" por 2 segundos
        setShowOnGoingVideo(true)
        setTimeout(() => {
          setShowOnGoingVideo(false)
        }, 2000)
        
      } catch (err) {
        console.error("❌ Falha ao iniciar vídeo:", err)
        
        // Fallback: tentar com áudio mudo (mais compatível)
        try {
          console.log('🔄 Tentando fallback com áudio mudo...')
          video.muted = true
          await video.play()
          console.log('✅ Vídeo iniciado com fallback!')
          setIsPlaying(true)
          
          setShowOnGoingVideo(true)
          setTimeout(() => {
            setShowOnGoingVideo(false)
          }, 2000)
          
        } catch (fallbackErr) {
          console.error("❌ Fallback também falhou:", fallbackErr)
          setIsPlaying(false)
        }
      }
    } else {
      console.log('⏸️ Pausando vídeo...')
      video.pause()
      setIsPlaying(false)
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

      <div className="relative group" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          className="w-full aspect-[9/16] object-cover rounded-2xl shadow-2xl cursor-pointer"
          playsInline
          loop
          poster="/thumbmail_vsl.png"
          preload="metadata"
          onClick={handleVideoClick}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          crossOrigin="anonymous"
        >
          {/* Usar Vercel Storage sempre */}
          <source 
            src={process.env.NEXT_PUBLIC_VIDEO_URL || 'https://n5c9lgm3cwpfoiun.public.blob.vercel-storage.com/video-de-vendas.mp4'} 
            type="video/mp4" 
          />
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
                  console.log('Clique no botão de play!')
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
            className="absolute top-4 right-4 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/70 backdrop-blur-md rounded-full px-3 py-2 border border-white/30 shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Reproduzindo</span>
              </div>
            </div>
          </motion.div>
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



      {/* CTA Button - Sempre visível na versão 1, com delays na versão 2 */}
      {(version === "1" || showCTA) && (
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/strategy-call"
            className="btn-minimal px-8 py-4 text-lg font-medium text-center min-w-[280px] max-w-md"
          >
            AGENDAR SESSÃO ESTRATÉGICA
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

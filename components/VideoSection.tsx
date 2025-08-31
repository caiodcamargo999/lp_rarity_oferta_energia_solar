'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import VideoPerformanceMonitor from './VideoPerformanceMonitor'

interface VideoSectionProps {
  version?: "1" | "2"
  onTimeUpdate?: (time: number) => void
  onUrgencyChange?: (show: boolean) => void
  onCTAChange?: (show: boolean) => void
}

export default function VideoSection({ version = "1", onTimeUpdate, onUrgencyChange, onCTAChange }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [showUrgency, setShowUrgency] = useState(false)
  const [showOnGoingVideo, setShowOnGoingVideo] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // ===== DETECÇÃO AUTOMÁTICA DE AMBIENTE =====
  const siteUrl = process.env.NODE_ENV === 'development' 
    ? process.env.NEXT_PUBLIC_SITE_URL_LOCAL 
    : process.env.NEXT_PUBLIC_SITE_URL_PROD;

  // ===== FONTES DE VÍDEO - CLOUDFLARE R2 =====
  const videoSources = [
    // 1. API Proxy (recomendado)
    "/api/video-proxy",
    // 2. URL direta do Cloudflare R2 (se configurada)
    process.env.NEXT_PUBLIC_VIDEO_URL || "",
    // 3. URL local (para desenvolvimento)
    "/video-de-vendas.mp4"
  ].filter(Boolean) // Remove URLs vazias

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
          console.log('⏰ 1:00 atingido - Mostrando seção de urgência!')
          setShowUrgency(true)
          if (onUrgencyChange) onUrgencyChange(true)
        }
        
        // Mostrar CTA após 1:40 (100 segundos) de vídeo
        if (video.currentTime >= 100 && !showCTA) {
          console.log('🎯 1:40 atingido - Matheus falou "clique no botão abaixo"!')
          setShowCTA(true)
          if (onCTAChange) onCTAChange(true)
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
      setIsLoading(false)
      setVideoError(null)
    }

    const handleCanPlay = () => {
      console.log('🎬 Vídeo pronto para reprodução!')
      setIsLoading(false)
    }

    const handleError = (e: Event) => {
      console.error('❌ Erro ao carregar vídeo:', e)
      const target = e.target as HTMLVideoElement
      if (target.error) {
        console.error('📋 Detalhes do erro do vídeo:', {
          code: target.error.code,
          message: target.error.message
        })
        
        // ===== TRATAMENTO DE ERRO MELHORADO =====
        let errorMessage = 'Erro ao carregar vídeo'
        switch (target.error.code) {
          case 1:
            errorMessage = 'Vídeo interrompido pelo usuário'
            break
          case 2:
            errorMessage = 'Erro de rede ao carregar vídeo'
            break
          case 3:
            errorMessage = 'Vídeo corrompido ou formato não suportado'
            break
          case 4:
            errorMessage = 'Vídeo não pode ser reproduzido'
            break
          default:
            errorMessage = `Erro de vídeo: ${target.error.message}`
        }
        
        setVideoError(errorMessage)
        setIsLoading(false)
        
        // ===== TENTAR PRÓXIMA FONTE DE VÍDEO =====
        tryNextVideoSource()
      }
    }

    const handleLoadStart = () => {
      console.log('🚀 Iniciando carregamento do vídeo...')
      setIsLoading(true)
      setVideoError(null)
    }

    const handleProgress = () => {
      console.log('📈 Progresso do carregamento do vídeo...')
    }

    const handleCanPlayThrough = () => {
      console.log('🎯 Vídeo pode ser reproduzido completamente!')
      setIsLoading(false)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplaythrough', handleCanPlayThrough)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [onTimeUpdate, showCTA, showUrgency, version, onUrgencyChange, onCTAChange])

  // ===== FUNÇÃO PARA TENTAR PRÓXIMA FONTE DE VÍDEO =====
  const tryNextVideoSource = () => {
    const video = videoRef.current
    if (!video) return
    
    // Resetar vídeo
    video.pause()
    video.currentTime = 0
    video.load()
    
    console.log('🔄 Tentando próxima fonte de vídeo...')
  }

  // ===== USEEFFECT PARA GARANTIR QUE O VÍDEO NÃO RODE AUTOMATICAMENTE =====
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Garantir que o vídeo esteja pausado e na posição inicial
      video.pause()
      video.currentTime = 0
      video.muted = true
      video.volume = 0
    }
  }, [])

  const handleVideoClick = async () => {
    console.log('🎬 handleVideoClick chamado! Estado atual:', { isPlaying, isLoading, videoError })
    const video = videoRef.current
    if (!video) {
      console.error('❌ videoRef não encontrado')
      return
    }

    // ===== VERIFICAR SE HÁ ERRO DE VÍDEO =====
    if (videoError) {
      console.log('🔄 Tentando recarregar vídeo após erro...')
      setVideoError(null)
      setIsLoading(true)
      video.load()
      return
    }

    console.log('📊 Estado atual do vídeo:', {
      paused: video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState,
      networkState: video.networkState,
      isPlaying: isPlaying
    })

    // ===== LÓGICA CORRIGIDA DE PLAY/PAUSE =====
    if (video.paused || !isPlaying) {
      try {
        console.log('▶️ Tentando iniciar vídeo...')
        
        // Garantir que o vídeo está pronto
        if (video.readyState < 2) {
          console.log('⏳ Vídeo ainda não está pronto, aguardando...')
          await new Promise(resolve => {
            video.addEventListener('canplay', resolve, { once: true })
          })
        }
        
        // IMPORTANTE: Permitir áudio para melhor experiência do usuário
        video.muted = false
        video.volume = 0.7
        
        console.log('🎵 Configurações de áudio:', {
          muted: video.muted,
          volume: video.volume,
          readyState: video.readyState
        })
        
        // Tentar reproduzir
        await video.play()
        console.log('✅ Vídeo iniciado com sucesso!')
        setIsPlaying(true)
        
      } catch (err) {
        console.error("❌ Falha ao iniciar vídeo:", err)
        
        // Fallback: tentar com áudio mudo para compatibilidade
        try {
          console.log('🔄 Tentando fallback com áudio mudo...')
          video.muted = true
          video.volume = 0
          video.playsInline = true
          
          // Aguardar um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 100))
          
          await video.play()
          console.log('✅ Vídeo iniciado com fallback (áudio mudo)!')
          setIsPlaying(true)
          
        } catch (fallbackErr) {
          console.error("❌ Fallback também falhou:", fallbackErr)
          setIsPlaying(false)
          
          // Mostrar mensagem de erro para o usuário
          alert('Erro ao reproduzir vídeo. Tente recarregar a página.')
        }
      }
    } else {
      // ===== PAUSAR VÍDEO - CORRIGIDO =====
      try {
        console.log('⏸️ Pausando vídeo... Estado antes:', { isPlaying, videoPaused: video.paused })
        video.pause()
        setIsPlaying(false)
        console.log('✅ Vídeo pausado com sucesso! Estado depois:', { isPlaying: false, videoPaused: video.paused })
      } catch (error) {
        console.error('❌ Erro ao pausar vídeo:', error)
        // Forçar pausa mesmo com erro
        video.pause()
        setIsPlaying(false)
      }
    }
  }

  // ===== RENDERIZAÇÃO CONDICIONAL BASEADA NO ESTADO =====
  if (videoError) {
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

        {/* ===== ESTADO DE ERRO ===== */}
        <div className="relative bg-gray-800 rounded-2xl p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao Carregar Vídeo</h3>
          <p className="text-gray-300 mb-4">{videoError}</p>
          <button
            onClick={tryNextVideoSource}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </motion.div>
    )
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
          poster="/thumbmail_vsl.png"
          preload="metadata"
          onClick={handleVideoClick}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          crossOrigin="anonymous"
          muted
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          // ===== OTIMIZAÇÕES DE PERFORMANCE =====
          width={384}
          height={682}
        >
          {/* ===== FONTES DE VÍDEO MÚLTIPLAS COM FALLBACKS ===== */}
          {videoSources.map((source, index) => (
            <source 
              key={index}
              src={source} 
              type="video/mp4" 
            />
          ))}
          Seu navegador não suporta vídeos.
        </video>

        {/* ===== INDICADOR DE CARREGAMENTO ===== */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">Carregando vídeo...</p>
            </div>
          </div>
        )}

        {!isPlaying && !isLoading && (
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
                onClick={handleVideoClick}
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
              <p className="text-body font-medium text-white">
                Clique para assistir
              </p>
            </div>
          </div>
        )}

        {/* Símbolo "On Going Video" - REMOVIDO COMPLETAMENTE */}

        {isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl z-10"
            onClick={handleVideoClick}
          >
            {/* ===== CONTROLES DE PAUSA MELHORADOS ===== */}
            <div className="w-16 h-16 bg-black/60 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </div>
            
            {/* ===== INDICADOR DE PAUSA - REMOVIDO ===== */}
          </div>
        )}
      </div>

      {/* CTA Button - Sempre visível na versão 1, com delays na versão 2 */}
      {(version === "1" || showCTA) && (
        <motion.div
          className="mt-8 flex justify-center w-full" /* Ajustado espaçamento e largura */
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/strategy-call"
            className="btn-minimal w-full max-w-md" /* Removido classes conflitantes */
          >
            AGENDAR SESSÃO ESTRATÉGICA
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import Image from 'next/image'

interface OptimizedVideoProps {
  src: string
  poster: string
  onTimeUpdate?: (time: number) => void
  onPlay?: () => void
  onPause?: () => void
  className?: string
  fallbackSources?: string[] // Fontes de fallback
}

export default function OptimizedVideo({
  src,
  poster,
  onTimeUpdate,
  onPlay,
  onPause,
  className = '',
  fallbackSources = []
}: OptimizedVideoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showPauseButton, setShowPauseButton] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [hasTriedFallback, setHasTriedFallback] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  
  // ===== FONTES DE VÍDEO COM FALLBACKS =====
  const allSources = [src, ...fallbackSources]
  const currentSource = allSources[currentSourceIndex]


  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    // ===== CONFIGURAÇÕES OTIMIZADAS PARA REPRODUÇÃO IMEDIATA =====
    video.preload = 'auto' // Mudança: auto para pré-carregar o vídeo
    video.playsInline = true
    video.muted = true
    
    // ===== CONFIGURAÇÕES DE BUFFER OTIMIZADAS =====
    // Configurar buffer para reprodução suave
    // video.buffered é somente leitura, não pode ser atribuído
    video.load()
    
    // ===== CONFIGURAÇÕES DE PERFORMANCE =====
    // Otimizar para reprodução imediata
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('x5-playsinline', 'true')
    
    // Configurar para melhor performance
    video.setAttribute('data-setup', '{}')
    video.setAttribute('data-keep-alive', 'true')
    
    // ===== EVENT LISTENERS OTIMIZADOS =====
    const handleLoadStart = () => {
      console.log('🎬 Iniciando carregamento do vídeo...')
      setIsLoading(true)
    }
    
    const handleCanPlay = () => {
      console.log('✅ Vídeo pode reproduzir - buffer suficiente')
      setIsVideoLoaded(true)
      setIsLoading(false)
    }
    
    const handleCanPlayThrough = () => {
      console.log('🚀 Vídeo totalmente carregado - reprodução garantida')
      setIsVideoLoaded(true)
      setIsLoading(false)
    }
    
    const handleWaiting = () => {
      console.log('⏳ Aguardando buffer...')
      setIsBuffering(true)
    }
    
    const handlePlaying = () => {
      console.log('▶️ Vídeo reproduzindo')
      setIsBuffering(false)
    }
    
    const handleStalled = () => {
      console.log('⚠️ Vídeo travado - tentando recuperar...')
      setIsBuffering(true)
    }
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          const progress = (bufferedEnd / duration) * 100
          setLoadProgress(progress)
          console.log(`📊 Buffer: ${progress.toFixed(1)}%`)
        }
      }
    }
    
    const handleLoadedData = () => {
      console.log('📦 Dados do vídeo carregados')
      setIsVideoLoaded(true)
    }
    
    const handleError = (e: Event) => {
      console.error('❌ Erro no vídeo:', e)
      setIsLoading(false)
      setIsBuffering(false)
      
      // ===== TENTAR FALLBACK SE DISPONÍVEL =====
      if (currentSourceIndex < allSources.length - 1 && !hasTriedFallback) {
        console.log(`🔄 Tentando fallback ${currentSourceIndex + 1}/${allSources.length - 1}`)
        setCurrentSourceIndex(prev => prev + 1)
        setHasTriedFallback(true)
        
        // Recarregar vídeo com nova fonte
        setTimeout(() => {
          if (video) {
            video.load()
          }
        }, 1000)
      } else {
        console.error('❌ Todos os fallbacks falharam')
      }
    }
    
    // ===== INTERSECTION OBSERVER OTIMIZADO =====
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('👁️ Vídeo visível - iniciando pré-carregamento')
          // Forçar carregamento quando visível
          if (video.readyState === 0) {
            video.load()
          }
        }
      })
    }
    
    // ===== ADICIONAR EVENT LISTENERS =====
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    
    // ===== OBSERVER COM CONFIGURAÇÕES OTIMIZADAS =====
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Carregar quando 10% visível
      rootMargin: '100px' // Carregar 100px antes de ficar visível
    })
    observer.observe(video)
    
    return () => {
      observer.disconnect()
      // Limpar event listeners
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const handlePlay = async () => {
    const video = videoRef.current
    if (!video) return
    
    try {
      console.log('🎬 Iniciando reprodução do vídeo...')
      setIsLoading(true)
      
      // ===== CONFIGURAÇÕES OTIMIZADAS =====
      video.muted = false
      video.volume = 1.0
      
      // ===== VERIFICAR ESTADO DO VÍDEO =====
      console.log('📊 Estado do vídeo:', {
        readyState: video.readyState,
        networkState: video.networkState,
        buffered: video.buffered.length > 0 ? `${video.buffered.end(0).toFixed(1)}s` : '0s',
        duration: video.duration ? `${video.duration.toFixed(1)}s` : 'desconhecida'
      })
      
      // ===== ESTRATÉGIA DE REPRODUÇÃO INTELIGENTE =====
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA ou HAVE_ENOUGH_DATA
        console.log('✅ Vídeo pronto - reproduzindo imediatamente')
        await video.play()
      } else if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        console.log('⏳ Vídeo parcialmente carregado - aguardando buffer...')
        // Aguardar um pouco para mais dados carregarem
        await new Promise(resolve => setTimeout(resolve, 200))
        await video.play()
      } else {
        console.log('🔄 Vídeo não carregado - forçando carregamento...')
        video.load()
        // Aguardar carregamento
        await new Promise(resolve => setTimeout(resolve, 1000))
        await video.play()
      }
      
      // ===== SUCESSO - ATUALIZAR ESTADOS =====
      console.log('🚀 Vídeo reproduzindo com sucesso!')
      setIsVideoLoaded(true)
      setIsPlaying(true)
      setShowPlayButton(false)
      setIsLoading(false)
      
      // Mostrar botão de pause por 2 segundos
      setShowPauseButton(true)
      setTimeout(() => {
        setShowPauseButton(false)
      }, 2000)
      
      onPlay?.()
      
    } catch (error) {
      console.error('❌ Erro ao reproduzir vídeo:', error)
      
      // ===== ESTRATÉGIA DE FALLBACK INTELIGENTE =====
      try {
        console.log('🔄 Tentando fallback com muted...')
        video.muted = true
        await video.play()
        
        console.log('✅ Fallback com muted funcionou - ativando áudio...')
        // Ativar áudio gradualmente
        setTimeout(() => {
          video.muted = false
          video.volume = 1.0
          console.log('🔊 Áudio ativado')
        }, 500)
        
        // Atualizar estados
        setIsVideoLoaded(true)
        setIsPlaying(true)
        setShowPlayButton(false)
        setIsLoading(false)
        onPlay?.()
        
      } catch (retryError) {
        console.error('❌ Erro na segunda tentativa:', retryError)
        setIsLoading(false)
        
        // ===== ÚLTIMA TENTATIVA - FORÇAR CARREGAMENTO =====
        try {
          console.log('🔄 Última tentativa - recarregando vídeo...')
          video.load()
          await new Promise(resolve => setTimeout(resolve, 2000))
          video.muted = true
          await video.play()
          
          setIsVideoLoaded(true)
          setIsPlaying(true)
          setShowPlayButton(false)
          setIsLoading(false)
          onPlay?.()
          
        } catch (finalError) {
          console.error('❌ Falha total na reprodução:', finalError)
          setIsLoading(false)
        }
      }
    }
  }

  const handlePause = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    setIsPlaying(false)
    setIsBuffering(false) // Reset buffering state when pausing
    // NÃO definir setIsVideoLoaded(false) - manter vídeo carregado
    setShowPlayButton(true) // Mostrar botão de play
    setShowPauseButton(false) // Esconder botão de pause ao pausar
    onPause?.()
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const time = video.currentTime
    setCurrentTime(time)
    onTimeUpdate?.(time)
  }

  const handleVideoClick = () => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const handleVideoDoubleClick = () => {
    // Permitir pausar com duplo clique quando o botão não está visível
    if (isPlaying && !showPauseButton) {
      handlePause()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {!isVideoLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <Image
              src={poster}
              alt="Thumbnail do vídeo"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-xl"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => {
          // Vídeo carregado mas manter thumbnail
        }}
        onCanPlay={() => {
          // Vídeo pode reproduzir mas manter thumbnail
        }}
        onError={(e) => {
          console.error('❌ Erro no elemento vídeo:', e)
        }}
        playsInline
        muted
        preload="auto"
      >
        <source src={currentSource} type="video/mp4" />
        {allSources.map((source, index) => (
          <source 
            key={index} 
            src={source} 
            type="video/mp4" 
            data-index={index}
          />
        ))}
        Seu navegador não suporta vídeos.
      </video>
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
      >
        <AnimatePresence>
          {showPlayButton && !isLoading && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="w-24 h-24 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-105 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation()
                handlePlay()
              }}
            >
              <Play className="w-12 h-12 text-white ml-1" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Indicador de Carregamento com Progresso */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-white text-sm font-medium mb-2">Carregando vídeo...</div>
                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-white/70 text-xs mt-1">{loadProgress.toFixed(0)}%</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de Buffer - Apenas quando reproduzindo */}
        <AnimatePresence>
          {isBuffering && isPlaying && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl"
            >
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin mx-auto"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>




        <AnimatePresence>
          {showPauseButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <button
                className="w-16 h-16 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePause()
                }}
              >
                <Pause className="w-8 h-8 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  )
}

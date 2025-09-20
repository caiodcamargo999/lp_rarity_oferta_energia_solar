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
}

export default function OptimizedVideo({
  src,
  poster,
  onTimeUpdate,
  onPlay,
  onPause,
  className = ''
}: OptimizedVideoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showPauseButton, setShowPauseButton] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    // Configurações básicas sem otimizações agressivas
    video.preload = 'metadata' // Mudança: metadata em vez de auto
    video.playsInline = true
    video.muted = true
    
    // Não aplicar otimizações agressivas que podem causar travamento
    // applyVideoOptimizations(video)
    
    // Não otimizar URL que pode causar problemas
    // const optimizedSrc = optimizeVideoUrl(src)
    // if (optimizedSrc !== src) {
    //   video.src = optimizedSrc
    // }
    
    // Configurações básicas sem monitoramento complexo
    
    // Não carregar automaticamente - deixar para o usuário
    // video.load()
    
    // Configurações de buffer para reprodução suave
    video.addEventListener('loadstart', () => {
      // Iniciando carregamento do vídeo
    })
    
    video.addEventListener('canplay', () => {
      setIsVideoLoaded(true)
    })
    
    video.addEventListener('canplaythrough', () => {
      // Vídeo carregado completamente
    })
    
    video.addEventListener('waiting', () => {
      setIsBuffering(true)
    })
    
    video.addEventListener('playing', () => {
      setIsBuffering(false)
    })
    
    video.addEventListener('stalled', () => {
      setIsBuffering(true)
    })
    
    video.addEventListener('progress', () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          const progress = (bufferedEnd / duration) * 100
          setLoadProgress(progress)
        }
      }
    })
    
    video.addEventListener('loadeddata', () => {
      setIsVideoLoaded(true)
    })
    
    video.addEventListener('error', (e) => {
      console.error('❌ Erro no vídeo:', e)
    })
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isVideoLoaded) {
          // Carregar apenas quando necessário e sem forçar
          if (video.readyState === 0) {
            video.load()
          }
          setIsVideoLoaded(true)
        }
      })
    }
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Mudança: 0.5 em vez de 0.1 para carregar mais tarde
      rootMargin: '50px' // Mudança: 50px em vez de 100px
    })
    observer.observe(video)
    
    return () => {
      observer.disconnect()
      // Limpar event listeners
      video.removeEventListener('loadstart', () => {})
      video.removeEventListener('canplay', () => {})
      video.removeEventListener('canplaythrough', () => {})
      video.removeEventListener('waiting', () => {})
      video.removeEventListener('playing', () => {})
      video.removeEventListener('stalled', () => {})
      video.removeEventListener('error', () => {})
      video.removeEventListener('progress', () => {})
      video.removeEventListener('loadeddata', () => {})
    }
  }, [isVideoLoaded])

  const handlePlay = async () => {
    const video = videoRef.current
    if (!video) return
    
    try {
      setIsLoading(true)
      
      // Configurações simples
      video.muted = false
      video.volume = 1.0
      
      // Carregar vídeo apenas quando necessário
      if (video.readyState === 0) {
        video.load()
        // Aguardar um pouco para o vídeo carregar
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Tentar reproduzir diretamente
      await video.play()
      
      setIsPlaying(true)
      setShowPlayButton(false)
      
      // Mostrar botão de pause por 2 segundos
      setShowPauseButton(true)
      setTimeout(() => {
        setShowPauseButton(false)
      }, 2000)
      
      onPlay?.()
      
    } catch (error) {
      console.error('❌ Erro ao reproduzir vídeo:', error)
      
      // Estratégia simples de fallback
      try {
        video.muted = true
        await video.play()
        
        // Ativar áudio depois
        setTimeout(() => {
          video.muted = false
          video.volume = 1.0
        }, 1000)
        
        setIsPlaying(true)
        setShowPlayButton(false)
        onPlay?.()
        
      } catch (retryError) {
        console.error('❌ Erro na segunda tentativa:', retryError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePause = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    setIsPlaying(false)
    setIsBuffering(false) // Reset buffering state when pausing
    setShowPlayButton(true)
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
        onLoadedData={() => setIsVideoLoaded(true)}
        onCanPlay={() => {
          setIsVideoLoaded(true)
        }}
        onError={(e) => {
          console.error('❌ Erro no elemento vídeo:', e)
        }}
        playsInline
        muted
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
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

        {/* Indicador de Carregamento */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
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

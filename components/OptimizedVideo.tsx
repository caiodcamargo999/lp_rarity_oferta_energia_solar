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

  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.preload = 'metadata'
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isVideoLoaded) {
          video.load()
          setIsVideoLoaded(true)
        }
      })
    }
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px'
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [isVideoLoaded])

  const handlePlay = async () => {
    const video = videoRef.current
    if (!video) return
    try {
      setIsLoading(true)
      
      // Ativar áudio automaticamente
      video.muted = false
      video.volume = 1.0
      
      await video.play()
      setIsPlaying(true)
      setShowPlayButton(false)
      onPlay?.()
    } catch (error) {
      console.error('Erro ao reproduzir vídeo:', error)
      // Se falhar, tenta novamente com áudio
      try {
        video.muted = false
        await video.play()
        setIsPlaying(true)
        setShowPlayButton(false)
        onPlay?.()
      } catch (retryError) {
        console.error('Erro na segunda tentativa:', retryError)
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
    setShowPlayButton(true)
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
        playsInline
        muted
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Seu navegador não suporta vídeos.
      </video>
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={handleVideoClick}
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

        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
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

'use client'

import { useEffect, useState } from 'react'

interface VideoPerformanceMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>
}

export default function VideoPerformanceMonitor({ videoRef }: VideoPerformanceMonitorProps) {
  const [performanceData, setPerformanceData] = useState({
    fps: 0,
    bufferHealth: 0,
    networkActivity: 0,
    droppedFrames: 0,
    memoryUsage: 0
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let frameCount = 0
    let lastTime = globalThis.performance.now()
    let bufferCheckInterval: NodeJS.Timeout
    let performanceCheckInterval: NodeJS.Timeout

    // ===== MONITORAMENTO DE FPS =====
    const checkFPS = () => {
      const currentTime = globalThis.performance.now()
      const deltaTime = currentTime - lastTime
      
      if (deltaTime > 0) {
        const currentFPS = Math.round((1000 / deltaTime) * frameCount)
        setPerformanceData(prev => ({ ...prev, fps: currentFPS }))
      }
      
      frameCount = 0
      lastTime = currentTime
    }

    // ===== MONITORAMENTO DE BUFFER =====
    const checkBufferHealth = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const currentTime = video.currentTime
        const bufferHealth = Math.round(((bufferedEnd - currentTime) / 10) * 100) // 10s de buffer = 100%
        setPerformanceData(prev => ({ ...prev, bufferHealth: Math.max(0, Math.min(100, bufferHealth)) }))
      }
    }

    // ===== MONITORAMENTO DE MEMÓRIA =====
    const checkMemoryUsage = () => {
      if ('memory' in globalThis.performance) {
        const memory = (globalThis.performance as any).memory
        const memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        setPerformanceData(prev => ({ ...prev, memoryUsage }))
      }
    }

    // ===== EVENTOS DE PERFORMANCE =====
    const handleWaiting = () => {
      console.log('⚠️ Vídeo travou - aguardando buffer...')
      setPerformanceData(prev => ({ ...prev, droppedFrames: prev.droppedFrames + 1 }))
    }

    const handleStalled = () => {
      console.log('🚫 Vídeo parou - problema de rede detectado')
    }

    const handleCanPlay = () => {
      console.log('✅ Vídeo pode reproduzir - buffer saudável')
    }

    // ===== INICIAR MONITORAMENTO =====
    bufferCheckInterval = setInterval(checkBufferHealth, 1000) // A cada 1 segundo
    performanceCheckInterval = setInterval(checkFPS, 1000) // A cada 1 segundo

    // ===== EVENT LISTENERS =====
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      clearInterval(bufferCheckInterval)
      clearInterval(performanceCheckInterval)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [videoRef])

  // ===== RENDERIZAR APENAS EM DESENVOLVIMENTO =====
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <h3 className="font-bold mb-2">🎬 Performance do Vídeo</h3>
      <div className="space-y-1">
        <div>FPS: <span className={performanceData.fps < 24 ? 'text-red-400' : 'text-green-400'}>{performanceData.fps}</span></div>
        <div>Buffer: <span className={performanceData.bufferHealth < 50 ? 'text-red-400' : 'text-green-400'}>{performanceData.bufferHealth}%</span></div>
        <div>Frames Perdidos: <span className="text-yellow-400">{performanceData.droppedFrames}</span></div>
        <div>Memória: <span className={performanceData.memoryUsage > 80 ? 'text-red-400' : 'text-green-400'}>{performanceData.memoryUsage}%</span></div>
      </div>
      
      {/* ===== DICAS DE PERFORMANCE ===== */}
      {performanceData.fps < 24 && (
        <div className="mt-2 p-2 bg-red-900/50 rounded text-xs">
          ⚠️ FPS baixo - Verifique performance do dispositivo
        </div>
      )}
      
      {performanceData.bufferHealth < 30 && (
        <div className="mt-2 p-2 bg-yellow-900/50 rounded text-xs">
          ⚠️ Buffer baixo - Problema de rede ou servidor
        </div>
      )}
    </div>
  )
}

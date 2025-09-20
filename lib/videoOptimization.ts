/**
 * Configurações de otimização para reprodução de vídeo
 * Especialmente otimizado para Cloudflare R2
 */

export interface VideoOptimizationConfig {
  // Configurações de buffer
  bufferSize: number
  preloadBuffer: number
  maxBufferSize: number
  
  // Configurações de qualidade
  qualityLevels: string[]
  adaptiveBitrate: boolean
  
  // Configurações de rede
  retryAttempts: number
  retryDelay: number
  timeout: number
  
  // Configurações de performance
  hardwareAcceleration: boolean
  lowLatencyMode: boolean
}

export const defaultVideoConfig: VideoOptimizationConfig = {
  // Buffer otimizado para vídeos grandes (1.7GB)
  bufferSize: 30, // 30 segundos de buffer
  preloadBuffer: 10, // 10 segundos de preload
  maxBufferSize: 60, // Máximo 60 segundos de buffer
  
  // Qualidade adaptativa
  qualityLevels: ['1080p', '720p', '480p', '360p'],
  adaptiveBitrate: true,
  
  // Configurações de rede robustas
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
  timeout: 30000, // 30 segundos
  
  // Performance máxima
  hardwareAcceleration: true,
  lowLatencyMode: false // Para vídeos de marketing, não precisamos de latência ultra-baixa
}

/**
 * Aplica configurações otimizadas ao elemento de vídeo
 */
export function applyVideoOptimizations(video: HTMLVideoElement): void {
  // Configurações de buffer
  video.preload = 'auto'
  
  // Configurações de performance
  video.style.willChange = 'transform'
  video.style.transform = 'translateZ(0)' // Aceleração de hardware
  
  // Configurações de rede
  video.crossOrigin = 'anonymous'
  
  // Configurações de reprodução
  video.playsInline = true
  video.muted = true // Iniciar mutado para evitar problemas de autoplay
  
  // Configurações de qualidade
  if ('requestVideoFrameCallback' in video) {
    // API moderna para melhor sincronização de frames
    console.log('🎬 Usando API moderna de vídeo')
  }
}

/**
 * Monitora a qualidade da conexão e ajusta a reprodução
 */
export function setupConnectionMonitoring(video: HTMLVideoElement): () => void {
  let lastBufferTime = 0
  let stallCount = 0
  const maxStalls = 3
  
  const handleWaiting = () => {
    const now = Date.now()
    if (now - lastBufferTime < 5000) { // Stall muito próximo do anterior
      stallCount++
      console.warn(`⚠️ Múltiplos stalls detectados: ${stallCount}/${maxStalls}`)
      
      if (stallCount >= maxStalls) {
        console.log('🔄 Muitos stalls - tentando recarregar vídeo...')
        video.load()
        stallCount = 0
      }
    } else {
      stallCount = 0
    }
    lastBufferTime = now
  }
  
  const handleCanPlay = () => {
    stallCount = 0 // Reset contador quando vídeo volta a funcionar
  }
  
  video.addEventListener('waiting', handleWaiting)
  video.addEventListener('canplay', handleCanPlay)
  
  // Cleanup function
  return () => {
    video.removeEventListener('waiting', handleWaiting)
    video.removeEventListener('canplay', handleCanPlay)
  }
}

/**
 * Otimiza a URL do vídeo para melhor performance
 */
export function optimizeVideoUrl(url: string): string {
  // Adicionar parâmetros de otimização para Cloudflare R2
  const urlObj = new URL(url)
  
  // Parâmetros de otimização para Cloudflare
  urlObj.searchParams.set('format', 'mp4')
  urlObj.searchParams.set('quality', 'auto')
  urlObj.searchParams.set('fps', '30')
  
  return urlObj.toString()
}

/**
 * Detecta problemas de conectividade e sugere soluções
 */
export function detectConnectionIssues(video: HTMLVideoElement): {
  isSlowConnection: boolean
  suggestedQuality: string
  recommendedAction: string
} {
  const networkInfo = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  
  let isSlowConnection = false
  let suggestedQuality = '1080p'
  let recommendedAction = 'continue'
  
  if (networkInfo) {
    const effectiveType = networkInfo.effectiveType
    const downlink = networkInfo.downlink
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
      isSlowConnection = true
      suggestedQuality = '360p'
      recommendedAction = 'reduce_quality'
    } else if (effectiveType === '3g' || downlink < 2) {
      suggestedQuality = '720p'
      recommendedAction = 'monitor'
    }
  }
  
  return {
    isSlowConnection,
    suggestedQuality,
    recommendedAction
  }
}

/**
 * Configurações específicas para Cloudflare R2
 */
export const cloudflareR2Config = {
  // Headers otimizados para R2
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'public, max-age=31536000',
    'Accept': 'video/mp4,video/webm,video/*;q=0.9,*/*;q=0.8'
  },
  
  // URLs de fallback
  fallbackUrls: [
    'https://pub-16c2712dc3da48989f1715cd08cfe1b1.r2.dev/video-google-ads.mp4',
    'https://pub-bf5dcdc4b650417585257574deb892a7.r2.dev/video-de-vendas.mp4'
  ],
  
  // Configurações de CDN
  cdnOptimizations: {
    useWebP: false, // Vídeos não usam WebP
    useAVIF: false, // Vídeos não usam AVIF
    compressionLevel: 'high',
    cacheStrategy: 'aggressive'
  }
}

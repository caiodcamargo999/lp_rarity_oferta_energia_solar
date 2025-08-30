import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // ===== DEBUG: VERIFICAR VARIÁVEIS DE AMBIENTE =====
    console.log('🔍 Variáveis de ambiente:', {
      NEXT_PUBLIC_VIDEO_URL: process.env.NEXT_PUBLIC_VIDEO_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    })
    
    // ===== URL DO VÍDEO - PRIORIDADE PARA VARIÁVEL DE AMBIENTE =====
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL || 'https://n5c9lgm3cwpfoiun.public.blob.vercel-storage.com/video-de-vendas.mp4'
    
    console.log('🎬 Tentando carregar vídeo de:', videoUrl)
    
    // ===== OTIMIZAÇÕES DE PERFORMANCE =====
    const range = request.headers.get('range')
    const start = range ? parseInt(range.replace('bytes=', '').split('-')[0]) : 0
    
    // Buscar o vídeo do Vercel Storage com range para streaming
    const response = await fetch(videoUrl, {
      headers: {
        'Range': range || 'bytes=0-',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      // ===== CONFIGURAÇÕES DE PERFORMANCE =====
      cache: 'force-cache',
      next: { revalidate: 31536000 }, // Cache por 1 ano
    })

    if (!response.ok) {
      console.error(`❌ Erro ao buscar vídeo: ${response.status} - ${response.statusText}`)
      throw new Error(`Failed to fetch video: ${response.status} - ${response.statusText}`)
    }

    console.log('✅ Vídeo carregado com sucesso! Status:', response.status)

    // Extrair headers importantes
    const contentLength = response.headers.get('content-length')
    const contentType = response.headers.get('content-type') || 'video/mp4'
    const acceptRanges = response.headers.get('accept-ranges') || 'bytes'
    const contentRange = response.headers.get('content-range')

    // ===== HEADERS OTIMIZADOS PARA PERFORMANCE =====
    const videoResponse = new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength || '',
        'Accept-Ranges': acceptRanges,
        // ===== CACHE AGGRESSIVO =====
        'Cache-Control': 'public, max-age=31536000, immutable, s-maxage=31536000',
        'ETag': `"video-${start}-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString(),
        // ===== CORS OTIMIZADO =====
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
        // ===== HEADERS DE VÍDEO =====
        ...(contentRange && { 'Content-Range': contentRange }),
        // ===== COMPRESSÃO =====
        'Vary': 'Accept-Encoding',
      },
    })

    return videoResponse

  } catch (error) {
    console.error('❌ Erro crítico no proxy de vídeo:', error)
    
    // ===== FALLBACK: TENTAR URL ALTERNATIVA =====
    try {
      console.log('🔄 Tentando URL alternativa...')
      const fallbackUrl = 'https://n5c9lgm3cwpfoiun.public.blob.vercel-storage.com/video-de-vendas.mp4'
      
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: { 'Range': request.headers.get('range') || 'bytes=0-' }
      })
      
      if (fallbackResponse.ok) {
        console.log('✅ Fallback funcionou!')
        return new NextResponse(fallbackResponse.body, {
          status: fallbackResponse.status,
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Length': fallbackResponse.headers.get('content-length') || '',
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError)
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao carregar vídeo',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL || 'https://n5c9lgm3cwpfoiun.public.blob.vercel-storage.com/video-de-vendas.mp4'
    
    // Buscar apenas headers do vídeo
    const response = await fetch(videoUrl, { method: 'HEAD' })

    if (!response.ok) {
      throw new Error(`Failed to fetch video headers: ${response.status}`)
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': response.headers.get('content-length') || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
      },
    })

  } catch (error) {
    console.error('Erro no HEAD do vídeo:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar headers do vídeo' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Max-Age': '86400',
    },
  })
}

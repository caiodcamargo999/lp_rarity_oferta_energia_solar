import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL || 'https://n5c9lgm3cwpfoiun.public.blob.vercel-storage.com/video-de-vendas.mp4'
    
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
      throw new Error(`Failed to fetch video: ${response.status}`)
    }

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
    console.error('Erro no proxy de vídeo:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar vídeo' },
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

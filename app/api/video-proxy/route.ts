import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // ===== DEBUG: VERIFICAR VARIÁVEIS DE AMBIENTE =====
    console.log('🔍 Variáveis de ambiente:', {
      NEXT_PUBLIC_VIDEO_URL: process.env.NEXT_PUBLIC_VIDEO_URL,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? '***' : 'undefined',
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? '***' : 'undefined',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    })
    
    // ===== CLOUDFLARE R2 - URL OBRIGATÓRIA =====
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL || 'https://77f677cc90bcd810f75c80680f636a46.r2.cloudflarestorage.com/vsl-solar-rarity-brasil/video-de-vendas.mp4'
    
    // ===== VERIFICAR SE A URL É VÁLIDA =====
    if (!videoUrl || videoUrl === '') {
      throw new Error('URL do vídeo não configurada. Configure NEXT_PUBLIC_VIDEO_URL com a URL do Cloudflare R2.')
    }
    
    console.log('🎬 Tentando carregar vídeo de:', videoUrl)
    
    // ===== OTIMIZAÇÕES DE PERFORMANCE =====
    const range = request.headers.get('range')
    const start = range ? parseInt(range.replace('bytes=', '').split('-')[0]) : 0
    
    // ===== CONFIGURAÇÕES OTIMIZADAS PARA STREAMING =====
    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: {
        'Range': range || 'bytes=0-',
        'Cache-Control': 'public, max-age=31536000, immutable',
        // ===== HEADERS PARA MELHOR PERFORMANCE =====
        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
        // ===== HEADERS PARA REDUZIR TRAVAMENTOS =====
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
      // ===== CONFIGURAÇÕES DE PERFORMANCE =====
      cache: 'force-cache',
      next: { revalidate: 31536000 }, // Cache por 1 ano
      // ===== TIMEOUT PARA EVITAR TRAVAMENTOS =====
      signal: AbortSignal.timeout(30000), // 30 segundos timeout
    })

    if (!response.ok) {
      console.error(`❌ Erro ao buscar vídeo: ${response.status} - ${response.statusText}`)
      
      // ===== TRATAMENTO ESPECÍFICO PARA ERROS COMUNS =====
      if (response.status === 403) {
        throw new Error('Acesso negado ao vídeo. Verifique permissões do Cloudflare R2.')
      } else if (response.status === 404) {
        throw new Error('Vídeo não encontrado. Verifique se o arquivo foi uploadado no Cloudflare R2.')
      } else if (response.status >= 500) {
        throw new Error('Erro interno do servidor de vídeo. Tente novamente mais tarde.')
      } else {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }
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
        // ===== HEADERS PARA MELHOR PERFORMANCE =====
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    })

    return videoResponse

  } catch (error) {
    console.error('❌ Erro crítico no proxy de vídeo:', error)
    
    // ===== RESPOSTA DE ERRO DETALHADA =====
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    return NextResponse.json(
      { 
        error: 'Erro ao carregar vídeo',
        message: errorMessage,
        details: error instanceof Error ? error.stack : 'Sem detalhes disponíveis',
        timestamp: new Date().toISOString(),
        suggestions: [
          'Configure Cloudflare R2 para armazenamento mais barato',
          'Verifique se as variáveis de ambiente estão definidas',
          'Confirme se o bucket está marcado como público',
          'Teste se o arquivo de vídeo está acessível diretamente',
          'Alternativas: Backblaze B2, Supabase Storage, AWS S3'
        ]
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL || 'https://77f677cc90bcd810f75c80680f636a46.r2.cloudflarestorage.com/vsl-solar-rarity-brasil/video-de-vendas.mp4'
    
    if (!videoUrl || videoUrl === '') {
      throw new Error('URL do vídeo não configurada. Configure NEXT_PUBLIC_VIDEO_URL.')
    }
    
    // Buscar apenas headers do vídeo
    const response = await fetch(videoUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(10000) // 10 segundos timeout para HEAD
    })

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
      { 
        error: 'Erro ao carregar headers do vídeo',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      },
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
      'Content-Type': 'text/plain',
    },
  })
}

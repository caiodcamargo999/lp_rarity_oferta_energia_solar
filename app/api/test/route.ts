import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API de teste funcionando!',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_VIDEO_URL: process.env.NEXT_PUBLIC_VIDEO_URL ? 'Configurada' : 'Não configurada'
    }
  })
}

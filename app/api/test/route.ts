import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'API de teste funcionando! Integrações Google serão implementadas em breve.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      modal: '✅ Funcionando',
      leadCapture: '✅ Funcionando',
      googleIntegrations: '⏳ Em desenvolvimento'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { test } = await request.json()

    if (test === 'basic') {
      return NextResponse.json({
        success: true,
        message: 'Teste básico funcionando!',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Teste não reconhecido. Use "basic" para teste simples.',
      availableTests: ['basic']
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro no teste',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

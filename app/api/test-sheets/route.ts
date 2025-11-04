import { NextResponse } from 'next/server'
import { testGoogleSheetsConnection } from '@/lib/googleSheets'

export async function GET() {
  try {
    console.log('🧪 Testando conexão com Google Sheets...')
    
    const isConnected = await testGoogleSheetsConnection()
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Conexão com Google Sheets funcionando!',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão com Google Sheets',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao testar conexão com Google Sheets',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

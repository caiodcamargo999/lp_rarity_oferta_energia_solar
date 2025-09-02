import { NextResponse } from 'next/server'
import { testGoogleSheetsConnection, testGoogleCalendarConnection } from '@/lib/googleSheets'
import { testEmailConnection } from '@/lib/emailService'

export async function GET() {
  try {
    console.log('🧪 Testando todas as integrações...')
    
    const results = {
      googleSheets: false,
      googleCalendar: false,
      email: false,
      timestamp: new Date().toISOString()
    }
    
    // Testar Google Sheets
    try {
      await testGoogleSheetsConnection()
      results.googleSheets = true
      console.log('✅ Google Sheets: OK')
    } catch (error) {
      console.error('❌ Google Sheets: FALHOU')
    }
    
    // Testar Google Calendar
    try {
      await testGoogleCalendarConnection()
      results.googleCalendar = true
      console.log('✅ Google Calendar: OK')
    } catch (error) {
      console.error('❌ Google Calendar: FALHOU')
    }
    
    // Testar Email
    try {
      await testEmailConnection()
      results.email = true
      console.log('✅ Email: OK')
    } catch (error) {
      console.error('❌ Email: FALHOU')
    }
    
    const allWorking = results.googleSheets && results.googleCalendar && results.email
    
    if (allWorking) {
      return NextResponse.json({
        success: true,
        message: 'Todas as integrações estão funcionando! 🎉',
        results,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Algumas integrações falharam. Verifique os logs.',
        results,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Erro no teste geral:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao executar testes',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

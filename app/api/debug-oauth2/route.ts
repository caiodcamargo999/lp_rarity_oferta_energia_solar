import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando diagnóstico OAuth2...')
    
    // Verificar variáveis de ambiente
    const envCheck = {
      GOOGLE_OAUTH_CLIENT_ID: !!process.env.GOOGLE_OAUTH_CLIENT_ID,
      GOOGLE_OAUTH_CLIENT_SECRET: !!process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      GOOGLE_OAUTH_REFRESH_TOKEN: !!process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    }
    
    console.log('📋 Variáveis OAuth2:', envCheck)
    
    if (!envCheck.GOOGLE_OAUTH_CLIENT_ID || !envCheck.GOOGLE_OAUTH_CLIENT_SECRET || !envCheck.GOOGLE_OAUTH_REFRESH_TOKEN) {
      return NextResponse.json({
        error: 'Variáveis OAuth2 não configuradas',
        envCheck
      }, { status: 400 })
    }
    
    // Configurar cliente OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )
    
    // Configurar credenciais
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
    })
    
    console.log('🔑 Cliente OAuth2 configurado')
    
    // Testar Google Calendar
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const calendarList = await calendar.calendarList.list()
      console.log('✅ Google Calendar: Acesso OK')
      
      return NextResponse.json({
        success: true,
        message: 'OAuth2 funcionando corretamente',
        calendarAccess: true,
        calendarsFound: calendarList.data.items?.length || 0,
        envCheck
      })
    } catch (calendarError) {
      console.error('❌ Erro Google Calendar:', calendarError)
      
      return NextResponse.json({
        success: false,
        error: 'Erro ao acessar Google Calendar',
        calendarError: calendarError.message,
        envCheck
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Erro geral OAuth2:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro geral OAuth2',
      details: error.message
    }, { status: 500 })
  }
}

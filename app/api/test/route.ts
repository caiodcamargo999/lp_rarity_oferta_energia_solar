import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'

// Função para obter autenticação Google
async function getGoogleAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  )

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  })

  return auth
}

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      hasClientId: !!process.env.GOOGLE_OAUTH_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      hasRefreshToken: !!process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
      hasSmtpConfig: !!(process.env.SMTP_USER && process.env.SMTP_PASS)
    },
    tests: {
      googleAuth: { success: false, error: '' },
      calendarAPI: { success: false, error: '' },
      sheetsAPI: { success: false, error: '' },
      emailConfig: { success: false, error: '' }
    }
  }

  // Teste 1: Autenticação Google
  try {
    const auth = await getGoogleAuth()
    await auth.getAccessToken()
    results.tests.googleAuth.success = true
  } catch (error) {
    results.tests.googleAuth.error = error instanceof Error ? error.message : 'Erro desconhecido'
  }

  // Teste 2: Google Calendar API
  try {
    const auth = await getGoogleAuth()
    const calendar = google.calendar({ version: 'v3', auth })
    
    await calendar.calendarList.list({
      maxResults: 1
    })
    results.tests.calendarAPI.success = true
  } catch (error) {
    results.tests.calendarAPI.error = error instanceof Error ? error.message : 'Erro desconhecido'
  }

  // Teste 3: Google Sheets API
  try {
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: 'v4', auth })
    
    if (process.env.GOOGLE_SPREADSHEET_ID) {
      await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
      })
      results.tests.sheetsAPI.success = true
    } else {
      results.tests.sheetsAPI.error = 'GOOGLE_SPREADSHEET_ID não configurado'
    }
  } catch (error) {
    results.tests.sheetsAPI.error = error instanceof Error ? error.message : 'Erro desconhecido'
  }

  // Teste 4: Configuração de Email
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.verify()
    results.tests.emailConfig.success = true
  } catch (error) {
    results.tests.emailConfig.error = error instanceof Error ? error.message : 'Erro desconhecido'
  }

  // Calcular status geral
  const allTestsPassed = Object.values(results.tests).every(test => test.success)
  const status = allTestsPassed ? 'success' : 'partial'

  return NextResponse.json({
    status,
    message: allTestsPassed 
      ? 'Todas as integrações estão funcionando!' 
      : 'Algumas integrações precisam de atenção',
    ...results
  })
}

export async function POST(request: NextRequest) {
  try {
    const { test } = await request.json()

    if (test === 'calendar') {
      // Teste criar evento no calendário
      const auth = await getGoogleAuth()
      const calendar = google.calendar({ version: 'v3', auth })

      const startTime = new Date()
      startTime.setMinutes(startTime.getMinutes() + 60) // 1 hora a partir de agora
      
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000) // 30 minutos depois

      const event = {
        summary: 'Teste de Integração - Rarity Agency',
        description: 'Este é um evento de teste criado pela API de captação de leads.',
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        conferenceData: {
          createRequest: {
            requestId: `test-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      })

      return NextResponse.json({
        success: true,
        message: 'Evento de teste criado no calendário',
        eventId: response.data.id,
        meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri
      })
    }

    if (test === 'sheets') {
      // Teste salvar dados no Google Sheets
      const auth = await getGoogleAuth()
      const sheets = google.sheets({ version: 'v4', auth })

      const values = [
        [
          new Date().toISOString(),
          'Teste Lead',
          '+55 (11) 99999-9999',
          'teste@exemplo.com',
          'Teste de integração da API',
          '09:00 - 10:00',
          new Date().toISOString(),
          'Teste',
          'https://meet.google.com/test',
          'test-event-id'
        ]
      ]

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Leads!A:J',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values }
      })

      return NextResponse.json({
        success: true,
        message: 'Dados de teste salvos no Google Sheets',
        updatedRows: response.data.updates?.updatedRows
      })
    }

    if (test === 'email') {
      // Teste envio de email
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

      await transporter.sendMail({
        from: `"Rarity Agency Brasil - Teste" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Enviar para si mesmo
        subject: 'Teste de Integração - Rarity Agency',
        html: `
          <h2>Teste de Integração Bem-sucedido!</h2>
          <p>Este email confirma que a integração com Gmail está funcionando corretamente.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Sistema:</strong> Rarity Agency Lead Capture</p>
        `
      })

      return NextResponse.json({
        success: true,
        message: 'Email de teste enviado com sucesso'
      })
    }

    return NextResponse.json({
      error: 'Tipo de teste não especificado',
      availableTests: ['calendar', 'sheets', 'email']
    }, { status: 400 })

  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

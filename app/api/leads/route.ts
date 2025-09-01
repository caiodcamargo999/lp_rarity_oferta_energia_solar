import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'

interface LeadData {
  name: string
  whatsapp: string
  email: string
  painPoint: string
  scheduledTime: string
}

// Configuração do OAuth2 para Google
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

// Função para criar evento no Google Calendar
async function createCalendarEvent(leadData: LeadData, meetLink: string) {
  try {
    const auth = await getGoogleAuth()
    const calendar = google.calendar({ version: 'v3', auth })

    // Parse do horário selecionado (ex: "09:00 - 10:00")
    const [startHour] = leadData.scheduledTime.split(' - ')
    const [hour, minute] = startHour.split(':')
    
    // Criar data para amanhã (ou próximo dia útil)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 1)
    startDate.setHours(parseInt(hour), parseInt(minute), 0, 0)
    
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hora depois

    const event = {
      summary: `Sessão Estratégica - ${leadData.name}`,
      description: `
Sessão Estratégica de Energia Solar

Cliente: ${leadData.name}
WhatsApp: ${leadData.whatsapp}
Email: ${leadData.email}

Principal Dor/Desafio:
${leadData.painPoint}

--
Esta é uma sessão estratégica gratuita de 60 minutos para discutir estratégias de crescimento no mercado de energia solar.
      `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        { email: leadData.email, responseStatus: 'needsAction' },
        { email: 'matheusdrarity@gmail.com', responseStatus: 'accepted' }
      ],
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24h antes
          { method: 'email', minutes: 2 * 60 },  // 2h antes
          { method: 'popup', minutes: 15 },      // 15min antes
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    })

    return response.data
  } catch (error) {
    console.error('Erro ao criar evento no calendário:', error)
    throw new Error('Falha ao criar evento no calendário')
  }
}

// Função para salvar no Google Sheets
async function saveToGoogleSheets(leadData: LeadData, calendarEvent: any) {
  try {
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: 'v4', auth })

    const meetLink = calendarEvent.conferenceData?.entryPoints?.[0]?.uri || 'N/A'
    const eventId = calendarEvent.id || 'N/A'

    const values = [
      [
        new Date().toISOString(), // Data de cadastro
        leadData.name,
        leadData.whatsapp,
        leadData.email,
        leadData.painPoint,
        leadData.scheduledTime,
        calendarEvent.start?.dateTime || 'N/A',
        'Agendado',
        meetLink,
        eventId
      ]
    ]

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Leads!A:J', // Planilha chamada "Leads", colunas A até J
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    })

    return response.data
  } catch (error) {
    console.error('Erro ao salvar no Google Sheets:', error)
    throw new Error('Falha ao salvar no Google Sheets')
  }
}

// Função para enviar email de confirmação
async function sendConfirmationEmail(leadData: LeadData, calendarEvent: any) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const meetLink = calendarEvent.conferenceData?.entryPoints?.[0]?.uri || ''
    const eventDate = new Date(calendarEvent.start?.dateTime || '').toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sessão Estratégica Confirmada - Rarity Agency</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #A855F7, #E879F9); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px; }
    .button { display: inline-block; background: #A855F7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
    .info-box { background: #f3f4f6; border-left: 4px solid #A855F7; padding: 20px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sessão Estratégica Confirmada!</h1>
      <p>Sua consultoria de energia solar foi agendada com sucesso</p>
    </div>
    
    <div class="content">
      <p>Olá <strong>${leadData.name}</strong>,</p>
      
      <p>Parabéns! Sua sessão estratégica gratuita foi confirmada. Estamos animados para ajudá-lo a multiplicar as vendas da sua empresa de energia solar.</p>
      
      <div class="info-box">
        <h3>Detalhes da Sessão:</h3>
        <p><strong>Data e Horário:</strong> ${eventDate}</p>
        <p><strong>Duração:</strong> 60 minutos</p>
        <p><strong>Plataforma:</strong> Google Meet</p>
        <p><strong>WhatsApp:</strong> ${leadData.whatsapp}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${meetLink}" class="button">Entrar na Videochamada</a>
      </div>
      
      <h3>O que você receberá:</h3>
      <ul>
        <li>Análise personalizada do seu negócio de energia solar</li>
        <li>Estratégias comprovadas para multiplicar vendas</li>
        <li>Plano de ação usando IA e automação</li>
        <li>Táticas de copywriting persuasivo</li>
        <li>Estratégias de anúncios online em escala</li>
      </ul>
      
      <div class="info-box">
        <h4>Importante:</h4>
        <p>• Entre na chamada 5 minutos antes do horário</p>
        <p>• Tenha em mãos informações básicas sobre sua empresa</p>
        <p>• Você receberá lembretes automáticos 24h e 2h antes</p>
      </div>
      
      <p>Caso precise reagendar ou tenha alguma dúvida, responda este email ou entre em contato pelo nosso Instagram: <a href="https://www.instagram.com/rarity.brasil/">@rarity.brasil</a></p>
      
      <p>Até breve!</p>
      <p><strong>Equipe Rarity Agency Brasil</strong><br>
      Especialistas em Marketing Digital para Energia Solar</p>
    </div>
    
    <div class="footer">
      <p>Rarity Agency © 2025 | <a href="https://rarityagency.io">rarityagency.io</a></p>
    </div>
  </div>
</body>
</html>
    `

    const mailOptions = {
      from: `"Rarity Agency Brasil" <${process.env.SMTP_USER}>`,
      to: leadData.email,
      subject: 'Sessão Estratégica Confirmada - Rarity Agency Brasil',
      html: emailHtml
    }

    await transporter.sendMail(mailOptions)
    
    // Enviar cópia para a equipe
    await transporter.sendMail({
      ...mailOptions,
      to: 'matheusdrarity@gmail.com',
      subject: `[NOVO LEAD] Sessão agendada com ${leadData.name}`,
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw new Error('Falha ao enviar email de confirmação')
  }
}

export async function POST(request: NextRequest) {
  try {
    const leadData: LeadData = await request.json()

    // Validação básica
    if (!leadData.name || !leadData.email || !leadData.whatsapp || !leadData.painPoint || !leadData.scheduledTime) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(leadData.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validação de WhatsApp brasileiro
    const whatsappRegex = /^\+55\s?\(?[1-9]{2}\)?\s?[9]{0,1}[0-9]{4}-?[0-9]{4}$/
    if (!whatsappRegex.test(leadData.whatsapp)) {
      return NextResponse.json(
        { error: 'WhatsApp deve estar no formato brasileiro' },
        { status: 400 }
      )
    }

    console.log('Processando lead:', leadData.name)

    // 1. Criar evento no Google Calendar
    console.log('Criando evento no calendário...')
    const calendarEvent = await createCalendarEvent(leadData, '')

    // 2. Salvar no Google Sheets
    console.log('Salvando no Google Sheets...')
    await saveToGoogleSheets(leadData, calendarEvent)

    // 3. Enviar email de confirmação
    console.log('Enviando email de confirmação...')
    await sendConfirmationEmail(leadData, calendarEvent)

    console.log('Lead processado com sucesso:', leadData.name)

    return NextResponse.json({
      success: true,
      message: 'Lead capturado e sessão agendada com sucesso',
      eventId: calendarEvent.id,
      meetLink: calendarEvent.conferenceData?.entryPoints?.[0]?.uri
    })

  } catch (error) {
    console.error('Erro ao processar lead:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

import { google } from 'googleapis'
import * as path from 'path'

// Função para obter cliente OAuth2 para Google Calendar e Google Sheets
async function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URI do OAuth Playground
  );

  // Para desenvolvimento, vamos usar um refresh token temporário
  // Em produção, você precisará implementar o fluxo completo de OAuth2
  if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
    });

    // Verificar se o token ainda é válido
    try {
      await client.getAccessToken();
      console.log('✅ OAuth2 token válido');
    } catch (tokenError) {
      console.error('❌ OAuth2 token expirado ou inválido:', tokenError);
      throw new Error('OAuth2 token expirado. É necessário gerar um novo refresh token.');
    }
  } else {
    throw new Error('GOOGLE_OAUTH_REFRESH_TOKEN não configurado');
  }

  return client;
}

// Configurar autenticação com OAuth2 (para Google Sheets)
// LAZY INITIALIZATION: Não inicializar durante build, apenas em runtime
let auth: any = null
let sheets: any = null

const getAuth = async () => {
  if (auth) return auth

  // Usar OAuth2 em vez de Service Account
  console.log('🔧 Configurando autenticação OAuth2 para Google Sheets...')

  const client = await getOAuth2Client()
  auth = client

  console.log('🔧 Google Sheets Auth configurado (OAuth2)')

  return auth
}

const getSheets = async () => {
  const authClient = await getAuth()
  return google.sheets({ version: 'v4', auth: authClient })
}

export interface LeadData {
  sourcePage: string
  name: string
  whatsapp: string
  email: string
  company: string
  revenue: string
  painPoint: string
  hasBudget: string
  scheduledDateTime: string
  timestamp: string
}

export interface CalendarEvent {
  summary: string
  description: string
  startTime: string
  endTime: string
  attendees: string[]
  meetLink?: string
  eventId?: string
}

export async function addLeadToSheet(leadData: LeadData): Promise<boolean> {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID not configured')
    }

    // Prepare the row data in the correct order
    const rowData = [
      leadData.timestamp,           // A: Data Cadastro (Timestamp)
      leadData.sourcePage,          // B: Qual Página
      leadData.name,                // C: Nome
      leadData.whatsapp,            // D: WhatsApp
      leadData.email,               // E: Email
      leadData.company,             // F: Empresa
      leadData.revenue,             // G: Faturamento
      leadData.painPoint,           // H: Maior Dor
      leadData.scheduledDateTime    // I: Data e Hora da Reunião
    ]

    console.log('📊 Dados que serão enviados para o Google Sheets:', rowData)
    console.log('📊 Spreadsheet ID:', spreadsheetId)
    console.log('📊 Range:', 'Leads!A:I')

    // Append the row to the sheet
    const sheetsClient = await getSheets()
    const response = await sheetsClient.spreadsheets.values.append({
      spreadsheetId,
      range: 'Leads!A:I', // Specify the range to append to (9 colunas)
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    })

    console.log('✅ Lead adicionado ao Google Sheets:', response.data)
    console.log('✅ Resposta completa:', response)
    return true

  } catch (error) {
    console.error('❌ Erro ao adicionar lead ao Google Sheets:', error)
    throw error
  }
}

export async function testGoogleSheetsConnection(): Promise<boolean> {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID not configured')
    }

    // Try to read the sheet to test connection
    const sheetsClient = await getSheets()
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leads!A1:G1', // Read just the header row (7 colunas)
    })

    console.log('✅ Conexão com Google Sheets testada com sucesso')
    console.log('📊 Cabeçalhos encontrados:', response.data.values?.[0])
    return true

  } catch (error) {
    console.error('❌ Erro ao testar conexão com Google Sheets:', error)
    throw error
  }
}

// Cache para horários disponíveis (1 minuto para horários dinâmicos - mais agressivo)
const timeSlotsCache = new Map<string, { slots: string[], timestamp: number }>()
const CACHE_DURATION = 1 * 60 * 1000 // 1 minuto

// Função para limpar cache (útil para debug)
export function clearTimeSlotsCache() {
  timeSlotsCache.clear()
  console.log('🧹 Cache de horários limpo')
}

// Função para atualizar horários em background (não bloqueia a resposta)
async function updateTimeSlotsFromCalendar(date: string, baseSlots: string[]) {
  try {
    const oauth2Client = await getOAuth2Client()
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const startOfDay = new Date(`${date}T00:00:00-03:00`)
    const endOfDay = new Date(`${date}T23:59:59-03:00`)

    const response = await calendar.events.list({
      calendarId: 'caiorarity@gmail.com',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 5 // Apenas 5 eventos para máxima velocidade
    })

    const events = response.data.items || []
    let busySlots: string[] = []

    events.forEach(event => {
      if (event.start?.dateTime) {
        const eventStart = new Date(event.start.dateTime)
        const eventEnd = new Date(event.end?.dateTime || eventStart.getTime() + 60 * 60 * 1000)

        const startHour = eventStart.getHours()
        const endHour = eventEnd.getHours()

        for (let hour = startHour; hour < endHour; hour++) {
          const slotTime = `${hour.toString().padStart(2, '0')}:00`
          if (baseSlots.includes(slotTime)) {
            busySlots.push(slotTime)
          }
        }
      }
    })

    busySlots = Array.from(new Set(busySlots))
    const availableSlots = baseSlots.filter(slot => !busySlots.includes(slot))

    // Atualizar cache com dados reais do Calendar
    timeSlotsCache.set(date, { slots: availableSlots, timestamp: Date.now() })
    console.log(`🔄 Background update para ${date}:`, availableSlots)

  } catch (error) {
    console.log('⚠️ Background calendar update failed:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function getAvailableTimeSlots(date: string): Promise<string[]> {
  try {
    const now = new Date()
    const brasiliaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))

    // Gerar ID de hoje no mesmo formato que o modal usa (YYYY-MM-DD local)
    const year = brasiliaTime.getFullYear()
    const month = String(brasiliaTime.getMonth() + 1).padStart(2, '0')
    const day = String(brasiliaTime.getDate()).padStart(2, '0')
    const today = `${year}-${month}-${day}`

    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

    // VERIFICAÇÃO REAL DO GOOGLE CALENDAR
    try {
      const oauth2Client = await getOAuth2Client()
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      // Configurar início e fim do dia em Brasília
      const startOfDay = new Date(`${date}T00:00:00-03:00`)
      const endOfDay = new Date(`${date}T23:59:59-03:00`)

      console.log(`📅 Consultando Google Calendar para ${date}...`)

      const response = await calendar.events.list({
        calendarId: 'caiorarity@gmail.com',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 20
      })

      const events = response.data.items || []
      const busySlots: string[] = []

      // Marcar horários ocupados
      events.forEach(event => {
        if (event.start?.dateTime) {
          const eventStart = new Date(event.start.dateTime)
          const eventEnd = new Date(event.end?.dateTime || eventStart.getTime() + 60 * 60 * 1000)

          const startHour = eventStart.getHours()
          const endHour = eventEnd.getHours()

          for (let hour = startHour; hour < endHour; hour++) {
            const slotTime = `${hour.toString().padStart(2, '0')}:00`
            if (baseSlots.includes(slotTime)) {
              busySlots.push(slotTime)
            }
          }
        }
      })

      // Remover horários ocupados
      let availableSlots = baseSlots.filter(slot => !busySlots.includes(slot))

      // Se for hoje, filtrar horários passados
      const isToday = date === today
      if (isToday) {
        const currentHour = brasiliaTime.getHours()
        const bufferHours = 2
        const cutoffHour = currentHour + bufferHours

        availableSlots = availableSlots.filter(slot => {
          const slotHour = parseInt(slot.split(':')[0])
          return slotHour > cutoffHour
        })
      }

      console.log(`✅ Horários disponíveis para ${date}:`, availableSlots)
      console.log(`🔒 Horários ocupados:`, busySlots)

      return availableSlots

    } catch (calendarError) {
      console.error('⚠️ Erro ao consultar Calendar, usando horários padrão:', calendarError)

      // Fallback: Se falhar Calendar, usar lógica de horários passados
      const isToday = date === today
      if (isToday) {
        const currentHour = brasiliaTime.getHours()
        const bufferHours = 2
        const cutoffHour = currentHour + bufferHours

        return baseSlots.filter(slot => {
          const slotHour = parseInt(slot.split(':')[0])
          return slotHour > cutoffHour
        })
      }

      return baseSlots
    }

  } catch (error) {
    console.error('❌ Erro ao buscar horários disponíveis:', error)
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    return baseSlots
  }
}

export async function createCalendarEvent(eventData: CalendarEvent): Promise<{ eventId: string; meetLink: string }> {
  try {
    const oauth2Client = await getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Usar o email do calendário do caiorarity@gmail.com
    const calendarId = 'caiorarity@gmail.com'

    console.log('📅 Tentando criar evento no calendário usando OAuth2:', calendarId)
    console.log('📝 Dados do evento:', JSON.stringify(eventData, null, 2))

    // Criar evento no Google Calendar
    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: 'America/Sao_Paulo'
      },
      attendees: eventData.attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },    // 24 horas antes
          { method: 'popup', minutes: 2 * 60 },     // 2 horas antes
          { method: 'popup', minutes: 15 }           // 15 minutos antes
        ]
      }
    }

    console.log('🎯 Evento a ser criado:', JSON.stringify(event, null, 2))

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // IMPORTANTE: Envia emails para todos os participantes
      sendNotifications: true // Força o envio de notificações
    })

    const eventId = response.data.id || ''
    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || ''

    console.log('✅ Evento criado no Google Calendar:', eventId)
    console.log('🔗 Link do Google Meet:', meetLink)
    console.log('📧 Emails enviados para participantes:', eventData.attendees)
    console.log('📋 Resposta completa da API:', JSON.stringify(response.data, null, 2))

    // Verificar se o evento foi criado com sucesso
    if (!eventId) {
      throw new Error('Evento não foi criado - ID não retornado')
    }

    // Verificar se o link do Meet foi gerado
    if (!meetLink) {
      console.warn('⚠️ Link do Google Meet não foi gerado')
    }

    return { eventId, meetLink }

  } catch (error) {
    console.error('❌ Erro ao criar evento no Google Calendar:', error)

    // Se falhar no Calendar, retornar dados mock para não quebrar o fluxo
    console.log('⚠️ Usando dados mock para continuar o fluxo')
    return {
      eventId: `mock-${Date.now()}`,
      meetLink: 'https://meet.google.com/mock-link'
    }
  }
}



export async function testGoogleCalendarConnection(): Promise<boolean> {
  try {
    const oauth2Client = await getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Usar o email do calendário do caiorarity@gmail.com
    const calendarId = 'caiorarity@gmail.com'

    console.log('📅 Testando conexão com calendário usando OAuth2:', calendarId)

    // Tentar listar eventos para testar conexão
    const response = await calendar.events.list({
      calendarId,
      maxResults: 1,
      timeMin: new Date().toISOString()
    })

    console.log('✅ Conexão com Google Calendar testada com sucesso')
    return true

  } catch (error) {
    console.error('❌ Erro ao testar conexão com Google Calendar:', error)

    // Se não tiver refresh token, dar instruções
    if (!process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
      console.log('⚠️ GOOGLE_OAUTH_REFRESH_TOKEN não configurado')
      console.log('📋 Para obter o refresh token:')
      console.log('1. Acesse: https://script.google.com/')
      console.log('2. Faça login com caiorarity@gmail.com')
      console.log('3. Crie um novo projeto e teste os escopos')
    }

    throw error
  }
}

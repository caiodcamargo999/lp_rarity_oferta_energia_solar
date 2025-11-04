import { google } from 'googleapis'
import * as path from 'path'

// Configuração da conta de serviço - usar variáveis de ambiente sempre
const getServiceAccountConfig = () => {
  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Variáveis de ambiente GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY são obrigatórias')
  }
  
  return {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID || 'lp-rarity-oferta-energia-solar',
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || '',
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
  }
}

// Função para obter cliente OAuth2 para Google Calendar
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

// Configurar autenticação com Service Account (apenas para Google Sheets)
// LAZY INITIALIZATION: Não inicializar durante build, apenas em runtime
let auth: any = null
let sheets: any = null

const getAuth = () => {
  if (auth) return auth

  const serviceAccountConfig = getServiceAccountConfig()

  if (typeof serviceAccountConfig === 'string') {
    // Desenvolvimento - usar arquivo
    auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountConfig,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    })
  } else {
    // Produção - usar objeto de credenciais
    auth = new google.auth.GoogleAuth({
      credentials: serviceAccountConfig,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    })
  }

  console.log('🔧 Google Sheets Auth configurado:', {
    hasAuth: !!auth,
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
  })

  return auth
}

const getSheets = () => {
  if (sheets) return sheets
  sheets = google.sheets({ version: 'v4', auth: getAuth() })
  return sheets
}

export interface LeadData {
  sourcePage: string
  name: string
  whatsapp: string
  email: string
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
      leadData.painPoint,           // F: Maior Dor
      leadData.hasBudget,           // G: Tem orçamento
      leadData.scheduledDateTime    // H: Data e Hora da Reunião
    ]

    console.log('📊 Dados que serão enviados para o Google Sheets:', rowData)
    console.log('📊 Spreadsheet ID:', spreadsheetId)
    console.log('📊 Range:', 'Leads!A:H')

    // Append the row to the sheet
    const response = await getSheets().spreadsheets.values.append({
      spreadsheetId,
      range: 'Leads!A:H', // Specify the range to append to (8 colunas)
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
    const response = await getSheets().spreadsheets.values.get({
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
      calendarId: 'matheusdrarity@gmail.com',
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
    const brasiliaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}))

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
        calendarId: 'matheusdrarity@gmail.com',
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

    // Usar o email do calendário do matheusdrarity@gmail.com
    const calendarId = 'matheusdrarity@gmail.com'
    
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

    // Usar o email do calendário do matheusdrarity@gmail.com
    const calendarId = 'matheusdrarity@gmail.com'
    
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
      console.log('2. Faça login com matheusdrarity@gmail.com')
      console.log('3. Crie um novo projeto e teste os escopos')
    }
    
    throw error
  }
}

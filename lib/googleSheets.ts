import { google } from 'googleapis'
import * as path from 'path'

// Caminho para o arquivo JSON da conta de serviço
const serviceAccountPath = path.join(process.cwd(), 'lp-rarity-oferta-energia-solar-d04cccf3789c.json')

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
  }

  return client;
}

// Configurar autenticação com Service Account (apenas para Google Sheets)
const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountPath,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets'
  ]
})

// Criar instâncias dos serviços Google
const sheets = google.sheets({ version: 'v4', auth })
// Calendar será criado dinamicamente com OAuth2

export interface LeadData {
  sourcePage: string
  name: string
  whatsapp: string
  email: string
  painPoint: string
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
      leadData.scheduledDateTime    // G: Data e Hora da Reunião
    ]

    // Append the row to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Leads!A:G', // Specify the range to append to (7 colunas)
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    })

    console.log('✅ Lead adicionado ao Google Sheets:', response.data)
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
    const response = await sheets.spreadsheets.values.get({
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

// Cache para horários disponíveis (5 minutos para horários dinâmicos)
const timeSlotsCache = new Map<string, { slots: string[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export async function getAvailableTimeSlots(date: string): Promise<string[]> {
  try {
    // Verificar cache primeiro (cache mais agressivo para performance)
    const cached = timeSlotsCache.get(date)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`✅ Horários do cache para ${date}:`, cached.slots)
      return cached.slots
    }

    // Obter horário atual em Brasília CORRETAMENTE
    const now = new Date()
    // Brasília é UTC-3, então adicionamos 3 horas ao UTC para obter o horário local
    const brasiliaTime = new Date(now.getTime() + (3 * 60 * 60 * 1000))
    
    // Verificar se é hoje
    const today = brasiliaTime.toISOString().split('T')[0]
    const isToday = date === today
    
    console.log(`🕐 Horário atual em Brasília: ${brasiliaTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`)
    console.log(`📅 Data solicitada: ${date}, É hoje? ${isToday}`)
    
    // Se for hoje e já passou das 17h, não mostrar horários
    if (isToday) {
      const currentHour = brasiliaTime.getHours()
      const currentMinute = brasiliaTime.getMinutes()
      
      if (currentHour >= 17) {
        console.log(`🕐 Horário atual: ${currentHour}:${currentMinute.toString().padStart(2, '0')} - Já passou das 17h, não há horários disponíveis para hoje`)
        timeSlotsCache.set(date, { slots: [], timestamp: Date.now() })
        return []
      }
    }
    
    // Definir horários base (9h às 17h)
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    
    // Buscar eventos existentes no Google Calendar para a data solicitada
    let busySlots: string[] = []
    try {
      const oauth2Client = await getOAuth2Client()
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      
      // Criar range de tempo para o dia solicitado
      const startOfDay = new Date(`${date}T00:00:00-03:00`) // Início do dia em Brasília
      const endOfDay = new Date(`${date}T23:59:59-03:00`)   // Fim do dia em Brasília
      
      console.log(`📅 Buscando eventos no calendário para ${date}`)
      console.log(`🕐 Range: ${startOfDay.toISOString()} até ${endOfDay.toISOString()}`)
      
      // Buscar eventos no calendário do matheusdrarity@gmail.com
      const response = await calendar.events.list({
        calendarId: 'matheusdrarity@gmail.com',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })
      
      const events = response.data.items || []
      console.log(`📋 Encontrados ${events.length} eventos no calendário para ${date}`)
      
      // Extrair horários ocupados
      events.forEach(event => {
        if (event.start?.dateTime) {
          const eventStart = new Date(event.start.dateTime)
          const eventEnd = new Date(event.end?.dateTime || eventStart.getTime() + 60 * 60 * 1000) // +1h se não tiver end
          
          // Converter para horário de Brasília e extrair hora
          const startHour = eventStart.getHours()
          const endHour = eventEnd.getHours()
          
          // Marcar todos os slots ocupados
          for (let hour = startHour; hour < endHour; hour++) {
            const slotTime = `${hour.toString().padStart(2, '0')}:00`
            if (baseSlots.includes(slotTime)) {
              busySlots.push(slotTime)
            }
          }
          
          console.log(`📅 Evento: ${event.summary} - ${startHour}:00 às ${endHour}:00`)
        }
      })
      
      // Remover duplicatas
      busySlots = Array.from(new Set(busySlots))
      console.log(`🚫 Horários ocupados: ${busySlots.join(', ')}`)
      
    } catch (calendarError) {
      console.error('❌ Erro ao buscar eventos no calendário:', calendarError)
      // Se falhar, usar lógica de fallback
    }
    
    // Filtrar horários disponíveis
    let availableSlots = baseSlots.filter(slot => !busySlots.includes(slot))
    
    // Se for hoje, filtrar horários que já passaram com buffer de 2 horas
    if (isToday) {
      const currentHour = brasiliaTime.getHours()
      const currentMinute = brasiliaTime.getMinutes()
      
      // Buffer de 2 horas para garantir que o lead tenha tempo de se preparar
      const bufferHours = 2
      const cutoffHour = currentHour + bufferHours
      
      availableSlots = availableSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0])
        return slotHour > cutoffHour
      })
      
      console.log(`🕐 Horário atual: ${currentHour}:${currentMinute.toString().padStart(2, '0')} - Horários disponíveis para hoje (buffer de ${bufferHours}h): ${availableSlots.length}`)
    }
    
    console.log(`📋 Horários disponíveis para ${date}:`, availableSlots)
    
    // Salvar no cache com duração menor para horários dinâmicos (5 minutos)
    timeSlotsCache.set(date, { slots: availableSlots, timestamp: Date.now() })
    
    return availableSlots
    
  } catch (error) {
    console.error('❌ Erro ao buscar horários disponíveis:', error)
    
    // Fallback instantâneo - sempre retornar horários padrão para datas futuras
    const now = new Date()
    const brasiliaTime = new Date(now.getTime() + (3 * 60 * 60 * 1000))
    const today = brasiliaTime.toISOString().split('T')[0]
    
    if (date === today) {
      const currentHour = brasiliaTime.getHours()
      if (currentHour >= 17) {
        return []
      }
    }
    
    const fallbackSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    return fallbackSlots
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
      sendUpdates: 'all' // IMPORTANTE: Envia emails para todos os participantes
    })
    
    const eventId = response.data.id || ''
    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || ''
    
    console.log('✅ Evento criado no Google Calendar:', eventId)
    console.log('🔗 Link do Google Meet:', meetLink)
    
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

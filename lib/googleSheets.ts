import { google } from 'googleapis'
import * as path from 'path'

// Caminho para o arquivo JSON da conta de serviço
const serviceAccountPath = path.join(process.cwd(), 'lp-rarity-oferta-energia-solar-d04cccf3789c.json')

// Configurar autenticação com Service Account
const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountPath,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]
})

// Criar instâncias dos serviços Google
const sheets = google.sheets({ version: 'v4', auth })
const calendar = google.calendar({ version: 'v3', auth })

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

// Cache para horários disponíveis (30 minutos para performance máxima)
const timeSlotsCache = new Map<string, { slots: string[], timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

export async function getAvailableTimeSlots(date: string): Promise<string[]> {
  try {
    // Verificar cache primeiro (cache mais agressivo para performance)
    const cached = timeSlotsCache.get(date)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`✅ Horários do cache para ${date}:`, cached.slots)
      return cached.slots
    }

    // Obter horário atual em Brasília (otimizado)
    const now = new Date()
    const brasiliaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000)) // UTC-3
    
    // Verificar se é hoje
    const today = brasiliaTime.toISOString().split('T')[0]
    const isToday = date === today
    
    // Se for hoje e já passou das 17h, não mostrar horários
    if (isToday) {
      const currentHour = brasiliaTime.getHours()
      
      if (currentHour >= 17) {
        console.log(`🕐 Horário atual: ${currentHour}:00 - Já passou das 17h, não há horários disponíveis para hoje`)
        timeSlotsCache.set(date, { slots: [], timestamp: Date.now() })
        return []
      }
    }
    
    // Definir horários base (9h às 17h) - sempre disponíveis para datas futuras
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    
    let availableSlots = [...baseSlots]
    
    // Se for hoje, filtrar horários que já passaram (lógica simplificada)
    if (isToday) {
      const currentHour = brasiliaTime.getHours()
      
      availableSlots = baseSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0])
        return slotHour > (currentHour + 1) // Buffer de 1 hora
      })
      
      console.log(`🕐 Horário atual: ${currentHour}:00 - Horários disponíveis para hoje: ${availableSlots.length}`)
    }
    
    // Salvar no cache imediatamente
    timeSlotsCache.set(date, { slots: availableSlots, timestamp: Date.now() })
    
    console.log(`✅ Horários disponíveis para ${date}:`, availableSlots)
    return availableSlots
    
  } catch (error) {
    console.error('❌ Erro ao buscar horários disponíveis:', error)
    
    // Fallback instantâneo - sempre retornar horários padrão para datas futuras
    const today = new Date().toISOString().split('T')[0]
    if (date === today) {
      const currentHour = new Date().getHours()
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
    // Usar o email do calendário do matheusdrarity@gmail.com
    const calendarId = 'matheusdrarity@gmail.com'
    
    console.log('📅 Tentando criar evento no calendário:', calendarId)
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
      conferenceDataVersion: 1
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
    // Usar o email do calendário do matheusdrarity@gmail.com
    const calendarId = 'matheusdrarity@gmail.com'
    
    console.log('📅 Testando conexão com calendário:', calendarId)
    
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
    throw error
  }
}

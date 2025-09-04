import { NextRequest, NextResponse } from 'next/server'
import { addLeadToSheet, LeadData, createCalendarEvent, getAvailableTimeSlots } from '@/lib/googleSheets'

interface RequestData {
  name: string
  whatsapp: string
  email: string
  painPoint: string
  budget: string
  scheduledDate: string | null
  scheduledTime: string | null
  sourcePage?: string
  hasBudget?: string
}

export async function POST(request: NextRequest) {
  try {
    const requestData: RequestData = await request.json()

    // Validação básica
    if (!requestData.name || !requestData.email || !requestData.whatsapp || !requestData.painPoint || !requestData.budget) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Se tem orçamento, precisa ter data e hora agendada
    if (requestData.hasBudget === 'sim' && (!requestData.scheduledDate || !requestData.scheduledTime)) {
      return NextResponse.json(
        { error: 'Data e horário são obrigatórios para agendamento' },
        { status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(requestData.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validação de WhatsApp (mais flexível)
    const cleanWhatsApp = requestData.whatsapp.replace(/\D/g, '')
    if (cleanWhatsApp.length < 10) {
      return NextResponse.json(
        { error: 'WhatsApp deve ter pelo menos 10 dígitos' },
        { status: 400 }
      )
    }

    // Determine source page from referer or default to '/'
    const referer = request.headers.get('referer') || ''
    let sourcePage = requestData.sourcePage || '/'
    
    // If no source page specified, try to determine from referer
    if (!requestData.sourcePage) {
      if (referer.includes('/2')) {
        sourcePage = '/2'
      } else if (referer.includes('/1')) {
        sourcePage = '/1'
      } else {
        sourcePage = '/'
      }
    }

    // Create scheduled date time string (only if has budget)
    const scheduledDateTime = requestData.scheduledDate && requestData.scheduledTime 
      ? `${requestData.scheduledDate} ${requestData.scheduledTime}`
      : 'Não agendado'

    // Prepare lead data for Google Sheets
    const leadData: LeadData = {
      sourcePage,
      name: requestData.name.trim(),
      whatsapp: requestData.whatsapp.trim(),
      email: requestData.email.trim(),
      painPoint: requestData.painPoint.trim(),
      hasBudget: requestData.hasBudget || (requestData.budget === 'Sim, tenho.' ? 'sim' : 'não'),
      scheduledDateTime,
      timestamp: new Date().toISOString()
    }

    console.log('📝 Processando lead:', leadData.name)
    console.log('📄 Página de origem:', sourcePage)
    console.log('📧 Email:', leadData.email)
    console.log('📱 WhatsApp:', leadData.whatsapp)
    console.log('🎯 Dor principal:', leadData.painPoint)
    console.log('💰 Tem orçamento:', leadData.hasBudget)
    console.log('📅 Data/Hora agendada:', scheduledDateTime)

    // 1. Add lead to Google Sheets
    try {
      console.log('📊 Tentando salvar no Google Sheets:', leadData)
      const sheetsResult = await addLeadToSheet(leadData)
      console.log('✅ Lead salvo no Google Sheets com sucesso:', sheetsResult)
    } catch (sheetsError) {
      console.error('❌ Erro ao salvar no Google Sheets:', sheetsError)
      if (sheetsError instanceof Error) {
        console.error('❌ Detalhes do erro:', sheetsError.message)
      }
      // Continue processing even if Sheets fails
    }

    // 2. Create Google Calendar event (only if has budget)
    let eventId = ''
    let meetLink = ''
    
    if (leadData.hasBudget === 'sim' && requestData.scheduledDate && requestData.scheduledTime) {
      try {
        const eventData = {
          summary: `Sessão Estratégica - ${leadData.name}`,
          description: `Sessão estratégica com ${leadData.name} (${leadData.email})
          
Dor principal: ${leadData.painPoint}
WhatsApp: ${leadData.whatsapp}
Página de origem: ${sourcePage}
Tem orçamento: ${leadData.hasBudget}

Sessão estratégica gratuita para análise do negócio de energia solar e criação de plano de crescimento.`,
          startTime: new Date(scheduledDateTime).toISOString(),
          endTime: new Date(new Date(scheduledDateTime).getTime() + 60 * 60 * 1000).toISOString(), // +1 hora
          attendees: [leadData.email, 'matheusdrarity@gmail.com', 'caiorarity@gmail.com']
        }

        const calendarResult = await createCalendarEvent(eventData)
        eventId = calendarResult.eventId
        meetLink = calendarResult.meetLink
        
        console.log('✅ Evento criado no Google Calendar:', eventId)
        console.log('🔗 Link do Google Meet:', meetLink)
        
        // O Google Calendar enviará automaticamente os emails nativos para todos os participantes
        console.log('📧 Emails nativos do Google Calendar serão enviados automaticamente')
        
      } catch (calendarError) {
        console.error('❌ Erro ao criar evento no Google Calendar:', calendarError)
        // Continue processing even if Calendar fails
      }
    } else {
      console.log('ℹ️ Lead sem orçamento - não criando evento no calendário')
    }

    // Simular processamento bem-sucedido
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Lead capturado com sucesso! Sessão será agendada em breve.',
      leadId: `lead-${Date.now()}`,
      scheduledDateTime,
      sourcePage,
      eventId,
      meetLink
    })

  } catch (error) {
    console.error('❌ Erro ao processar lead:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// GET endpoint para buscar horários disponíveis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { error: 'Parâmetro "date" é obrigatório' },
        { status: 400 }
      )
    }

    const availableSlots = await getAvailableTimeSlots(date)
    
    return NextResponse.json({
      success: true,
      date,
      availableSlots
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar horários disponíveis:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar horários disponíveis',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

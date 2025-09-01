import { NextRequest, NextResponse } from 'next/server'

interface LeadData {
  name: string
  whatsapp: string
  email: string
  painPoint: string
  scheduledTime: string
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

    // Validação de WhatsApp (mais flexível)
    const cleanWhatsApp = leadData.whatsapp.replace(/\D/g, '')
    if (cleanWhatsApp.length < 10) {
      return NextResponse.json(
        { error: 'WhatsApp deve ter pelo menos 10 dígitos' },
        { status: 400 }
      )
    }

    console.log('✅ Lead processado com sucesso:', leadData.name)
    console.log('📧 Email:', leadData.email)
    console.log('📱 WhatsApp:', leadData.whatsapp)
    console.log('🎯 Dor principal:', leadData.painPoint)
    console.log('📅 Horário agendado:', leadData.scheduledTime)

    // Simular processamento bem-sucedido
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Lead capturado com sucesso! Sessão será agendada em breve.',
      leadId: `lead-${Date.now()}`,
      scheduledTime: leadData.scheduledTime
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

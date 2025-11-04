import { NextRequest, NextResponse } from 'next/server'
import { createCalendarEvent } from '@/lib/googleSheets'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Criar um evento de teste para verificar se os emails são enviados
    const testEventData = {
      summary: `Teste de Email - ${new Date().toLocaleString('pt-BR')}`,
      description: `Este é um evento de teste para verificar se os emails nativos do Google Calendar estão funcionando.
      
Email de teste: ${email}
Data do teste: ${new Date().toLocaleString('pt-BR')}

Se você receber este email, significa que a integração está funcionando corretamente.`,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Amanhã + 1 hora
      attendees: [email, 'matheusdrarity@gmail.com']
    }

    console.log('🧪 Criando evento de teste para verificar emails...')
    console.log('📧 Email de teste:', email)
    console.log('📅 Dados do evento:', JSON.stringify(testEventData, null, 2))

    const result = await createCalendarEvent(testEventData)
    
    return NextResponse.json({
      success: true,
      message: 'Evento de teste criado com sucesso',
      eventId: result.eventId,
      meetLink: result.meetLink,
      testEmail: email,
      instructions: [
        '1. Verifique se o email chegou na caixa de entrada',
        '2. Verifique a pasta de spam/lixo eletrônico',
        '3. O email deve vir do Google Calendar (noreply@google.com)',
        '4. Se não receber, pode ser problema de configuração OAuth2'
      ]
    })

  } catch (error) {
    console.error('❌ Erro no teste de email do calendário:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao testar email do calendário',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        possibleCauses: [
          'OAuth2 token expirado',
          'Permissões insuficientes',
          'Configuração incorreta do Google Cloud Console',
          'Email inválido ou bloqueado'
        ]
      },
      { status: 500 }
    )
  }
}

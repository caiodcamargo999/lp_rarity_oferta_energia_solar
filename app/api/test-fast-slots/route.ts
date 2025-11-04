import { NextResponse } from 'next/server'
import { getAvailableTimeSlots } from '@/lib/googleSheets'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Testar com data de amanhã (deve ser rápido)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    
    console.log('🚀 Testando carregamento rápido de horários...')
    const slots = await getAvailableTimeSlots(tomorrowStr)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    return NextResponse.json({
      success: true,
      message: `Horários carregados em ${duration}ms`,
      data: {
        date: tomorrowStr,
        slots: slots,
        duration: duration,
        isFast: duration < 2000 // Menos de 2 segundos é considerado rápido
      }
    })

  } catch (error) {
    console.error('❌ Erro ao testar horários rápidos:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

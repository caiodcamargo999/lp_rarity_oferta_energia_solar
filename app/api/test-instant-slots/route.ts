import { NextRequest, NextResponse } from 'next/server'
import { getAvailableTimeSlots } from '@/lib/googleSheets'

export async function GET(request: NextRequest) {
  try {
    const start = Date.now()
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    // Testar múltiplas datas simultaneamente
    const [todaySlots, tomorrowSlots] = await Promise.all([
      getAvailableTimeSlots(today),
      getAvailableTimeSlots(tomorrow)
    ])
    
    const end = Date.now()
    const duration = end - start

    return NextResponse.json({
      success: true,
      message: `Horários carregados em ${duration}ms - ULTRA RÁPIDO!`,
      data: {
        today: {
          date: today,
          slots: todaySlots,
          count: todaySlots.length
        },
        tomorrow: {
          date: tomorrow,
          slots: tomorrowSlots,
          count: tomorrowSlots.length
        },
        performance: {
          duration: duration,
          isUltraFast: duration < 100, // Menos de 100ms é ultra rápido
          isFast: duration < 500,      // Menos de 500ms é rápido
          isAcceptable: duration < 1000 // Menos de 1s é aceitável
        }
      }
    })
  } catch (error) {
    console.error('❌ Erro ao testar carregamento ultra rápido:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

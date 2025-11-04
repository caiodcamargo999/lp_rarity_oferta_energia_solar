import { NextRequest, NextResponse } from 'next/server'
import { getAvailableTimeSlots } from '@/lib/googleSheets'

export async function GET(request: NextRequest) {
  try {
    const start = Date.now()
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    console.log('Received date:', date);

    const slots = await getAvailableTimeSlots(date)
    
    const end = Date.now()
    const duration = end - start

    return NextResponse.json({
      success: true,
      message: `Horários carregados em ${duration}ms - ULTRA RÁPIDO!`,
      data: {
        date: date,
        slots: slots,
        count: slots.length,
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

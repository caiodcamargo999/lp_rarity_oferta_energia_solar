import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const brasiliaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}))
    const currentHour = brasiliaTime.getHours()
    const currentMinute = brasiliaTime.getMinutes()
    
    const bufferHours = 2
    const cutoffHour = currentHour + bufferHours
    
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    
    const availableSlots = baseSlots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0])
      return slotHour > cutoffHour
    })
    
    return NextResponse.json({
      success: true,
      timezone: 'America/Sao_Paulo',
      currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`,
      currentHour,
      currentMinute,
      bufferHours,
      cutoffHour,
      allSlots: baseSlots,
      availableSlots,
      filteredSlots: baseSlots.map(slot => {
        const slotHour = parseInt(slot.split(':')[0])
        return {
          slot,
          slotHour,
          isAvailable: slotHour > cutoffHour
        }
      })
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao verificar horário',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

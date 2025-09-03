import { NextRequest, NextResponse } from 'next/server';
import { clearTimeSlotsCache } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    clearTimeSlotsCache()
    
    return NextResponse.json({
      success: true,
      message: 'Cache de horários limpo com sucesso'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao limpar cache',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

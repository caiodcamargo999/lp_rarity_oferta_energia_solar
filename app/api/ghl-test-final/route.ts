import { NextResponse } from 'next/server'
import { processLeadInGHL } from '@/lib/goHighLevel'

export async function POST() {
  try {
    const apiKey = process.env.GHL_API_KEY
    const locationId = process.env.GHL_LOCATION_ID
    const pipelineId = process.env.GHL_PIPELINE_ID
    const stageId = process.env.GHL_STAGE_ID

    if (!apiKey || !locationId || !pipelineId || !stageId) {
      return NextResponse.json({
        success: false,
        message: 'Variáveis de ambiente não configuradas',
        config: {
          hasApiKey: !!apiKey,
          hasLocationId: !!locationId,
          hasPipelineId: !!pipelineId,
          hasStageId: !!stageId
        }
      }, { status: 400 })
    }

    console.log('🧪 Teste final da integração completa...')
    console.log('📋 Configuração:', { pipelineId, stageId, locationId })

    // Dados de teste completos
    const testLeadData = {
      name: 'Maria Silva Teste Final',
      email: 'maria.teste.final@exemplo.com',
      whatsapp: '(11) 88888-8888',
      painPoint: 'Falta de leads qualificados para energia solar',
      hasBudget: 'sim',
      sourcePage: '/2',
      scheduledDateTime: '2025-01-28 14:00'
    }

    console.log('📝 Dados do lead de teste:', testLeadData)

    // Processar lead completo
    const result = await processLeadInGHL(testLeadData)

    console.log('📊 Resultado final:', result)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      contact: result.contact,
      opportunity: result.opportunity,
      errors: result.errors,
      config: {
        pipelineId,
        stageId,
        locationId
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro no teste final:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

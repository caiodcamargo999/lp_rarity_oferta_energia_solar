import { NextResponse } from 'next/server'
import { createOpportunity } from '@/lib/goHighLevel'

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

    console.log('🔍 Testando criação de oportunidade isoladamente...')
    console.log('📋 Configuração:', { pipelineId, stageId, locationId })

    // Usar o contactId da Maria que foi criado
    const testContactId = 'tj4cGRXn0BtV0yQYpgw6'

    const opportunityData = {
      name: 'Teste Oportunidade Isolada',
      notes: 'Teste de criação de oportunidade isolada',
      monetaryValue: 25000,
      customFields: [
        {
          key: 'maior_dor',
          value: 'Teste de debug isolado'
        },
        {
          key: 'tem_orcamento',
          value: 'sim'
        },
        {
          key: 'pagina_origem',
          value: '/teste'
        }
      ]
    }

    console.log('💼 Dados da oportunidade:', opportunityData)
    console.log('👤 Contact ID:', testContactId)

    const result = await createOpportunity(testContactId, opportunityData)

    console.log('📊 Resultado da oportunidade:', result)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      opportunity: result.opportunity,
      errors: result.errors,
      config: {
        pipelineId,
        stageId,
        locationId,
        contactId: testContactId
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro no debug de oportunidade:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

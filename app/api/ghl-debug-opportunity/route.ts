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

    console.log('🔍 Testando criação de oportunidade...')
    console.log('📋 Configuração:', { pipelineId, stageId, locationId })

    // Usar um contactId de teste (vamos usar o que foi criado anteriormente)
    const testContactId = 'eOs2rM1exQa5iJO7579Q' // ID do contato criado no teste anterior

    const opportunityData = {
      name: 'Teste Oportunidade Debug',
      notes: 'Teste de criação de oportunidade via API',
      monetaryValue: 25000,
      customFields: [
        {
          key: 'maior_dor',
          value: 'Teste de debug'
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

    const result = await createOpportunity(testContactId, opportunityData)

    console.log('📊 Resultado:', result)

    // Se a oportunidade foi criada, tentar mover para o stage correto
    if (result.success && result.opportunity?.id) {
      console.log('🔄 Tentando mover oportunidade para o stage correto...')
      
      try {
        const moveResponse = await fetch(
          `https://services.leadconnectorhq.com/opportunities/${result.opportunity.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              stageId: stageId,
              locationId: locationId
            })
          }
        )

        const moveResult = await moveResponse.json()
        console.log('🔄 Resultado do movimento:', moveResult)
        
        if (moveResponse.ok) {
          result.message += ' e movida para o stage correto'
        } else {
          result.message += ` (criada, mas erro ao mover para stage: ${moveResult.message})`
        }
      } catch (moveError) {
        console.error('❌ Erro ao mover para stage:', moveError)
        result.message += ` (criada, mas erro ao mover para stage: ${moveError})`
      }
    }

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

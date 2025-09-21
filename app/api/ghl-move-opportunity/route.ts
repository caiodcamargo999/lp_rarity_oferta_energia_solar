import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const apiKey = process.env.GHL_API_KEY
    const locationId = process.env.GHL_LOCATION_ID
    const stageId = process.env.GHL_STAGE_ID

    if (!apiKey || !locationId || !stageId) {
      return NextResponse.json({
        success: false,
        message: 'Variáveis de ambiente não configuradas'
      }, { status: 400 })
    }

    // ID da oportunidade criada no teste anterior
    const opportunityId = 'RTmmgma0' // Substitua pelo ID real da oportunidade

    console.log('🔄 Movendo oportunidade para o stage correto...')
    console.log('📋 Configuração:', { opportunityId, stageId, locationId })

    // Tentar diferentes endpoints para mover a oportunidade
    const endpoints = [
      // Endpoint 1: Atualizar oportunidade
      `https://services.leadconnectorhq.com/opportunities/${opportunityId}`,
      // Endpoint 2: Mover para stage específico
      `https://services.leadconnectorhq.com/opportunities/${opportunityId}/stage`,
      // Endpoint 3: Atualizar com stageId no body
      `https://services.leadconnectorhq.com/opportunities/${opportunityId}`
    ]

    const payloads = [
      // Payload 1: Apenas stageId
      { stageId: stageId },
      // Payload 2: Com locationId
      { stageId: stageId, locationId: locationId },
      // Payload 3: Com status
      { stageId: stageId, status: 'open' }
    ]

    const results = []

    for (let i = 0; i < endpoints.length; i++) {
      for (let j = 0; j < payloads.length; j++) {
        try {
          console.log(`🔍 Tentando endpoint ${i + 1}, payload ${j + 1}:`, endpoints[i])
          
          const response = await fetch(endpoints[i], {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            body: JSON.stringify(payloads[j])
          })

          const data = await response.json()
          
          results.push({
            endpoint: endpoints[i],
            payload: payloads[j],
            status: response.status,
            success: response.ok,
            data: data
          })

          console.log(`✅ Endpoint ${i + 1}, payload ${j + 1} funcionou:`, response.status)

          if (response.ok) {
            return NextResponse.json({
              success: true,
              message: 'Oportunidade movida para o stage correto com sucesso!',
              opportunity: data.opportunity || data,
              method: `Endpoint ${i + 1}, Payload ${j + 1}`,
              timestamp: new Date().toISOString()
            })
          }

        } catch (error) {
          console.log(`❌ Endpoint ${i + 1}, payload ${j + 1} falhou:`, error)
          results.push({
            endpoint: endpoints[i],
            payload: payloads[j],
            status: 'error',
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          })
        }
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Não foi possível mover a oportunidade. Testando diferentes métodos...',
      results: results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

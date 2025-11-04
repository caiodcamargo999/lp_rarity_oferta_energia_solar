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

    // ID da oportunidade "Teste Oportunidade Isolada" que foi criada
    const opportunityId = 'RTmmgma0' // Substitua pelo ID real se necessário

    console.log('🔄 Movendo oportunidade para o stage correto...')
    console.log('📋 Configuração:', { opportunityId, stageId, locationId })

    // Método 1: Tentar atualizar a oportunidade com stageId
    try {
      const response = await fetch(
        `https://services.leadconnectorhq.com/opportunities/${opportunityId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify({
            stageId: stageId
          })
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Oportunidade movida para o stage correto com sucesso!',
          opportunity: data.opportunity || data,
          method: 'Método 1: Atualizar com stageId',
          timestamp: new Date().toISOString()
        })
      } else {
        console.log('❌ Método 1 falhou:', data)
      }
    } catch (error) {
      console.log('❌ Erro no método 1:', error)
    }

    // Método 2: Tentar endpoint específico para stage
    try {
      const response = await fetch(
        `https://services.leadconnectorhq.com/opportunities/${opportunityId}/stage`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify({
            stageId: stageId
          })
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Oportunidade movida para o stage correto com sucesso!',
          opportunity: data.opportunity || data,
          method: 'Método 2: Endpoint específico para stage',
          timestamp: new Date().toISOString()
        })
      } else {
        console.log('❌ Método 2 falhou:', data)
      }
    } catch (error) {
      console.log('❌ Erro no método 2:', error)
    }

    // Método 3: Tentar com PATCH em vez de PUT
    try {
      const response = await fetch(
        `https://services.leadconnectorhq.com/opportunities/${opportunityId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify({
            stageId: stageId
          })
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Oportunidade movida para o stage correto com sucesso!',
          opportunity: data.opportunity || data,
          method: 'Método 3: PATCH com stageId',
          timestamp: new Date().toISOString()
        })
      } else {
        console.log('❌ Método 3 falhou:', data)
      }
    } catch (error) {
      console.log('❌ Erro no método 3:', error)
    }

    return NextResponse.json({
      success: false,
      message: 'Não foi possível mover a oportunidade. A API do Go High Level pode ter limitações para mover oportunidades entre stages.',
      suggestion: 'A oportunidade foi criada com sucesso, mas você precisará movê-la manualmente para o stage "Reunião Agendada" no Go High Level.',
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

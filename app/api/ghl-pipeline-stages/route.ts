import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GHL_API_KEY
    const locationId = process.env.GHL_LOCATION_ID

    if (!apiKey || !locationId) {
      return NextResponse.json({
        success: false,
        message: 'GHL_API_KEY e GHL_LOCATION_ID são obrigatórios'
      }, { status: 400 })
    }

    console.log('🔍 Buscando informações do pipeline e stages...')

    // Tentar diferentes endpoints para encontrar os stages
    const endpoints = [
      // Endpoint 1: Buscar pipelines primeiro
      `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`,
      // Endpoint 2: Buscar stages diretamente
      `https://services.leadconnectorhq.com/opportunities/pipelines/${locationId}/stages`,
      // Endpoint 3: Buscar opportunities (que pode ter informações de stages)
      `https://services.leadconnectorhq.com/opportunities/?locationId=${locationId}&limit=1`
    ]

    const results = []

    for (let i = 0; i < endpoints.length; i++) {
      try {
        console.log(`🔍 Tentando endpoint ${i + 1}: ${endpoints[i]}`)
        
        const response = await fetch(endpoints[i], {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          }
        })

        const data = await response.json()
        
        results.push({
          endpoint: endpoints[i],
          status: response.status,
          success: response.ok,
          data: data
        })

        console.log(`✅ Endpoint ${i + 1} funcionou:`, response.status)

        // Se encontrou pipelines, tentar buscar stages
        if (response.ok && data.pipelines && data.pipelines.length > 0) {
          const pipelineId = data.pipelines[0].id
          console.log(`🔍 Pipeline encontrado: ${pipelineId}`)
          
          // Tentar buscar stages deste pipeline
          try {
            const stagesResponse = await fetch(
              `https://services.leadconnectorhq.com/opportunities/pipelines/${pipelineId}/stages`,
              {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'Version': '2021-07-28'
                }
              }
            )

            const stagesData = await stagesResponse.json()
            
            results.push({
              endpoint: `pipelines/${pipelineId}/stages`,
              status: stagesResponse.status,
              success: stagesResponse.ok,
              data: stagesData
            })

            if (stagesResponse.ok && stagesData.stages) {
              console.log(`✅ Stages encontrados:`, stagesData.stages.length)
              
              // Procurar pelo stage "Reunião Agendada"
              const reuniaoStage = stagesData.stages.find((stage: any) => 
                stage.name && stage.name.toLowerCase().includes('reunião')
              )

              return NextResponse.json({
                success: true,
                message: 'Stages encontrados com sucesso!',
                pipelineId: pipelineId,
                stages: stagesData.stages,
                reuniaoStage: reuniaoStage,
                timestamp: new Date().toISOString()
              })
            }
          } catch (stageError) {
            console.log(`❌ Erro ao buscar stages:`, stageError)
          }
        }

      } catch (error) {
        console.log(`❌ Endpoint ${i + 1} falhou:`, error)
        results.push({
          endpoint: endpoints[i],
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Não foi possível encontrar stages. Testando diferentes endpoints...',
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

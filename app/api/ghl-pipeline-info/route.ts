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

    console.log('🔍 Buscando informações do pipeline...')

    // Buscar pipelines da subconta
    const pipelinesResponse = await fetch(
      `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      }
    )

    const pipelinesData = await pipelinesResponse.json()

    if (!pipelinesResponse.ok) {
      throw new Error(`Erro na API: ${pipelinesData.message}`)
    }

    console.log('📊 Pipelines encontrados:', pipelinesData.pipelines?.length || 0)

    // Buscar stages de cada pipeline
    const pipelinesWithStages = []
    
    for (const pipeline of pipelinesData.pipelines || []) {
      console.log(`🔍 Buscando stages do pipeline: ${pipeline.name} (${pipeline.id})`)
      
      const stagesResponse = await fetch(
        `https://services.leadconnectorhq.com/opportunities/pipelines/${pipeline.id}/stages?locationId=${locationId}`,
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
      
      if (stagesResponse.ok) {
        pipelinesWithStages.push({
          pipeline: {
            id: pipeline.id,
            name: pipeline.name
          },
          stages: stagesData.stages?.map((stage: any) => ({
            id: stage.id,
            name: stage.name,
            position: stage.position
          })) || []
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Informações do pipeline obtidas com sucesso',
      data: {
        locationId,
        pipelines: pipelinesWithStages
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar informações do pipeline:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

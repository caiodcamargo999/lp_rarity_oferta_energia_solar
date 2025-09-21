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

    console.log('🔍 Buscando stages do pipeline padrão...')

    // Buscar stages do pipeline padrão (usando locationId como pipelineId)
    const stagesResponse = await fetch(
      `https://services.leadconnectorhq.com/opportunities/pipelines/${locationId}/stages`,
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

    if (!stagesResponse.ok) {
      throw new Error(`Erro na API: ${stagesData.message}`)
    }

    console.log('📊 Stages encontrados:', stagesData.stages?.length || 0)

    // Procurar pelo stage "Reunião Agendada"
    const reuniaoAgendadaStage = stagesData.stages?.find((stage: any) => 
      stage.name.toLowerCase().includes('reunião') || 
      stage.name.toLowerCase().includes('agendada') ||
      stage.name.toLowerCase().includes('reuniao')
    )

    return NextResponse.json({
      success: true,
      message: 'Stages do pipeline padrão obtidos com sucesso',
      data: {
        locationId,
        pipelineId: locationId, // Pipeline padrão usa o mesmo ID do location
        stages: stagesData.stages?.map((stage: any) => ({
          id: stage.id,
          name: stage.name,
          position: stage.position
        })) || [],
        reuniaoAgendadaStage: reuniaoAgendadaStage ? {
          id: reuniaoAgendadaStage.id,
          name: reuniaoAgendadaStage.name,
          position: reuniaoAgendadaStage.position
        } : null
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar stages:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

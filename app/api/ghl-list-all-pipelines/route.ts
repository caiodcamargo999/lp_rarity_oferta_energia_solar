import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GHL_API_KEY
    const locationId = process.env.GHL_LOCATION_ID
    const baseUrl = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com'

    if (!apiKey || !locationId) {
      return NextResponse.json({
        success: false,
        message: 'Credenciais do GHL não configuradas'
      }, { status: 400 })
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    }

    // Buscar todos os pipelines
    const response = await fetch(
      `${baseUrl}/opportunities/pipelines?locationId=${locationId}`,
      {
        method: 'GET',
        headers
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erro na API: ${data.message}`)
    }

    // Filtrar pipelines que contenham "Rarity Brasil"
    const rarityPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil')
    ) || []

    // Filtrar pipelines que contenham "Energia Solar"
    const energiaSolarPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Energia Solar')
    ) || []

    // Filtrar pipelines que contenham "Inbound"
    const inboundPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Inbound')
    ) || []

    return NextResponse.json({
      success: true,
      message: `Encontrados ${data.pipelines?.length || 0} pipelines`,
      data: {
        total: data.pipelines?.length || 0,
        rarityPipelines: rarityPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        energiaSolarPipelines: energiaSolarPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        inboundPipelines: inboundPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        allPipelines: data.pipelines?.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })) || []
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pipelines:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

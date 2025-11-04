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

    // Filtrar todos os pipelines que contenham "Rarity Brasil"
    const rarityPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil')
    ) || []

    // Criar lista legível
    const rarityPipelinesList = rarityPipelines.map((p: any, index: number) => 
      `${index + 1}. ${p.name} (ID: ${p.id})`
    ).join('\n')

    return NextResponse.json({
      success: true,
      message: `Encontrados ${rarityPipelines.length} pipelines da Rarity Brasil`,
      data: {
        total: rarityPipelines.length,
        pipelines: rarityPipelinesList,
        raw: rarityPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        }))
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

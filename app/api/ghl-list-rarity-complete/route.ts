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

    // Filtrar pipelines da Rarity Brasil
    const rarityPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil')
    ) || []

    // Procurar especificamente pelo pipeline [Inbound]
    const inboundPipeline = rarityPipelines.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil'
    )

    // Procurar pelo pipeline [Outbound] (renomeado)
    const outboundPipeline = rarityPipelines.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Outbound] Empresas de Energia Solar no Brasil'
    )

    return NextResponse.json({
      success: true,
      message: 'Lista completa de pipelines da Rarity Brasil',
      data: {
        inboundPipeline: inboundPipeline ? {
          id: inboundPipeline.id,
          name: inboundPipeline.name,
          stages: inboundPipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        } : null,
        outboundPipeline: outboundPipeline ? {
          id: outboundPipeline.id,
          name: outboundPipeline.name,
          stages: outboundPipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        } : null,
        allRarityPipelines: rarityPipelines.map((p: any, index: number) => ({
          numero: index + 1,
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0,
          isInbound: p.name?.includes('[Inbound]') || false,
          isOutbound: p.name?.includes('[Outbound]') || false,
          isEnergiaSolar: p.name?.includes('Energia Solar') || false
        })),
        total: rarityPipelines.length
      }
    })

  } catch (error) {
    console.error('❌ Erro ao listar pipelines:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

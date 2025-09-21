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

    // Procurar especificamente pelos pipelines [Inbound] e [Outbound]
    const inboundPipeline = data.pipelines?.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil'
    )

    const outboundPipeline = data.pipelines?.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Outbound] Empresas de Energia Solar no Brasil'
    )

    // Filtrar todos os pipelines que contenham "Rarity Brasil" e "Energia Solar"
    const raritySolarPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil') && 
      pipeline.name?.includes('Energia Solar')
    ) || []

    return NextResponse.json({
      success: true,
      message: 'Busca por pipelines Inbound/Outbound concluída',
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
        allRaritySolarPipelines: raritySolarPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        })),
        total: data.pipelines?.length || 0
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

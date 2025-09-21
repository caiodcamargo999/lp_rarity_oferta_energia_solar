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

    const allPipelines = data.pipelines || []

    // Procurar por pipelines que contenham "Inbound"
    const inboundPipelines = allPipelines.filter((pipeline: any) => 
      pipeline.name?.toLowerCase().includes('inbound')
    )

    // Procurar por pipelines que contenham "Outbound"
    const outboundPipelines = allPipelines.filter((pipeline: any) => 
      pipeline.name?.toLowerCase().includes('outbound')
    )

    // Procurar por pipelines que contenham "Energia Solar"
    const energiaSolarPipelines = allPipelines.filter((pipeline: any) => 
      pipeline.name?.toLowerCase().includes('energia solar')
    )

    // Procurar por pipelines que contenham "Rarity Brasil"
    const rarityPipelines = allPipelines.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil')
    )

    return NextResponse.json({
      success: true,
      message: 'Debug completo de todos os pipelines',
      data: {
        total: allPipelines.length,
        inboundPipelines: inboundPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        outboundPipelines: outboundPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        energiaSolarPipelines: energiaSolarPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        rarityPipelines: rarityPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        allPipelines: allPipelines.map((p: any, index: number) => ({
          numero: index + 1,
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        }))
      }
    })

  } catch (error) {
    console.error('❌ Erro ao fazer debug dos pipelines:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

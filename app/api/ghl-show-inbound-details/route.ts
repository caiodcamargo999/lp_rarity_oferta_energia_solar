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

    // Procurar por qualquer pipeline que contenha "Inbound"
    const inboundPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.toLowerCase().includes('inbound')
    ) || []

    // Procurar especificamente pelo pipeline que você criou
    const targetInboundPipeline = data.pipelines?.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil'
    )

    return NextResponse.json({
      success: true,
      message: 'Busca por pipelines Inbound concluída',
      data: {
        targetPipeline: targetInboundPipeline ? {
          id: targetInboundPipeline.id,
          name: targetInboundPipeline.name,
          stages: targetInboundPipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        } : null,
        allInboundPipelines: inboundPipelines.map((p: any, index: number) => ({
          numero: index + 1,
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        total: inboundPipelines.length
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

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

    console.log('🔍 Buscando pipeline [Inbound] especificamente...')

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

    // Buscar especificamente pelo pipeline [Inbound]
    const inboundPipeline = allPipelines.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil'
    )

    // Buscar por variações do nome
    const variations = [
      '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil',
      'Rarity Brasil Inbound Empresas de Energia Solar no Brasil',
      'Rarity Brasil Inbound Energia Solar',
      'Inbound Empresas de Energia Solar no Brasil',
      'Rarity Brasil Inbound',
      'Inbound Energia Solar'
    ]

    const foundVariations = variations.map(variation => {
      const found = allPipelines.find((pipeline: any) => 
        pipeline.name === variation
      )
      return {
        variation,
        found: !!found,
        pipeline: found ? {
          id: found.id,
          name: found.name,
          stages: found.stages?.length || 0
        } : null
      }
    })

    // Buscar por pipelines que contenham "Inbound" e "Energia Solar"
    const inboundSolarPipelines = allPipelines.filter((pipeline: any) => 
      pipeline.name?.toLowerCase().includes('inbound') && 
      pipeline.name?.toLowerCase().includes('energia solar')
    )

    // Buscar por pipelines que contenham "Rarity Brasil" e "Inbound"
    const rarityInboundPipelines = allPipelines.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil') && 
      pipeline.name?.toLowerCase().includes('inbound')
    )

    return NextResponse.json({
      success: true,
      message: 'Busca específica por pipeline [Inbound] concluída',
      data: {
        targetPipeline: inboundPipeline ? {
          id: inboundPipeline.id,
          name: inboundPipeline.name,
          stages: inboundPipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        } : null,
        variations: foundVariations,
        inboundSolarPipelines: inboundSolarPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        rarityInboundPipelines: rarityInboundPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.length || 0
        })),
        total: allPipelines.length
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pipeline [Inbound]:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
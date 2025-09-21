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

    // Procurar especificamente pelo pipeline "[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil"
    const targetPipeline = data.pipelines?.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil'
    )

    // Se não encontrar o exato, procurar por variações
    const similarPipelines = data.pipelines?.filter((pipeline: any) => 
      pipeline.name?.includes('Rarity Brasil') && 
      pipeline.name?.includes('Inbound') &&
      pipeline.name?.includes('Energia Solar')
    ) || []

    // Listar todos os pipelines para debug
    const allPipelines = data.pipelines?.map((p: any) => ({
      id: p.id,
      name: p.name,
      hasInbound: p.name?.includes('Inbound'),
      hasEnergiaSolar: p.name?.includes('Energia Solar'),
      hasRarityBrasil: p.name?.includes('Rarity Brasil')
    })) || []

    return NextResponse.json({
      success: true,
      message: 'Busca por pipeline concluída',
      data: {
        targetPipeline: targetPipeline ? {
          id: targetPipeline.id,
          name: targetPipeline.name,
          stages: targetPipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        } : null,
        similarPipelines: similarPipelines.map((p: any) => ({
          id: p.id,
          name: p.name,
          stages: p.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        })),
        allPipelines: allPipelines,
        total: data.pipelines?.length || 0
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pipeline:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

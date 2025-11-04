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

    console.log('🔄 Forçando sincronização da API...')

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

    // Buscar especificamente pelo pipeline que você criou
    const targetPipeline = allPipelines.find((pipeline: any) => 
      pipeline.name === '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil'
    )

    // Buscar por variações do nome
    const variations = [
      '[Rarity Brasil] [Inbound] Empresas de Energia Solar no Brasil',
      'Rarity Brasil Inbound Empresas de Energia Solar no Brasil',
      'Rarity Brasil Inbound Energia Solar',
      'Inbound Empresas de Energia Solar no Brasil'
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

    // Buscar por pipelines que contenham partes do nome
    const partialMatches = allPipelines.filter((pipeline: any) => 
      pipeline.name?.includes('Inbound') && 
      pipeline.name?.includes('Energia Solar') &&
      pipeline.name?.includes('Rarity Brasil')
    )

    return NextResponse.json({
      success: true,
      message: 'Sincronização forçada concluída',
      data: {
        total: allPipelines.length,
        targetPipeline: targetPipeline ? {
          id: targetPipeline.id,
          name: targetPipeline.name,
          stages: targetPipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position
          })) || []
        } : null,
        variations: foundVariations,
        partialMatches: partialMatches.map((p: any) => ({
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
    console.error('❌ Erro ao forçar sincronização:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

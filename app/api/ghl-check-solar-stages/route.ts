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

    // ID do pipeline de energia solar
    const pipelineId = 'VzYBuXQifcInIguJavqc'

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

    // Encontrar o pipeline específico
    const targetPipeline = data.pipelines?.find((pipeline: any) => 
      pipeline.id === pipelineId
    )

    if (!targetPipeline) {
      return NextResponse.json({
        success: false,
        message: 'Pipeline de energia solar não encontrado'
      })
    }

    // Encontrar o stage "Reunião Agendada"
    const reuniaoStage = targetPipeline.stages?.find((stage: any) => 
      stage.name === 'Reunião Agendada'
    )

    // Listar todos os stages de forma legível
    const stagesList = targetPipeline.stages?.map((s: any, index: number) => 
      `${index + 1}. ${s.name} (ID: ${s.id})`
    ).join('\n') || ''

    return NextResponse.json({
      success: true,
      message: 'Pipeline e stages encontrados com sucesso!',
      data: {
        pipeline: {
          id: targetPipeline.id,
          name: targetPipeline.name
        },
        stages: {
          total: targetPipeline.stages?.length || 0,
          list: stagesList,
          reuniaoAgendada: reuniaoStage ? {
            id: reuniaoStage.id,
            name: reuniaoStage.name,
            position: reuniaoStage.position
          } : null
        },
        configuracao: {
          GHL_PIPELINE_ID: targetPipeline.id,
          GHL_STAGE_ID: reuniaoStage?.id || 'STAGE_NAO_ENCONTRADO',
          GHL_LOCATION_ID: locationId,
          GHL_API_KEY: 'CONFIGURADO',
          GHL_BASE_URL: baseUrl
        }
      }
    })

  } catch (error) {
    console.error('❌ Erro ao verificar stages:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

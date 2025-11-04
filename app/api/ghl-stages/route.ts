import { NextResponse } from 'next/server'
import { getPipelineByName, getStagesForPipeline } from '@/lib/goHighLevel'

export async function GET() {
  try {
    const pipelineName = process.env.GHL_PIPELINE_NAME || '[Rarity Brasil] Empresas de Energia Solar no Brasil'
    console.log(`🔍 Buscando stages para o pipeline: ${pipelineName}`)

    const pipeline = await getPipelineByName(pipelineName)

    if (!pipeline) {
      return NextResponse.json(
        {
          success: false,
          message: `Pipeline com nome "${pipelineName}" não encontrado.`,
        },
        { status: 404 }
      )
    }

    const stages = await getStagesForPipeline(pipeline.id)

    if (!stages || stages.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'Pipeline encontrado, mas não possui stages.',
          data: {
            pipelineId: pipeline.id,
            pipelineName: pipeline.name,
            stages: [],
          },
        },
        { status: 200 }
      )
    }

    const reuniaoAgendadaStage = stages.find(
      (stage: any) =>
        stage.name.toLowerCase().includes('reunião') ||
        stage.name.toLowerCase().includes('agendada') ||
        stage.name.toLowerCase().includes('reuniao')
    )

    return NextResponse.json({
      success: true,
      message: 'Stages do pipeline obtidos com sucesso',
      data: {
        pipelineId: pipeline.id,
        pipelineName: pipeline.name,
        stages: stages.map((stage: any) => ({
          id: stage.id,
          name: stage.name,
          position: stage.position,
        })),
        reuniaoAgendadaStage: reuniaoAgendadaStage
          ? {
              id: reuniaoAgendadaStage.id,
              name: reuniaoAgendadaStage.name,
              position: reuniaoAgendadaStage.position,
            }
          : null,
      },
    })
  } catch (error) {
    console.error('❌ Erro ao buscar stages:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
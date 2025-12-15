import { NextResponse } from 'next/server'
import { getGHLConfig, getStagesForPipeline } from '@/lib/goHighLevel'

export async function GET() {
  try {
    const config = getGHLConfig()
    const pipelineId = process.env.GHL_PIPELINE_ID
    const stageId = process.env.GHL_STAGE_ID

    if (!pipelineId) {
      return NextResponse.json({
        success: false,
        error: 'GHL_PIPELINE_ID não está configurado'
      })
    }

    if (!stageId) {
      return NextResponse.json({
        success: false,
        error: 'GHL_STAGE_ID não está configurado'
      })
    }

    console.log('🔍 Verificando configuração do stage...')
    console.log('Pipeline ID:', pipelineId)
    console.log('Stage ID:', stageId)

    // Buscar todos os stages do pipeline
    const stages = await getStagesForPipeline(pipelineId)

    // Verificar se o stage ID existe no pipeline
    const targetStage = stages.find((stage: any) => stage.id === stageId)

    if (targetStage) {
      return NextResponse.json({
        success: true,
        message: 'Stage encontrado!',
        pipelineId,
        stageId,
        stageName: targetStage.name,
        allStages: stages.map((s: any) => ({
          id: s.id,
          name: s.name
        }))
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `Stage ID ${stageId} não encontrado no pipeline ${pipelineId}`,
        pipelineId,
        stageId,
        allStages: stages.map((s: any) => ({
          id: s.id,
          name: s.name
        }))
      })
    }

  } catch (error) {
    console.error('❌ Erro ao verificar stage:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}

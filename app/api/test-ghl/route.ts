import { NextResponse } from 'next/server'
import { testGHLConnection, processLeadInGHL } from '@/lib/goHighLevel'

export async function GET() {
  try {
    console.log('🧪 Iniciando teste de conexão com Go High Level...')
    
    const result = await testGHLConnection()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
      data: result.contact
    })
    
  } catch (error) {
    console.error('❌ Erro no teste GHL:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🧪 Testando criação de lead no Go High Level...')
    
    // Dados de teste
    const testLeadData = {
      name: 'João Silva Teste',
      email: `teste-${Date.now()}@exemplo.com`,
      whatsapp: '(11) 99999-9999',
      painPoint: 'Teste de integração com GHL',
      hasBudget: 'sim',
      sourcePage: '/test',
      scheduledDateTime: 'Teste - não agendado'
    }
    
    const result = await processLeadInGHL(testLeadData)
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
      contact: result.contact ? { id: result.contact.id, name: result.contact.name } : null,
      opportunity: result.opportunity ? { id: result.opportunity.id, name: result.opportunity.name } : null
    })
    
  } catch (error) {
    console.error('❌ Erro no teste de criação GHL:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

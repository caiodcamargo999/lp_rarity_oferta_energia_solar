import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GHL_API_KEY
    const locationId = process.env.GHL_LOCATION_ID

    if (!apiKey || !locationId) {
      return NextResponse.json({
        success: false,
        message: 'GHL_API_KEY e GHL_LOCATION_ID são obrigatórios',
        config: {
          hasApiKey: !!apiKey,
          hasLocationId: !!locationId
        }
      }, { status: 400 })
    }

    console.log('🔍 Testando conexão básica com Go High Level...')

    // Teste 1: Buscar informações da localização
    try {
      const locationResponse = await fetch(
        `https://services.leadconnectorhq.com/locations/${locationId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          }
        }
      )

      const locationData = await locationResponse.json()

      if (locationResponse.ok) {
        console.log('✅ Conexão com GHL funcionando!')
        
        return NextResponse.json({
          success: true,
          message: 'Conexão com Go High Level estabelecida com sucesso!',
          location: {
            id: locationData.location?.id,
            name: locationData.location?.name,
            timezone: locationData.location?.timezone
          },
          nextSteps: [
            '1. Acesse: http://localhost:3000/api/ghl-pipeline-stages',
            '2. Isso vai buscar os pipelines e stages disponíveis',
            '3. Procure pelo stage "Reunião Agendada"',
            '4. Copie o Stage ID para configurar no .env.local'
          ],
          timestamp: new Date().toISOString()
        })
      } else {
        throw new Error(`Erro na API: ${locationData.message || 'Status ' + locationResponse.status}`)
      }

    } catch (error) {
      console.error('❌ Erro na conexão:', error)
      
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão com Go High Level',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        troubleshooting: [
          '1. Verifique se GHL_API_KEY está correto',
          '2. Verifique se GHL_LOCATION_ID está correto',
          '3. Confirme se a API Key tem as permissões necessárias',
          '4. Teste a API Key no Postman ou similar'
        ],
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

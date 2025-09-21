import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { leadData, contactId, opportunityId } = await request.json()

    if (!leadData || !contactId) {
      return NextResponse.json({
        success: false,
        message: 'Dados do lead são obrigatórios'
      }, { status: 400 })
    }

    // Configurar SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Template do email
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>🚨 Novo Lead da Landing Page</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8A2BE2, #DA70D6); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .alert { background: #ff6b6b; color: white; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; font-weight: bold; }
            .info { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .button { background: #8A2BE2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 Novo Lead da Landing Page</h1>
                <p>Rarity Agency - Sistema Automático</p>
            </div>
            
            <div class="content">
                <div class="alert">
                    ⚠️ AÇÃO NECESSÁRIA: Mover oportunidade para "Reunião Agendada" no Go High Level
                </div>
                
                <div class="info">
                    <h3>📋 Informações do Lead</h3>
                    <p><strong>Nome:</strong> ${leadData.name}</p>
                    <p><strong>Email:</strong> ${leadData.email}</p>
                    <p><strong>WhatsApp:</strong> ${leadData.whatsapp}</p>
                    <p><strong>Maior Dor:</strong> ${leadData.painPoint}</p>
                    <p><strong>Tem Orçamento:</strong> ${leadData.hasBudget}</p>
                    <p><strong>Página de Origem:</strong> ${leadData.sourcePage}</p>
                    <p><strong>Data/Hora Agendamento:</strong> ${leadData.scheduledDateTime || 'Não agendado'}</p>
                </div>
                
                <div class="info">
                    <h3>🔗 Links do Go High Level</h3>
                    <p><strong>Contato ID:</strong> ${contactId}</p>
                    ${opportunityId ? `<p><strong>Oportunidade ID:</strong> ${opportunityId}</p>` : ''}
                    <p><strong>Pipeline:</strong> Empresas de Energia Solar no Brasil</p>
                    <p><strong>Stage Atual:</strong> Entrada</p>
                    <p><strong>Stage Desejado:</strong> Reunião Agendada</p>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://app.3a3r.com/v2/location/SORzJGuoZ25WsfiJPg3b/opportunities/list" class="button">
                        🔗 Abrir Go High Level
                    </a>
                </div>
                
                <div class="info">
                    <h3>📝 Instruções</h3>
                    <ol>
                        <li>Clique no link acima para abrir o Go High Level</li>
                        <li>Procure pela oportunidade: <strong>"${leadData.name} - ${leadData.hasBudget === 'sim' ? 'Com Orçamento' : 'Sem Orçamento'}"</strong></li>
                        <li>Arraste a oportunidade do stage "Entrada" para "Reunião Agendada"</li>
                        <li>Verifique se as tags foram aplicadas corretamente</li>
                    </ol>
                </div>
            </div>
            
            <div class="footer">
                <p>Este email foi enviado automaticamente pelo sistema de captura de leads da Rarity Agency.</p>
                <p>Data/Hora: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
        </div>
    </body>
    </html>
    `

    // Enviar email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Enviar para você mesmo
      subject: `🚨 Novo Lead: ${leadData.name} - ${leadData.hasBudget === 'sim' ? 'Com Orçamento' : 'Sem Orçamento'}`,
      html: emailHtml
    })

    console.log('📧 Email de notificação enviado para:', process.env.SMTP_USER)

    return NextResponse.json({
      success: true,
      message: 'Notificação por email enviada com sucesso!',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

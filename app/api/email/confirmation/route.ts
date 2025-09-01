import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Configurar transportador de email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'matheusdrarity@gmail.com',
        pass: process.env.SMTP_PASS // Senha de app do Gmail
      }
    })

    // Formatar data e hora para português
    const scheduledDate = new Date(data.scheduledDate)
    const formattedDate = scheduledDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    // Template do email
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmação de Consultoria - Rarity Agency Brasil</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #8A2BE2;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #8A2BE2;
              margin-bottom: 10px;
            }
            .title {
              color: #8A2BE2;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .info-box {
              background-color: #f8f9fa;
              border-left: 4px solid #8A2BE2;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .meeting-info {
              background-color: #e8f4fd;
              border: 1px solid #bee5eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #8A2BE2;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .highlight {
              color: #8A2BE2;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RARITY AGENCY</div>
              <h1 class="title">Consulta Estratégica Confirmada! 🎉</h1>
            </div>

            <p>Olá <span class="highlight">${data.name}</span>,</p>
            
            <p>Sua consultoria estratégica com a <strong>Rarity Agency Brasil</strong> foi agendada com sucesso!</p>

            <div class="meeting-info">
              <h3>📅 Detalhes da Consultoria:</h3>
              <p><strong>Data:</strong> ${formattedDate}</p>
              <p><strong>Horário:</strong> ${data.scheduledTime} (Horário de Brasília)</p>
              <p><strong>Duração:</strong> 30 minutos</p>
              <p><strong>Plataforma:</strong> Google Meet</p>
            </div>

            <div class="info-box">
              <h3>🎯 O que esperar da sua consultoria:</h3>
              <ul>
                <li>Análise personalizada do seu negócio de energia solar</li>
                <li>Estratégias de IA e automação para crescimento</li>
                <li>Plano de ação para multiplicar suas vendas</li>
                <li>Respostas para suas principais dúvidas</li>
              </ul>
            </div>

            <div class="info-box">
              <h3>📱 Lembretes automáticos:</h3>
              <p>Você receberá lembretes automáticos:</p>
              <ul>
                <li>📧 24 horas antes da consultoria</li>
                <li>📧 2 horas antes da consultoria</li>
                <li>🔔 Popup de 15 minutos antes (se estiver no Google Calendar)</li>
              </ul>
            </div>

            <p><strong>Importante:</strong> O link do Google Meet será enviado automaticamente pelo Google Calendar 
            alguns minutos antes da consultoria.</p>

            <div style="text-align: center;">
              <a href="https://www.instagram.com/rarity.brasil/" class="button" target="_blank">
                Siga-nos no Instagram
              </a>
            </div>

            <div class="footer">
              <p><strong>Rarity Agency Brasil</strong></p>
              <p>Especialistas em Marketing Digital para Energia Solar</p>
              <p>📧 matheusdrarity@gmail.com</p>
              <p>📱 <a href="https://www.instagram.com/rarity.brasil/">@rarity.brasil</a></p>
              <p style="font-size: 12px; color: #999;">
                Este email foi enviado automaticamente. Não responda a este email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Enviar email
    const mailOptions = {
      from: `"Rarity Agency Brasil" <${process.env.SMTP_USER || 'matheusdrarity@gmail.com'}>`,
      to: data.email,
      subject: '✅ Consultoria Estratégica Confirmada - Rarity Agency Brasil',
      html: emailHtml
    }

    await transporter.sendMail(mailOptions)

    console.log('✅ Email de confirmação enviado para:', data.email)

    return NextResponse.json({
      success: true,
      message: 'Email de confirmação enviado com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email de confirmação' },
      { status: 500 }
    )
  }
}

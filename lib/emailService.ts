import nodemailer from 'nodemailer'

// Configurar transporter do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'caiorarity@gmail.com',
    pass: process.env.SMTP_PASS || ''
  }
})

export interface EmailData {
  to: string
  name: string
  scheduledDateTime: string
  meetLink: string
  sourcePage: string
}

export async function sendConfirmationEmail(emailData: EmailData): Promise<boolean> {
  try {
    const { to, name, scheduledDateTime, meetLink, sourcePage } = emailData

    // Formatar data e hora
    const date = new Date(scheduledDateTime)
    const formattedDate = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })

    // Template do email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Sessão Estratégica - Rarity Agency</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8A2BE2, #DA70D6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #8A2BE2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Sessão Estratégica Confirmada!</h1>
            <p>Rarity Agency - Especialistas em Marketing Digital para Energia Solar</p>
          </div>
          
          <div class="content">
            <h2>Olá ${name}!</h2>
            
            <p>Sua <strong>Sessão Estratégica Gratuita</strong> foi agendada com sucesso!</p>
            
            <div class="highlight">
              <h3>📅 Detalhes da Sessão:</h3>
              <p><strong>Data:</strong> ${formattedDate}</p>
              <p><strong>Horário:</strong> ${formattedTime} (Horário de Brasília)</p>
              <p><strong>Duração:</strong> 60 minutos</p>
              <p><strong>Formato:</strong> Google Meet (Online)</p>
            </div>
            
            <h3>🔗 Acesse sua sessão:</h3>
            <a href="${meetLink}" class="button">📹 Entrar no Google Meet</a>
            
            <h3>📋 O que você precisa fazer:</h3>
            <ol>
              <li><strong>15 minutos antes:</strong> Teste seu microfone e câmera</li>
              <li><strong>5 minutos antes:</strong> Clique no link do Google Meet</li>
              <li><strong>No horário:</strong> Aguarde o consultor entrar na sala</li>
            </ol>
            
            <h3>🎯 O que esperar da sessão:</h3>
            <ul>
              <li>Análise do seu negócio de energia solar</li>
              <li>Identificação das principais oportunidades</li>
              <li>Estratégia personalizada para crescimento</li>
              <li>Plano de ação concreto para os próximos 90 dias</li>
            </ul>
            
            <div class="highlight">
              <h3>⚠️ Importante:</h3>
              <p>Se precisar reagendar ou cancelar, entre em contato conosco pelo WhatsApp ou responda este email.</p>
            </div>
            
            <p>Estamos ansiosos para ajudá-lo a <strong>dobrar suas vendas em 90 dias</strong>! 🚀</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe Rarity Agency</strong></p>
          </div>
          
          <div class="footer">
            <p>Rarity Agency © 2025 | Especialistas em Marketing Digital para Energia Solar</p>
            <p>Esta sessão foi agendada através da página: ${sourcePage}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Enviar email
    const mailOptions = {
      from: '"Rarity Agency" <caiorarity@gmail.com>',
      to: to,
      subject: '🎯 Sessão Estratégica Confirmada - Rarity Agency',
      html: htmlContent
    }

    await transporter.sendMail(mailOptions)

    console.log('✅ Email de confirmação enviado para:', to)
    return true

  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error)
    throw error
  }
}

export async function sendTeamNotification(emailData: EmailData): Promise<boolean> {
  try {
    const { name, scheduledDateTime, meetLink, sourcePage } = emailData

    // Formatar data e hora
    const date = new Date(scheduledDateTime)
    const formattedDate = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })

    // Template do email para a equipe
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Lead Agendado - Rarity Agency</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8A2BE2, #DA70D6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Novo Lead Agendado!</h1>
            <p>Rarity Agency - Sistema de Captação</p>
          </div>
          
          <div class="content">
            <h2>Novo agendamento realizado:</h2>
            
            <div class="highlight">
              <h3>👤 Lead:</h3>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Data:</strong> ${formattedDate}</p>
              <p><strong>Horário:</strong> ${formattedTime}</p>
              <p><strong>Página de origem:</strong> ${sourcePage}</p>
            </div>
            
            <h3>🔗 Link da sessão:</h3>
            <p><a href="${meetLink}">${meetLink}</a></p>
            
            <p><strong>Lembrete:</strong> Esta sessão foi agendada automaticamente. Verifique sua agenda e prepare-se para a reunião!</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Enviar email para a equipe
    const mailOptions = {
      from: '"Rarity Agency" <caiorarity@gmail.com>',
      to: 'caiorarity@gmail.com',
      subject: '🎯 Novo Lead Agendado - Rarity Agency',
      html: htmlContent
    }

    await transporter.sendMail(mailOptions)

    console.log('✅ Notificação para equipe enviada')
    return true

  } catch (error) {
    console.error('❌ Erro ao enviar notificação para equipe:', error)
    throw error
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    // Testar conexão SMTP
    await transporter.verify()
    console.log('✅ Conexão de email testada com sucesso')
    return true

  } catch (error) {
    console.error('❌ Erro ao testar conexão de email:', error)
    throw error
  }
}

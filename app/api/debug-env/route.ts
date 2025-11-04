import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente essenciais
    const envCheck = {
      // Service Account
      GOOGLE_SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      
      // OAuth2
      GOOGLE_OAUTH_CLIENT_ID: !!process.env.GOOGLE_OAUTH_CLIENT_ID,
      GOOGLE_OAUTH_CLIENT_SECRET: !!process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      GOOGLE_OAUTH_REFRESH_TOKEN: !!process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      
      // Outras
      GOOGLE_SPREADSHEET_ID: !!process.env.GOOGLE_SPREADSHEET_ID,
      SMTP_PASS: !!process.env.SMTP_PASS,
      NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
      
      // Ambiente
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    }
    
    // Contar quantas variáveis estão configuradas
    const totalVars = Object.keys(envCheck).length - 3 // -3 para NODE_ENV, VERCEL, VERCEL_ENV
    const configuredVars = Object.values(envCheck).filter(Boolean).length - 3
    
    const status = configuredVars === totalVars ? 'success' : 'warning'
    const message = configuredVars === totalVars 
      ? 'Todas as variáveis de ambiente estão configuradas!' 
      : `${configuredVars}/${totalVars} variáveis configuradas`
    
    return NextResponse.json({
      status,
      message,
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      variables: envCheck,
      missingVariables: Object.entries(envCheck)
        .filter(([key, value]) => !value && !['NODE_ENV', 'VERCEL', 'VERCEL_ENV'].includes(key))
        .map(([key]) => key),
      instructions: configuredVars < totalVars ? [
        '1. Execute: node scripts/setup-vercel-env.js',
        '2. Configure as variáveis no Vercel usando os comandos gerados',
        '3. Faça redeploy: vercel --prod',
        '4. Teste novamente este endpoint'
      ] : [
        '✅ Todas as variáveis estão configuradas!',
        'As integrações devem funcionar corretamente em produção.'
      ]
    })
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico de ambiente:', error)
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Erro ao verificar variáveis de ambiente',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

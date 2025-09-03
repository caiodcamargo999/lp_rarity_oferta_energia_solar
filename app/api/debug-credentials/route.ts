import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    // Verificar se as variáveis existem
    const envCheck = {
      GOOGLE_OAUTH_CLIENT_ID: !!clientId,
      GOOGLE_OAUTH_CLIENT_SECRET: !!clientSecret,
      GOOGLE_OAUTH_REFRESH_TOKEN: !!refreshToken,
    };

    // Verificar formato do Client ID
    const clientIdFormat = clientId?.includes('.apps.googleusercontent.com');
    
    // Verificar formato do Client Secret
    const clientSecretFormat = clientSecret?.length === 24;
    
    // Verificar formato do Refresh Token
    const refreshTokenFormat = refreshToken?.startsWith('1//');

    return NextResponse.json({
      success: true,
      envCheck,
      formatCheck: {
        clientIdFormat,
        clientSecretFormat,
        refreshTokenFormat,
      },
      credentials: {
        clientId: clientId ? `${clientId.substring(0, 20)}...` : 'Não encontrado',
        clientSecret: clientSecret ? `${clientSecret.substring(0, 8)}...` : 'Não encontrado',
        refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Não encontrado',
      },
      recommendations: {
        clientId: clientIdFormat ? '✅ Formato correto' : '❌ Formato incorreto - deve terminar com .apps.googleusercontent.com',
        clientSecret: clientSecretFormat ? '✅ Formato correto' : '❌ Formato incorreto - deve ter 24 caracteres',
        refreshToken: refreshTokenFormat ? '✅ Formato correto' : '❌ Formato incorreto - deve começar com 1//',
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao verificar credenciais',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

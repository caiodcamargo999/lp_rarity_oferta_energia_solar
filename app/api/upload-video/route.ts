import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob, isBlobConfigured } from '../../../lib/vercel-blob';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar se o Vercel Blob está configurado
    if (!isBlobConfigured()) {
      return NextResponse.json(
        { error: 'Vercel Blob não está configurado. Configure as variáveis de ambiente.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verificar se o arquivo é um vídeo
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Arquivo deve ser um vídeo' },
        { status: 400 }
      );
    }

    // Verificar tamanho do arquivo (máximo 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo: 500MB' },
        { status: 400 }
      );
    }

    console.log('📁 Iniciando upload:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Upload para Vercel Blob
    const blob = await uploadToBlob(file, file.name);

    console.log('✅ Upload concluído:', blob.url);

    return NextResponse.json({
      url: blob.url,
      success: true,
      message: 'Vídeo enviado com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    
    // Tratamento específico de erros
    if (error instanceof Error) {
      if (error.message.includes('BLOB_ACCESS_DENIED')) {
        return NextResponse.json(
          { error: 'Acesso negado ao Vercel Blob. Verifique as configurações.' },
          { status: 403 }
        );
      }
      
      if (error.message.includes('BLOB_STORE_NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Store do Vercel Blob não encontrado. Configure primeiro.' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    );
  }
}

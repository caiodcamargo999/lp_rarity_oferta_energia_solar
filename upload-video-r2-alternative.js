// Script ALTERNATIVO para upload de vídeo para Cloudflare R2
// Usa endpoint alternativo para resolver problemas SSL
const fs = require('fs');
const path = require('path');

// ===== CONFIGURAÇÃO ALTERNATIVA DO CLOUDFLARE R2 =====
const R2_CONFIG = {
  // ===== ENDPOINT ALTERNATIVO (formato bucket.account.r2.cloudflarestorage.com) =====
  endpoint: 'https://vsl-solar-rarity-brasil.18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com',
  accessKeyId: '18d46aaf79c9700a7041bb9253f0efc4',
  secretAccessKey: '97ab4b36e10a7338ced2485465a01ddc81f2ab6d426925a09ab8e2ca272b228f',
  bucketName: 'vsl-solar-rarity-brasil',
  region: 'auto'
};

// Caminho do vídeo
const VIDEO_PATH = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'video-de-vendas.mp4');

console.log('🚀 Iniciando upload ALTERNATIVO para Cloudflare R2...');
console.log('📁 Caminho do vídeo:', VIDEO_PATH);
console.log('📍 Endpoint alternativo:', R2_CONFIG.endpoint);

// Verificar se o arquivo existe
if (!fs.existsSync(VIDEO_PATH)) {
  console.error('❌ Arquivo não encontrado!');
  console.log('💡 Verifique se o arquivo está em:', VIDEO_PATH);
  process.exit(1);
}

// Informações do arquivo
const stats = fs.statSync(VIDEO_PATH);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('📊 Tamanho do arquivo:', fileSizeInMB, 'MB');

async function uploadToR2Alternative() {
  try {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    
    console.log('🔧 Configurando cliente S3 alternativo...');
    
    const client = new S3Client({
      region: R2_CONFIG.region,
      endpoint: R2_CONFIG.endpoint,
      credentials: {
        accessKeyId: R2_CONFIG.accessKeyId,
        secretAccessKey: R2_CONFIG.secretAccessKey,
      },
      // ===== CONFIGURAÇÕES ALTERNATIVAS =====
      forcePathStyle: false, // IMPORTANTE: false para endpoint alternativo
      // ===== CONFIGURAÇÕES DE TIMEOUT =====
      requestHandler: {
        httpOptions: {
          timeout: 600000, // 10 minutos
          connectTimeout: 120000, // 2 minutos
        }
      }
    });

    const fileStream = fs.createReadStream(VIDEO_PATH);
    
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: 'video-de-vendas.mp4',
      Body: fileStream,
      ContentType: 'video/mp4',
      // ===== METADADOS PARA MELHOR PERFORMANCE =====
      Metadata: {
        'x-amz-meta-upload-date': new Date().toISOString(),
        'x-amz-meta-file-size': stats.size.toString(),
        'x-amz-meta-content-type': 'video/mp4'
      }
    });

    console.log('📤 Fazendo upload com configuração alternativa...');
    console.log('⏱️  Aguarde, arquivo grande sendo processado...');
    
    const result = await client.send(command);
    
    console.log('✅ Upload ALTERNATIVO concluído com sucesso!');
    console.log('🔗 URL pública:', `${R2_CONFIG.endpoint}/video-de-vendas.mp4`);
    console.log('📊 ETag:', result.ETag);
    
    // ===== VERIFICAR ACESSO =====
    console.log('\n🔍 Verificando acesso ao arquivo...');
    try {
      const testResponse = await fetch(`${R2_CONFIG.endpoint}/video-de-vendas.mp4`, {
        method: 'HEAD'
      });
      
      if (testResponse.ok) {
        console.log('✅ Arquivo acessível publicamente!');
        console.log('🎉 Upload concluído com sucesso!');
      } else {
        console.log('⚠️  Arquivo não acessível publicamente. Status:', testResponse.status);
        console.log('💡 Configure o bucket como público no dashboard do Cloudflare R2');
      }
    } catch (testError) {
      console.log('⚠️  Não foi possível verificar acesso público:', testError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no upload alternativo:', error.message);
    
    // ===== SOLUÇÕES ALTERNATIVAS =====
    console.log('\n🔧 SOLUÇÕES ALTERNATIVAS:');
    console.log('1. Use o script principal: node upload-video-r2.js');
    console.log('2. Verifique as credenciais no dashboard do Cloudflare R2');
    console.log('3. Confirme se o bucket está criado e configurado');
    console.log('4. Tente fazer upload manual via dashboard (se possível)');
    console.log('5. Use alternativa: Backblaze B2 ou Supabase Storage');
  }
}

// Executar upload alternativo
try {
  require('@aws-sdk/client-s3');
  console.log('✅ Dependências encontradas, iniciando upload alternativo...');
  uploadToR2Alternative();
} catch (error) {
  console.log('📦 Dependências não encontradas. Execute:');
  console.log('npm install @aws-sdk/client-s3 @aws-sdk/lib-storage');
}

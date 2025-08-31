// Script para upload de vídeo grande para Cloudflare R2 via S3 Compatibility API
const fs = require('fs');
const path = require('path');

// Configurações do Cloudflare R2 - ENDPOINT CORRIGIDO
const R2_CONFIG = {
  // ===== ENDPOINT CORRETO DO CLOUDFLARE R2 =====
  endpoint: 'https://18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com',
  accessKeyId: '18d46aaf79c9700a7041bb9253f0efc4',
  secretAccessKey: '97ab4b36e10a7338ced2485465a01ddc81f2ab6d426925a09ab8e2ca272b228f',
  bucketName: 'vsl-solar-rarity-brasil',
  region: 'auto'
};

// Caminho do vídeo (ajuste para o caminho correto)
const VIDEO_PATH = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'video-de-vendas.mp4');

console.log('🚀 Iniciando upload para Cloudflare R2...');
console.log('📁 Caminho do vídeo:', VIDEO_PATH);

// Verificar se o arquivo existe
if (!fs.existsSync(VIDEO_PATH)) {
  console.error('❌ Arquivo não encontrado!');
  console.log('💡 Verifique se o arquivo está em:', VIDEO_PATH);
  console.log('💡 Ou ajuste o caminho no script');
  process.exit(1);
}

// Informações do arquivo
const stats = fs.statSync(VIDEO_PATH);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('📊 Tamanho do arquivo:', fileSizeInMB, 'MB');

// Função de upload corrigida
async function uploadToR2() {
  try {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    
    console.log('🔧 Configurando cliente S3...');
    console.log('📍 Endpoint:', R2_CONFIG.endpoint);
    console.log('🪣 Bucket:', R2_CONFIG.bucketName);
    
    const client = new S3Client({
      region: R2_CONFIG.region,
      endpoint: R2_CONFIG.endpoint,
      credentials: {
        accessKeyId: R2_CONFIG.accessKeyId,
        secretAccessKey: R2_CONFIG.secretAccessKey,
      },
      // ===== CONFIGURAÇÕES CORRIGIDAS PARA R2 =====
      forcePathStyle: true,
      // ===== CONFIGURAÇÕES DE SSL =====
      requestHandler: {
        httpOptions: {
          timeout: 300000, // 5 minutos
          connectTimeout: 60000, // 1 minuto
        }
      }
    });

    const fileStream = fs.createReadStream(VIDEO_PATH);
    
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: 'video-de-vendas.mp4',
      Body: fileStream,
      ContentType: 'video/mp4',
      // ===== REMOVER ACL (NÃO SUPORTADO NO R2) =====
      // ACL: 'public-read' // REMOVIDO - causa erro no R2
    });

    console.log('📤 Fazendo upload...');
    console.log('⏱️  Aguarde, arquivo grande sendo processado...');
    
    const result = await client.send(command);
    
    console.log('✅ Upload concluído com sucesso!');
    console.log('🔗 URL pública:', `${R2_CONFIG.endpoint}/${R2_CONFIG.bucketName}/video-de-vendas.mp4`);
    console.log('📊 ETag:', result.ETag);
    
    // ===== VERIFICAR SE O ARQUIVO ESTÁ ACESSÍVEL =====
    console.log('\n🔍 Verificando acesso ao arquivo...');
    try {
      const testResponse = await fetch(`${R2_CONFIG.endpoint}/${R2_CONFIG.bucketName}/video-de-vendas.mp4`, {
        method: 'HEAD'
      });
      
      if (testResponse.ok) {
        console.log('✅ Arquivo acessível publicamente!');
      } else {
        console.log('⚠️  Arquivo não acessível publicamente. Status:', testResponse.status);
        console.log('💡 Configure o bucket como público no dashboard do Cloudflare R2');
      }
    } catch (testError) {
      console.log('⚠️  Não foi possível verificar acesso público:', testError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no upload:', error.message);
    
    // ===== DIAGNÓSTICO DE ERROS COMUNS =====
    if (error.message.includes('SSL') || error.message.includes('handshake')) {
      console.log('\n🔧 SOLUÇÃO PARA ERRO SSL:');
      console.log('1. Verifique se o endpoint está correto');
      console.log('2. Confirme se as credenciais estão válidas');
      console.log('3. Tente usar o endpoint alternativo:');
      console.log('   https://vsl-solar-rarity-brasil.18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com');
    } else if (error.message.includes('AccessDenied')) {
      console.log('\n🔧 SOLUÇÃO PARA ACESSO NEGADO:');
      console.log('1. Verifique se as credenciais estão corretas');
      console.log('2. Confirme se o bucket existe');
      console.log('3. Verifique permissões da API key');
    } else if (error.message.includes('NoSuchBucket')) {
      console.log('\n🔧 SOLUÇÃO PARA BUCKET NÃO ENCONTRADO:');
      console.log('1. Verifique se o nome do bucket está correto');
      console.log('2. Confirme se o bucket foi criado no Cloudflare R2');
    }
  }
}

// Verificar se as dependências estão instaladas
try {
  require('@aws-sdk/client-s3');
  console.log('✅ Dependências encontradas, iniciando upload...');
  uploadToR2();
} catch (error) {
  console.log('📦 Dependências não encontradas. Instale primeiro:');
  console.log('npm install @aws-sdk/client-s3 @aws-sdk/lib-storage');
}

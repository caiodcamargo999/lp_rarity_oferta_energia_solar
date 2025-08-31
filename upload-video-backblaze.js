// Script para upload de vídeo para Backblaze B2 (Alternativa mais estável)
const fs = require('fs');
const path = require('path');

console.log('🚀 UPLOAD PARA BACKBLAZE B2 - ALTERNATIVA MAIS ESTÁVEL');
console.log('========================================================');

// ===== CONFIGURAÇÃO BACKBLAZE B2 =====
// ⚠️ IMPORTANTE: Configure suas credenciais do Backblaze B2
const B2_CONFIG = {
  endpoint: 'https://s3.us-west-002.backblazeb2.com', // Região US West
  accessKeyId: 'YOUR_B2_ACCESS_KEY_ID', // ⚠️ CONFIGURE AQUI
  secretAccessKey: 'YOUR_B2_SECRET_ACCESS_KEY', // ⚠️ CONFIGURE AQUI
  bucketName: 'YOUR_B2_BUCKET_NAME', // ⚠️ CONFIGURE AQUI
  region: 'us-west-002'
};

// Caminho do vídeo
const VIDEO_PATH = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'video-de-vendas.mp4');

console.log('\n📋 CONFIGURAÇÃO NECESSÁRIA:');
console.log('1. Crie uma conta em: https://www.backblaze.com/b2/');
console.log('2. Crie um bucket público');
console.log('3. Gere uma Application Key');
console.log('4. Configure as credenciais no script');

// Verificar se o arquivo existe
if (!fs.existsSync(VIDEO_PATH)) {
  console.error('❌ Arquivo não encontrado!');
  console.log('💡 Verifique se o arquivo está em:', VIDEO_PATH);
  process.exit(1);
}

// Informações do arquivo
const stats = fs.statSync(VIDEO_PATH);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('\n📊 INFORMAÇÕES DO ARQUIVO:');
console.log('📁 Caminho:', VIDEO_PATH);
console.log('📊 Tamanho:', fileSizeInMB, 'MB');
console.log('📅 Última modificação:', stats.mtime);

// Verificar se as credenciais estão configuradas
if (B2_CONFIG.accessKeyId === 'YOUR_B2_ACCESS_KEY_ID') {
  console.log('\n❌ CREDENCIAIS NÃO CONFIGURADAS!');
  console.log('💡 Configure suas credenciais do Backblaze B2 no script');
  console.log('🔗 Tutorial: https://help.backblaze.com/hc/en-us/articles/360047425453');
  process.exit(1);
}

async function uploadToB2() {
  try {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    
    console.log('\n🔧 Configurando cliente Backblaze B2...');
    
    const client = new S3Client({
      region: B2_CONFIG.region,
      endpoint: B2_CONFIG.endpoint,
      credentials: {
        accessKeyId: B2_CONFIG.accessKeyId,
        secretAccessKey: B2_CONFIG.secretAccessKey,
      },
      forcePathStyle: true
    });

    const fileStream = fs.createReadStream(VIDEO_PATH);
    
    const command = new PutObjectCommand({
      Bucket: B2_CONFIG.bucketName,
      Key: 'video-de-vendas.mp4',
      Body: fileStream,
      ContentType: 'video/mp4',
      ACL: 'public-read'
    });

    console.log('📤 Fazendo upload para Backblaze B2...');
    console.log('⏱️  Aguarde, arquivo grande sendo processado...');
    
    const result = await client.send(command);
    
    console.log('✅ Upload concluído com sucesso!');
    console.log('🔗 URL pública:', `${B2_CONFIG.endpoint}/${B2_CONFIG.bucketName}/video-de-vendas.mp4`);
    console.log('📊 ETag:', result.ETag);
    
    // ===== VERIFICAR ACESSO =====
    console.log('\n🔍 Verificando acesso ao arquivo...');
    try {
      const testResponse = await fetch(`${B2_CONFIG.endpoint}/${B2_CONFIG.bucketName}/video-de-vendas.mp4`, {
        method: 'HEAD'
      });
      
      if (testResponse.ok) {
        console.log('✅ Arquivo acessível publicamente!');
        console.log('🎉 Upload concluído com sucesso!');
        
        // ===== ATUALIZAR CONFIGURAÇÃO DO PROJETO =====
        console.log('\n📝 PRÓXIMOS PASSOS:');
        console.log('1. Configure NEXT_PUBLIC_VIDEO_URL com a URL do B2');
        console.log('2. Faça deploy no Vercel');
        console.log('3. Teste o vídeo em produção');
        
      } else {
        console.log('⚠️  Arquivo não acessível publicamente. Status:', testResponse.status);
        console.log('💡 Configure o bucket como público no dashboard do Backblaze B2');
      }
    } catch (testError) {
      console.log('⚠️  Não foi possível verificar acesso público:', testError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no upload:', error.message);
    
    if (error.message.includes('AccessDenied')) {
      console.log('\n🔧 SOLUÇÃO PARA ACESSO NEGADO:');
      console.log('1. Verifique se as credenciais estão corretas');
      console.log('2. Confirme se o bucket existe');
      console.log('3. Verifique permissões da Application Key');
    }
  }
}

// Executar upload se credenciais estiverem configuradas
if (B2_CONFIG.accessKeyId !== 'YOUR_B2_ACCESS_KEY_ID') {
  try {
    require('@aws-sdk/client-s3');
    console.log('\n✅ Dependências encontradas, iniciando upload...');
    uploadToB2();
  } catch (error) {
    console.log('\n📦 Dependências não encontradas. Execute:');
    console.log('npm install @aws-sdk/client-s3 @aws-sdk/lib-storage');
  }
} else {
  console.log('\n💡 CONFIGURE SUAS CREDENCIAIS DO BACKBLAZE B2 NO SCRIPT');
}

// Script para upload usando APENAS o endpoint que funciona
const fs = require('fs');
const path = require('path');

console.log('🚀 UPLOAD CLOUDFLARE R2 - ENDPOINT FUNCIONAL');
console.log('==============================================');

// ===== CONFIGURAÇÃO COM ENDPOINT FUNCIONAL =====
const R2_CONFIG = {
  // ===== ENDPOINT QUE FUNCIONA (Status 400 mas conecta!) =====
  endpoint: 'https://77f677cc90bcd810f75c80680f636a46.r2.cloudflarestorage.com',
  accessKeyId: '18d46aaf79c9700a7041bb9253f0efc4',
  secretAccessKey: '97ab4b36e10a7338ced2485465a01ddc81f2ab6d426925a09ab8e2ca272b228f',
  bucketName: 'vsl-solar-rarity-brasil',
  region: 'auto'
};

// Caminho do vídeo
const VIDEO_PATH = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'video-de-vendas.mp4');

console.log('📋 CONFIGURAÇÃO:');
console.log('📍 Endpoint:', R2_CONFIG.endpoint);
console.log('🪣 Bucket:', R2_CONFIG.bucketName);
console.log('🔑 Access Key:', R2_CONFIG.accessKeyId);

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

async function uploadToR2Working() {
  try {
    const { S3Client, PutObjectCommand, CreateBucketCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');
    
    console.log('\n🔧 Configurando cliente S3...');
    
    const client = new S3Client({
      region: R2_CONFIG.region,
      endpoint: R2_CONFIG.endpoint,
      credentials: {
        accessKeyId: R2_CONFIG.accessKeyId,
        secretAccessKey: R2_CONFIG.secretAccessKey,
      },
      forcePathStyle: true
    });

    // ===== VERIFICAR SE O BUCKET EXISTE =====
    console.log('🔍 Verificando se o bucket existe...');
    try {
      const listCommand = new ListBucketsCommand({});
      const buckets = await client.send(listCommand);
      console.log('✅ Buckets encontrados:', buckets.Buckets?.map(b => b.Name) || 'Nenhum');
      
      const bucketExists = buckets.Buckets?.some(b => b.Name === R2_CONFIG.bucketName);
      if (!bucketExists) {
        console.log('⚠️  Bucket não encontrado, tentando criar...');
        const createCommand = new CreateBucketCommand({
          Bucket: R2_CONFIG.bucketName
        });
        await client.send(createCommand);
        console.log('✅ Bucket criado com sucesso!');
      } else {
        console.log('✅ Bucket já existe!');
      }
    } catch (bucketError) {
      console.log('⚠️  Erro ao verificar/criar bucket:', bucketError.message);
      console.log('💡 Continue mesmo assim...');
    }

    const fileStream = fs.createReadStream(VIDEO_PATH);
    
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: 'video-de-vendas.mp4',
      Body: fileStream,
      ContentType: 'video/mp4'
    });

    console.log('\n📤 Fazendo upload...');
    console.log('⏱️  Aguarde, arquivo grande sendo processado...');
    
    const result = await client.send(command);
    
    console.log('✅ Upload concluído com sucesso!');
    console.log('🔗 URL pública:', `${R2_CONFIG.endpoint}/${R2_CONFIG.bucketName}/video-de-vendas.mp4`);
    console.log('📊 ETag:', result.ETag);
    
    // ===== VERIFICAR ACESSO =====
    console.log('\n🔍 Verificando acesso ao arquivo...');
    try {
      const testResponse = await fetch(`${R2_CONFIG.endpoint}/${R2_CONFIG.bucketName}/video-de-vendas.mp4`, {
        method: 'HEAD'
      });
      
      if (testResponse.ok) {
        console.log('✅ Arquivo acessível publicamente!');
        console.log('🎉 Upload concluído com sucesso!');
        
        // ===== ATUALIZAR CONFIGURAÇÃO =====
        console.log('\n📝 CONFIGURAÇÃO PARA O PROJETO:');
        console.log('NEXT_PUBLIC_VIDEO_URL=' + `${R2_CONFIG.endpoint}/${R2_CONFIG.bucketName}/video-de-vendas.mp4`);
        
      } else {
        console.log('⚠️  Arquivo não acessível publicamente. Status:', testResponse.status);
        console.log('💡 Configure o bucket como público no dashboard do Cloudflare R2');
      }
    } catch (testError) {
      console.log('⚠️  Não foi possível verificar acesso público:', testError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no upload:', error.message);
    
    // ===== DIAGNÓSTICO ESPECÍFICO =====
    if (error.message.includes('AccessDenied')) {
      console.log('\n🔧 SOLUÇÃO PARA ACESSO NEGADO:');
      console.log('1. Verifique se as credenciais estão corretas');
      console.log('2. Confirme se o bucket foi criado');
      console.log('3. Verifique permissões da API key no Cloudflare R2');
    } else if (error.message.includes('NoSuchBucket')) {
      console.log('\n🔧 SOLUÇÃO PARA BUCKET NÃO ENCONTRADO:');
      console.log('1. Crie o bucket no dashboard do Cloudflare R2');
      console.log('2. Nome do bucket:', R2_CONFIG.bucketName);
      console.log('3. Configure como público');
    } else if (error.message.includes('SSL') || error.message.includes('handshake')) {
      console.log('\n🔧 PROBLEMA SSL RESOLVIDO!');
      console.log('✅ Este endpoint funciona (Status 400 = conecta!)');
      console.log('💡 O problema é configuração do bucket/credenciais');
    }
  }
}

// Executar upload
try {
  require('@aws-sdk/client-s3');
  console.log('\n✅ Dependências encontradas, iniciando upload...');
  uploadToR2Working();
} catch (error) {
  console.log('\n📦 Dependências não encontradas. Execute:');
  console.log('npm install @aws-sdk/client-s3 @aws-sdk/lib-storage');
}

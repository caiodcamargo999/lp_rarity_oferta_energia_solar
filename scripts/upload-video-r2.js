#!/usr/bin/env node

/**
 * Script para upload de vídeos para Cloudflare R2
 * Uso: node scripts/upload-video-r2.js <arquivo-video> <tipo-video>
 * 
 * Exemplos:
 * node scripts/upload-video-r2.js video-google-ads.mp4 googleads
 * node scripts/upload-video-r2.js video-landing-pages.mp4 landingpages
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Configurações do Cloudflare R2
const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID || 'sua-account-id',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || 'sua-access-key',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'sua-secret-key',
  bucketName: process.env.R2_BUCKET_NAME || 'rarity-videos',
  region: 'auto'
};

// Mapeamento de tipos de vídeo
const VIDEO_TYPES = {
  googleads: 'video-google-ads.mp4',
  landingpages: 'video-landing-pages.mp4',
  default: 'video-de-vendas.mp4'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function createSignature(method, uri, headers, body = '') {
  const stringToSign = `${method}\n\n${headers['content-type'] || ''}\n${headers['x-amz-date'] || ''}\n${headers['x-amz-content-sha256'] || ''}\n${uri}`;
  
  const signature = crypto
    .createHmac('sha256', R2_CONFIG.secretAccessKey)
    .update(stringToSign)
    .digest('hex');
    
  return signature;
}

function createHeaders(method, uri, body, contentType = 'video/mp4') {
  const now = new Date();
  const date = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
  
  const headers = {
    'Host': `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    'X-Amz-Date': date,
    'X-Amz-Content-Sha256': crypto.createHash('sha256').update(body).digest('hex'),
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body)
  };
  
  const signature = createSignature(method, uri, headers, body);
  headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${R2_CONFIG.accessKeyId}/${date.split('T')[0]}/auto/s3/aws4_request, SignedHeaders=${Object.keys(headers).sort().join(';')}, Signature=${signature}`;
  
  return headers;
}

function uploadVideo(filePath, videoType) {
  return new Promise((resolve, reject) => {
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Arquivo não encontrado: ${filePath}`));
      return;
    }
    
    // Verificar se o tipo de vídeo é válido
    if (!VIDEO_TYPES[videoType]) {
      reject(new Error(`Tipo de vídeo inválido: ${videoType}. Tipos válidos: ${Object.keys(VIDEO_TYPES).join(', ')}`));
      return;
    }
    
    const fileName = VIDEO_TYPES[videoType];
    const fileContent = fs.readFileSync(filePath);
    const fileSize = fileContent.length;
    
    log(`Iniciando upload de ${filePath} (${(fileSize / 1024 / 1024).toFixed(2)} MB) para ${fileName}`);
    
    const uri = `/${R2_CONFIG.bucketName}/${fileName}`;
    const headers = createHeaders('PUT', uri, fileContent);
    
    const options = {
      hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
      port: 443,
      path: uri,
      method: 'PUT',
      headers: headers
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          log(`Upload concluído com sucesso!`, 'success');
          log(`URL do vídeo: https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileName}`);
          resolve({
            success: true,
            url: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileName}`,
            fileName: fileName,
            size: fileSize
          });
        } else {
          log(`Erro no upload: ${res.statusCode} - ${data}`, 'error');
          reject(new Error(`Upload falhou: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      log(`Erro na requisição: ${error.message}`, 'error');
      reject(error);
    });
    
    req.write(fileContent);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Uso: node scripts/upload-video-r2.js <arquivo-video> <tipo-video>

Tipos de vídeo disponíveis:
  - googleads: Para a página /3 (Google Ads)
  - landingpages: Para futuras páginas de Landing Pages
  - default: Para a página principal

Exemplos:
  node scripts/upload-video-r2.js video-google-ads.mp4 googleads
  node scripts/upload-video-r2.js video-landing-pages.mp4 landingpages

Variáveis de ambiente necessárias:
  - R2_ACCOUNT_ID
  - R2_ACCESS_KEY_ID
  - R2_SECRET_ACCESS_KEY
  - R2_BUCKET_NAME (opcional, padrão: rarity-videos)
    `);
    process.exit(1);
  }
  
  const [filePath, videoType] = args;
  
  try {
    // Verificar variáveis de ambiente
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('Variáveis de ambiente R2 não configuradas. Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID e R2_SECRET_ACCESS_KEY');
    }
    
    const result = await uploadVideo(filePath, videoType);
    
    console.log('\n🎉 Upload concluído com sucesso!');
    console.log(`📁 Arquivo: ${result.fileName}`);
    console.log(`📏 Tamanho: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🔗 URL: ${result.url}`);
    console.log('\n📝 Próximos passos:');
    console.log(`1. Configure a variável de ambiente NEXT_PUBLIC_VIDEO_URL_${videoType.toUpperCase()}=${result.url}`);
    console.log('2. Faça deploy da aplicação');
    console.log('3. Teste a página correspondente');
    
  } catch (error) {
    log(`Erro: ${error.message}`, 'error');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { uploadVideo, VIDEO_TYPES };

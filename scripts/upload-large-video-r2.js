#!/usr/bin/env node

/**
 * Script otimizado para upload de vídeos grandes (1.7GB+) para Cloudflare R2
 * Usa multipart upload para arquivos grandes
 * 
 * Uso: node scripts/upload-large-video-r2.js <arquivo-video> <tipo-video>
 * 
 * Exemplos:
 * node scripts/upload-large-video-r2.js video-google-ads.mp4 googleads
 * node scripts/upload-large-video-r2.js video-landing-pages.mp4 landingpages
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
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID || 'sua-account-id'}.r2.cloudflarestorage.com`
};

// Mapeamento de tipos de vídeo
const VIDEO_TYPES = {
  googleads: 'video-google-ads.mp4',
  landingpages: 'video-landing-pages.mp4',
  default: 'video-de-vendas.mp4'
};

// Configurações de multipart upload
const MULTIPART_CONFIG = {
  chunkSize: 50 * 1024 * 1024, // 50MB por chunk
  maxRetries: 3,
  retryDelay: 2000 // 2 segundos
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function createSignature(method, uri, headers, body = '', queryString = '') {
  const canonicalRequest = [
    method,
    uri,
    queryString,
    Object.keys(headers).sort().map(key => `${key.toLowerCase()}:${headers[key]}`).join('\n'),
    '',
    Object.keys(headers).sort().map(key => key.toLowerCase()).join(';'),
    crypto.createHash('sha256').update(body).digest('hex')
  ].join('\n');
  
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    headers['x-amz-date'],
    `${headers['x-amz-date'].split('T')[0]}/auto/s3/aws4_request`,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');
  
  const signature = crypto
    .createHmac('sha256', R2_CONFIG.secretAccessKey)
    .update(stringToSign)
    .digest('hex');
    
  return signature;
}

function createHeaders(method, uri, body, contentType = 'video/mp4', additionalHeaders = {}) {
  const now = new Date();
  const date = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
  
  const headers = {
    'Host': `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    'X-Amz-Date': date,
    'X-Amz-Content-Sha256': crypto.createHash('sha256').update(body).digest('hex'),
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    ...additionalHeaders
  };
  
  const signature = createSignature(method, uri, headers, body);
  headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${R2_CONFIG.accessKeyId}/${date.split('T')[0]}/auto/s3/aws4_request, SignedHeaders=${Object.keys(headers).sort().join(';')}, Signature=${signature}`;
  
  return headers;
}

function makeRequest(options, body = '') {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function initiateMultipartUpload(fileName) {
  log(`Iniciando multipart upload para ${fileName}`);
  
  const uri = `/${R2_CONFIG.bucketName}/${fileName}?uploads`;
  const headers = createHeaders('POST', uri, '', 'video/mp4');
  
  const options = {
    hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    port: 443,
    path: uri,
    method: 'POST',
    headers: headers
  };
  
  const response = await makeRequest(options);
  
  if (response.statusCode !== 200) {
    throw new Error(`Falha ao iniciar multipart upload: ${response.statusCode} - ${response.body}`);
  }
  
  // Extrair uploadId do XML de resposta
  const uploadIdMatch = response.body.match(/<UploadId>([^<]+)<\/UploadId>/);
  if (!uploadIdMatch) {
    throw new Error('Não foi possível extrair UploadId da resposta');
  }
  
  const uploadId = uploadIdMatch[1];
  log(`Multipart upload iniciado. UploadId: ${uploadId}`);
  
  return uploadId;
}

async function uploadPart(fileName, uploadId, partNumber, chunk) {
  log(`Uploadando parte ${partNumber} (${chunk.length} bytes)`);
  
  const uri = `/${R2_CONFIG.bucketName}/${fileName}?partNumber=${partNumber}&uploadId=${uploadId}`;
  const headers = createHeaders('PUT', uri, chunk, 'video/mp4');
  
  const options = {
    hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    port: 443,
    path: uri,
    method: 'PUT',
    headers: headers
  };
  
  const response = await makeRequest(options, chunk);
  
  if (response.statusCode !== 200) {
    throw new Error(`Falha ao fazer upload da parte ${partNumber}: ${response.statusCode} - ${response.body}`);
  }
  
  const etag = response.headers.etag;
  log(`Parte ${partNumber} enviada com sucesso. ETag: ${etag}`);
  
  return { partNumber, etag };
}

async function completeMultipartUpload(fileName, uploadId, parts) {
  log(`Completando multipart upload para ${fileName}`);
  
  const partsXml = parts.map(part => 
    `<Part><PartNumber>${part.partNumber}</PartNumber><ETag>${part.etag}</ETag></Part>`
  ).join('');
  
  const body = `<CompleteMultipartUpload>${partsXml}</CompleteMultipartUpload>`;
  
  const uri = `/${R2_CONFIG.bucketName}/${fileName}?uploadId=${uploadId}`;
  const headers = createHeaders('POST', uri, body, 'application/xml');
  
  const options = {
    hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    port: 443,
    path: uri,
    method: 'POST',
    headers: headers
  };
  
  const response = await makeRequest(options, body);
  
  if (response.statusCode !== 200) {
    throw new Error(`Falha ao completar multipart upload: ${response.statusCode} - ${response.body}`);
  }
  
  log(`Multipart upload completado com sucesso!`);
  return response;
}

async function uploadLargeVideo(filePath, videoType) {
  // Verificar se o arquivo existe
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }
  
  // Verificar se o tipo de vídeo é válido
  if (!VIDEO_TYPES[videoType]) {
    throw new Error(`Tipo de vídeo inválido: ${videoType}. Tipos válidos: ${Object.keys(VIDEO_TYPES).join(', ')}`);
  }
  
  const fileName = VIDEO_TYPES[videoType];
  const fileStats = fs.statSync(filePath);
  const fileSize = fileStats.size;
  
  log(`Iniciando upload de ${filePath} (${(fileSize / 1024 / 1024).toFixed(2)} MB) para ${fileName}`);
  
  // Verificar se o arquivo é grande o suficiente para multipart
  if (fileSize < MULTIPART_CONFIG.chunkSize) {
    log(`Arquivo pequeno (${(fileSize / 1024 / 1024).toFixed(2)} MB), usando upload simples`);
    return await uploadSimpleVideo(filePath, fileName);
  }
  
  // Usar multipart upload para arquivos grandes
  const uploadId = await initiateMultipartUpload(fileName);
  const parts = [];
  const fileStream = fs.createReadStream(filePath);
  
  let partNumber = 1;
  let chunk = Buffer.alloc(0);
  
  return new Promise((resolve, reject) => {
    fileStream.on('data', async (data) => {
      chunk = Buffer.concat([chunk, data]);
      
      while (chunk.length >= MULTIPART_CONFIG.chunkSize) {
        const chunkToUpload = chunk.slice(0, MULTIPART_CONFIG.chunkSize);
        chunk = chunk.slice(MULTIPART_CONFIG.chunkSize);
        
        try {
          const part = await uploadPart(fileName, uploadId, partNumber, chunkToUpload);
          parts.push(part);
          partNumber++;
        } catch (error) {
          reject(error);
          return;
        }
      }
    });
    
    fileStream.on('end', async () => {
      // Upload da última parte se houver dados restantes
      if (chunk.length > 0) {
        try {
          const part = await uploadPart(fileName, uploadId, partNumber, chunk);
          parts.push(part);
        } catch (error) {
          reject(error);
          return;
        }
      }
      
      // Completar multipart upload
      try {
        await completeMultipartUpload(fileName, uploadId, parts);
        
        const result = {
          success: true,
          url: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileName}`,
          fileName: fileName,
          size: fileSize,
          parts: parts.length
        };
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

async function uploadSimpleVideo(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);
  const fileSize = fileContent.length;
  
  const uri = `/${R2_CONFIG.bucketName}/${fileName}`;
  const headers = createHeaders('PUT', uri, fileContent);
  
  const options = {
    hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    port: 443,
    path: uri,
    method: 'PUT',
    headers: headers
  };
  
  const response = await makeRequest(options, fileContent);
  
  if (response.statusCode !== 200) {
    throw new Error(`Upload simples falhou: ${response.statusCode} - ${response.body}`);
  }
  
  return {
    success: true,
    url: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileName}`,
    fileName: fileName,
    size: fileSize
  };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Uso: node scripts/upload-large-video-r2.js <arquivo-video> <tipo-video>

Tipos de vídeo disponíveis:
  - googleads: Para a página /3 (Google Ads)
  - landingpages: Para futuras páginas de Landing Pages
  - default: Para a página principal

Exemplos:
  node scripts/upload-large-video-r2.js video-google-ads.mp4 googleads
  node scripts/upload-large-video-r2.js video-landing-pages.mp4 landingpages

Variáveis de ambiente necessárias:
  - R2_ACCOUNT_ID
  - R2_ACCESS_KEY_ID
  - R2_SECRET_ACCESS_KEY
  - R2_BUCKET_NAME (opcional, padrão: rarity-videos)

Características:
  - Suporte a vídeos grandes (1.7GB+)
  - Multipart upload automático
  - Retry automático em caso de erro
  - Progresso detalhado
    `);
    process.exit(1);
  }
  
  const [filePath, videoType] = args;
  
  try {
    // Verificar variáveis de ambiente
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('Variáveis de ambiente R2 não configuradas. Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID e R2_SECRET_ACCESS_KEY');
    }
    
    const result = await uploadLargeVideo(filePath, videoType);
    
    console.log('\n🎉 Upload concluído com sucesso!');
    console.log(`📁 Arquivo: ${result.fileName}`);
    console.log(`📏 Tamanho: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🔗 URL: ${result.url}`);
    if (result.parts) {
      console.log(`🧩 Partes: ${result.parts}`);
    }
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

module.exports = { uploadLargeVideo, VIDEO_TYPES };

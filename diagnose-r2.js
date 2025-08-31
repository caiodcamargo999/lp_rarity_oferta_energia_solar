// Script de diagnóstico para Cloudflare R2
const fs = require('fs');
const path = require('path'); // Added missing import for path

console.log('🔍 DIAGNÓSTICO DO CLOUDFLARE R2');
console.log('================================');

// ===== VERIFICAR CREDENCIAIS =====
console.log('\n📋 CREDENCIAIS CONFIGURADAS:');
console.log('Access Key ID:', '18d46aaf79c9700a7041bb9253f0efc4');
console.log('Secret Access Key:', '97ab4b36e10a7338ced2485465a01ddc81f2ab6d426925a09ab8e2ca272b228f');
console.log('Bucket Name:', 'vsl-solar-rarity-brasil');

// ===== TESTAR ENDPOINTS =====
console.log('\n🌐 TESTANDO ENDPOINTS:');

const endpoints = [
  'https://18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com',
  'https://vsl-solar-rarity-brasil.18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com',
  'https://77f677cc90bcd810f75c80680f636a46.r2.cloudflarestorage.com'
];

async function testEndpoints() {
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testando: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000)
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Headers:`, Object.fromEntries(response.headers.entries()));
      
    } catch (error) {
      console.log(`❌ Erro: ${error.message}`);
    }
  }
}

// ===== VERIFICAR ARQUIVO LOCAL =====
console.log('\n📁 VERIFICAÇÃO DO ARQUIVO LOCAL:');
const videoPath = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'video-de-vendas.mp4');

if (fs.existsSync(videoPath)) {
  const stats = fs.statSync(videoPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Arquivo encontrado: ${videoPath}`);
  console.log(`📊 Tamanho: ${sizeMB} MB`);
  console.log(`📅 Última modificação: ${stats.mtime}`);
} else {
  console.log(`❌ Arquivo não encontrado: ${videoPath}`);
}

// ===== SOLUÇÕES RECOMENDADAS =====
console.log('\n🔧 SOLUÇÕES RECOMENDADAS:');
console.log('1. Verifique se o bucket foi criado no dashboard do Cloudflare R2');
console.log('2. Confirme se as credenciais estão corretas');
console.log('3. Verifique se o bucket está marcado como público');
console.log('4. Tente criar um novo bucket com nome diferente');
console.log('5. Use alternativa: Backblaze B2 (mais estável)');

// ===== ALTERNATIVA BACKBLAZE B2 =====
console.log('\n🚀 ALTERNATIVA RECOMENDADA: BACKBLAZE B2');
console.log('✅ Mais estável que Cloudflare R2');
console.log('✅ Suporte nativo a S3 API');
console.log('✅ Preços competitivos');
console.log('✅ Sem problemas SSL');

// Executar testes
testEndpoints().catch(console.error);

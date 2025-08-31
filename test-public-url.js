// Script para testar a URL pública do Cloudflare R2
console.log('🔍 TESTANDO URL PÚBLICA DO CLOUDFLARE R2');
console.log('==========================================');

// ===== URL PÚBLICA FORNECIDA =====
const PUBLIC_URL = 'https://pub-bf5dcdc4b650417585257574deb892a7.r2.dev';

console.log('📋 URL PÚBLICA:', PUBLIC_URL);
console.log('🪣 Bucket: vsl-solar-rarity-brasil');
console.log('📹 Arquivo: video-de-vendas.mp4');

// ===== TESTAR ACESSO PÚBLICO =====
async function testPublicAccess() {
  try {
    console.log('\n🔍 Testando acesso público...');
    
    // Teste 1: Verificar se o bucket está acessível
    console.log('📋 Teste 1: Verificando bucket...');
    const bucketResponse = await fetch(PUBLIC_URL, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    });
    
    console.log('✅ Status do bucket:', bucketResponse.status);
    console.log('📊 Headers:', Object.fromEntries(bucketResponse.headers.entries()));
    
    // Teste 2: Verificar se o vídeo está acessível
    console.log('\n📹 Teste 2: Verificando vídeo...');
    const videoUrl = `${PUBLIC_URL}/video-de-vendas.mp4`;
    console.log('🔗 URL do vídeo:', videoUrl);
    
    const videoResponse = await fetch(videoUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    });
    
    console.log('✅ Status do vídeo:', videoResponse.status);
    
    if (videoResponse.ok) {
      console.log('🎉 VÍDEO ACESSÍVEL PUBLICAMENTE!');
      console.log('📊 Tamanho:', videoResponse.headers.get('content-length'), 'bytes');
      console.log('📅 Última modificação:', videoResponse.headers.get('last-modified'));
      
      // ===== CONFIGURAÇÃO PARA O PROJETO =====
      console.log('\n📝 CONFIGURAÇÃO PARA O PROJETO:');
      console.log('NEXT_PUBLIC_VIDEO_URL=' + videoUrl);
      
      // ===== TESTAR REPRODUÇÃO =====
      console.log('\n🎬 Teste 3: Verificando se o vídeo pode ser reproduzido...');
      try {
        const playResponse = await fetch(videoUrl, {
          method: 'GET',
          headers: {
            'Range': 'bytes=0-1023' // Primeiros 1KB para teste
          },
          signal: AbortSignal.timeout(15000)
        });
        
        if (playResponse.ok || playResponse.status === 206) {
          console.log('✅ Vídeo pode ser reproduzido!');
          console.log('🎉 TUDO FUNCIONANDO PERFEITAMENTE!');
        } else {
          console.log('⚠️  Vídeo não pode ser reproduzido. Status:', playResponse.status);
        }
      } catch (playError) {
        console.log('⚠️  Erro ao testar reprodução:', playError.message);
      }
      
    } else {
      console.log('❌ Vídeo não acessível. Status:', videoResponse.status);
      console.log('💡 Verifique se o arquivo foi uploadado corretamente');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar acesso:', error.message);
    
    if (error.message.includes('fetch failed')) {
      console.log('\n🔧 SOLUÇÃO:');
      console.log('1. Verifique sua conexão com a internet');
      console.log('2. Confirme se a URL está correta');
      console.log('3. Tente acessar a URL diretamente no navegador');
    }
  }
}

// ===== INSTRUÇÕES =====
console.log('\n📋 INSTRUÇÕES:');
console.log('1. Execute este script para testar a URL pública');
console.log('2. Se funcionar, use a URL no seu projeto');
console.log('3. Se não funcionar, verifique as configurações do bucket');

// Executar teste
console.log('\n🚀 Iniciando testes...');
testPublicAccess();

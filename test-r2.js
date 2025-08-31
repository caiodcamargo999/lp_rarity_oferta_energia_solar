// Teste das credenciais do Cloudflare R2
const videoUrl = 'https://77f677cc90bcd810f75c80680f636a46.r2.cloudflarestorage.com/vsl-solar-rarity-brasil/video-de-vendas.mp4';

console.log('🔍 Testando acesso ao Cloudflare R2...');
console.log('📹 URL do vídeo:', videoUrl);

// Teste de acesso ao vídeo
fetch(videoUrl, {
  method: 'HEAD',
  headers: {
    'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
  }
})
.then(response => {
  console.log('✅ Status:', response.status);
  console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
})
.catch(error => {
  console.error('❌ Erro:', error.message);
});

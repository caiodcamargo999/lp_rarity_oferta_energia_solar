# Script de Deploy para Rarity Agency Landing Page
# Execute este script para fazer deploy na Vercel

Write-Host "🚀 Iniciando deploy da Rarity Agency Landing Page..." -ForegroundColor Green

# Verificar se o Vercel CLI está instalado
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI não encontrado!" -ForegroundColor Red
    Write-Host "📥 Instale com: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Verificar se está logado
try {
    $user = vercel whoami
    Write-Host "✅ Logado como: $user" -ForegroundColor Green
} catch {
    Write-Host "❌ Não está logado no Vercel!" -ForegroundColor Red
    Write-Host "🔐 Execute: vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "💡 Lembre-se de configurar o Cloudflare R2 para o vídeo!" -ForegroundColor Cyan
Write-Host "📋 Configure NEXT_PUBLIC_VIDEO_URL com a URL do seu bucket R2" -ForegroundColor Cyan

# Fazer deploy
Write-Host "🚀 Iniciando deploy..." -ForegroundColor Green
vercel --prod

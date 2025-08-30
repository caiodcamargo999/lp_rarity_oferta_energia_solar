# Script de Deploy para Vercel
Write-Host "🚀 Iniciando Deploy no Vercel..." -ForegroundColor Green

# 1. Build do projeto
Write-Host "📦 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build! Abortando deploy." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green

# 2. Deploy no Vercel
Write-Host "🌐 Fazendo deploy no Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "💡 Lembre-se de configurar o Vercel Storage para o vídeo!" -ForegroundColor Cyan

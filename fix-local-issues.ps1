# Script para Resolver Problemas Locais - Rarity Agency
# Execute este script para limpar e reinicializar o projeto

Write-Host "🔧 Resolvendo problemas locais do projeto Rarity Agency..." -ForegroundColor Green
Write-Host ""

# 1. Parar servidor se estiver rodando
Write-Host "1️⃣ Parando servidor de desenvolvimento..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
    Write-Host "✅ Servidor parado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Nenhum servidor rodando" -ForegroundColor Blue
}

# 2. Limpar cache do Next.js
Write-Host "2️⃣ Limpando cache do Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Cache .next removido" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✅ Cache node_modules removido" -ForegroundColor Green
}

# 3. Limpar arquivos temporários
Write-Host "3️⃣ Limpando arquivos temporários..." -ForegroundColor Yellow
$tempFiles = @("*.log", "*.tmp", "*.temp", "tsconfig.tsbuildinfo")
foreach ($pattern in $tempFiles) {
    Get-ChildItem -Path . -Filter $pattern -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force
}
Write-Host "✅ Arquivos temporários removidos" -ForegroundColor Green

# 4. Verificar dependências
Write-Host "4️⃣ Verificando dependências..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Write-Host "📦 package-lock.json encontrado" -ForegroundColor Blue
} else {
    Write-Host "⚠️ package-lock.json não encontrado, reinstalando dependências..." -ForegroundColor Yellow
    npm install
}

# 5. Reinstalar dependências (opcional)
$reinstall = Read-Host "🔄 Deseja reinstalar todas as dependências? (s/n)"
if ($reinstall -eq "s" -or $reinstall -eq "S" -or $reinstall -eq "sim" -or $reinstall -eq "Sim") {
    Write-Host "📦 Removendo node_modules..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
    }
    
    Write-Host "📦 Reinstalando dependências..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências reinstaladas com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao reinstalar dependências" -ForegroundColor Red
        exit 1
    }
}

# 6. Verificar arquivos críticos
Write-Host "5️⃣ Verificando arquivos críticos..." -ForegroundColor Yellow

$criticalFiles = @(
    "app/layout.tsx",
    "app/globals.css", 
    "app/page.tsx",
    "components/VideoSection.tsx",
    "next.config.js",
    "package.json"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - ARQUIVO CRÍTICO AUSENTE!" -ForegroundColor Red
    }
}

# 7. Verificar variáveis de ambiente
Write-Host "6️⃣ Verificando variáveis de ambiente..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️ .env.local não encontrado - criando template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env.local" -ErrorAction SilentlyContinue
    if (Test-Path ".env.local") {
        Write-Host "✅ .env.local criado a partir do template" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar .env.local" -ForegroundColor Red
    }
}

# 8. Verificar configuração do Next.js
Write-Host "7️⃣ Verificando configuração do Next.js..." -ForegroundColor Yellow
try {
    $nextConfig = Get-Content "next.config.js" -Raw
    if ($nextConfig -match "experimental.*appDir.*true") {
        Write-Host "⚠️ Configuração experimental.appDir detectada - pode causar problemas" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Configuração do Next.js parece correta" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro ao ler next.config.js" -ForegroundColor Red
}

# 9. Verificar TypeScript
Write-Host "8️⃣ Verificando configuração TypeScript..." -ForegroundColor Yellow
if (Test-Path "tsconfig.json") {
    Write-Host "✅ tsconfig.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ tsconfig.json não encontrado" -ForegroundColor Red
}

# 10. Iniciar servidor de desenvolvimento
Write-Host "9️⃣ Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Para iniciar o servidor, execute:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 O projeto estará disponível em: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# 11. Perguntar se quer iniciar agora
$startNow = Read-Host "🚀 Deseja iniciar o servidor agora? (s/n)"
if ($startNow -eq "s" -or $startNow -eq "S" -or $startNow -eq "sim" -or $startNow -eq "Sim") {
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host ""
    Write-Host "🎯 Resumo das correções aplicadas:" -ForegroundColor Green
    Write-Host "   ✅ Cache limpo" -ForegroundColor White
    Write-Host "   ✅ Arquivos temporários removidos" -ForegroundColor White
    Write-Host "   ✅ Dependências verificadas" -ForegroundColor White
    Write-Host "   ✅ Arquivos críticos verificados" -ForegroundColor White
    Write-Host "   ✅ Variáveis de ambiente configuradas" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Para iniciar manualmente:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
}

Write-Host ""
Write-Host "🎯 Problemas resolvidos! Consulte TROUBLESHOOTING_VIDEO.md se ainda houver problemas." -ForegroundColor Green

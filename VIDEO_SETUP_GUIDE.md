# 🎬 Guia de Configuração de Vídeos - Cloudflare R2

Este guia explica como configurar e hospedar vídeos de grande porte (1.7GB+) usando o Cloudflare R2 com S3 Compatibility API.

## 🚀 Vantagens do Cloudflare R2

- **💰 10x mais barato** que Vercel Pro
- **🌍 CDN global** incluído
- **📱 Sem taxas de egress**
- **🔒 Segurança empresarial**
- **📹 Suporte a vídeos grandes** (1.7GB+)
- **🔌 API S3 compatível**

## 📋 Pré-requisitos

1. Conta no Cloudflare
2. Bucket R2 configurado
3. Credenciais de acesso R2
4. Vídeo otimizado (MP4 recomendado)

## ⚙️ Configuração Passo a Passo

### 1. Criar Bucket no Cloudflare R2

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá para **R2 Object Storage**
3. Clique em **Create bucket**
4. Nome: `rarity-videos`
5. Configure como **público** (para acesso direto)

### 2. Obter Credenciais R2

1. No dashboard R2, vá para **Manage R2 API tokens**
2. Clique em **Create API token**
3. Configure as permissões:
   - **Object Read & Write** para o bucket `rarity-videos`
4. Copie as credenciais:
   - `Account ID`
   - `Access Key ID`
   - `Secret Access Key`

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```bash
# ===== CLOUDFLARE R2 CONFIGURATION =====
R2_ACCOUNT_ID=sua_account_id_aqui
R2_ACCESS_KEY_ID=sua_access_key_aqui
R2_SECRET_ACCESS_KEY=sua_secret_key_aqui
R2_BUCKET_NAME=rarity-videos

# ===== VÍDEO PRINCIPAL =====
NEXT_PUBLIC_VIDEO_URL=https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-de-vendas.mp4

# ===== VÍDEO GOOGLE ADS (página /3) =====
NEXT_PUBLIC_VIDEO_URL_GOOGLEADS=https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-google-ads.mp4

# ===== VÍDEO LANDING PAGES (futuro) =====
NEXT_PUBLIC_VIDEO_URL_LANDINGPAGES=https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-landing-pages.mp4

# ===== CONFIGURAÇÃO DO SITE =====
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
NEXT_PUBLIC_SITE_URL_LOCAL=http://localhost:3000
NEXT_PUBLIC_SITE_URL_PROD=https://seu-dominio.com
```

### 4. Upload de Vídeos

#### Opção A: Via Script Automatizado (Recomendado)

```bash
# Instalar dependências (se necessário)
npm install

# Upload do vídeo Google Ads para página /3
npm run upload-video-googleads

# Upload de outros vídeos
npm run upload-video video-landing-pages.mp4 landingpages
```

#### Opção B: Via AWS CLI

```bash
# Configurar AWS CLI para R2
aws configure set aws_access_key_id sua_access_key
aws configure set aws_secret_access_key sua_secret_key
aws configure set region auto

# Upload do vídeo
aws s3 cp video-google-ads.mp4 s3://rarity-videos/video-google-ads.mp4 \
  --endpoint-url=https://sua-account-id.r2.cloudflarestorage.com
```

#### Opção C: Via Interface Web

1. Acesse o bucket no Cloudflare Dashboard
2. Clique em **Upload**
3. Selecione seu arquivo de vídeo
4. Aguarde o upload completar
5. Copie a URL pública do arquivo

## 🎯 Configuração por Página

### Página Principal (/)
- **Vídeo**: `video-de-vendas.mp4`
- **Variável**: `NEXT_PUBLIC_VIDEO_URL`
- **API Proxy**: `/api/video-proxy`

### Página Google Ads (/3)
- **Vídeo**: `video-google-ads.mp4`
- **Variável**: `NEXT_PUBLIC_VIDEO_URL_GOOGLEADS`
- **API Proxy**: `/api/video-proxy-googleads`
- **Componente**: `VideoSectionV3` com `videoId="googleads"`

### Página Landing Pages (futuro)
- **Vídeo**: `video-landing-pages.mp4`
- **Variável**: `NEXT_PUBLIC_VIDEO_URL_LANDINGPAGES`
- **API Proxy**: `/api/video-proxy-landingpages`
- **Componente**: `VideoSectionV3` com `videoId="landingpages"`

## 🔧 Estrutura de Arquivos

```
projeto/
├── app/
│   ├── api/
│   │   ├── video-proxy/route.ts              # Proxy vídeo principal
│   │   ├── video-proxy-googleads/route.ts    # Proxy vídeo Google Ads
│   │   └── video-proxy-landingpages/route.ts # Proxy vídeo Landing Pages
│   └── 3/page.tsx                            # Página Google Ads
├── components/
│   ├── VideoSection.tsx                      # Componente original
│   ├── VideoSectionV3.tsx                    # Componente multi-vídeo
│   └── OptimizedVideo.tsx                    # Player otimizado
├── scripts/
│   ├── upload-video-r2.js                    # Script Node.js
│   └── upload-video-r2.ps1                   # Script PowerShell
└── env-config-r2-videos.txt                  # Template de configuração
```

## 🚀 Deploy no Vercel

### 1. Configurar Variáveis no Vercel

```bash
# Via CLI
vercel env add R2_ACCOUNT_ID production
vercel env add R2_ACCESS_KEY_ID production
vercel env add R2_SECRET_ACCESS_KEY production
vercel env add R2_BUCKET_NAME production
vercel env add NEXT_PUBLIC_VIDEO_URL_GOOGLEADS production

# Via Dashboard
# Acesse: https://vercel.com/dashboard
# Vá para: Settings > Environment Variables
# Adicione todas as variáveis do .env.local
```

### 2. Deploy

```bash
# Deploy para produção
vercel --prod

# Ou push para GitHub (se conectado)
git push origin main
```

## 🧪 Testes

### 1. Teste Local

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar páginas
# http://localhost:3000 (página principal)
# http://localhost:3000/3 (página Google Ads)
```

### 2. Teste de URL do Vídeo

```bash
# Testar URL direta do vídeo
curl -I https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-google-ads.mp4

# Deve retornar:
# HTTP/2 200
# Content-Type: video/mp4
# Accept-Ranges: bytes
```

### 3. Teste de API Proxy

```bash
# Testar proxy local
curl -I http://localhost:3000/api/video-proxy-googleads

# Deve retornar:
# HTTP/1.1 200
# Content-Type: video/mp4
# Accept-Ranges: bytes
```

## 🐛 Troubleshooting

### Erro: "URL do vídeo não configurada"

**Causa**: Variável de ambiente não definida
**Solução**: 
1. Verificar se `.env.local` existe
2. Verificar se variável está correta
3. Reiniciar servidor de desenvolvimento

### Erro: "Acesso negado ao vídeo"

**Causa**: Bucket não é público ou credenciais incorretas
**Solução**:
1. Configurar bucket como público
2. Verificar credenciais R2
3. Verificar permissões do token

### Erro: "Vídeo não encontrado"

**Causa**: Arquivo não foi uploadado ou nome incorreto
**Solução**:
1. Verificar se arquivo existe no bucket
2. Verificar nome do arquivo
3. Verificar URL completa

### Vídeo não carrega

**Causa**: Problemas de CORS ou headers
**Solução**:
1. Verificar headers do R2
2. Verificar configuração CORS
3. Usar API proxy como fallback

## 📊 Monitoramento

### Métricas Importantes

- **Tempo de carregamento**: < 3 segundos
- **Taxa de erro**: < 1%
- **Cache hit rate**: > 90%
- **Bandwidth**: Monitorar uso mensal

### Logs

```bash
# Ver logs do Vercel
vercel logs

# Ver logs específicos do vídeo
vercel logs --filter="video-proxy"
```

## 💡 Dicas de Otimização

### 1. Compressão de Vídeo

```bash
# Usar FFmpeg para otimizar
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4

# Para vídeos muito grandes
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k output.mp4
```

### 2. Thumbnails

- Criar thumbnails otimizados (JPG, 900x400px)
- Usar WebP para melhor compressão
- Implementar lazy loading

### 3. CDN

- Cloudflare R2 já inclui CDN global
- Configurar cache headers adequados
- Usar compressão gzip

## 📞 Suporte

- **Documentação Cloudflare R2**: https://developers.cloudflare.com/r2/
- **API S3 Compatibility**: https://developers.cloudflare.com/r2/api/s3/
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

**🎬 Pronto!** Seu vídeo de 1.7GB está configurado e otimizado para a página /3 usando Cloudflare R2!

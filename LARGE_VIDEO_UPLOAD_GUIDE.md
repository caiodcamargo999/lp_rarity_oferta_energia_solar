# 🎬 Guia para Upload de Vídeos Grandes (1.7GB+) - Cloudflare R2

## 🚨 **Problema Identificado**

O Cloudflare R2 tem uma **limitação de 300MB** para uploads via interface web. Para vídeos de 1.7GB+, precisamos usar métodos alternativos.

## 🛠️ **Soluções Disponíveis**

### **Solução 1: AWS CLI (Recomendada) ⭐**

A AWS CLI é a forma mais confiável para uploads grandes, pois suporta multipart upload nativamente.

#### **Passo 1: Instalar AWS CLI**

**Windows:**
```powershell
# Download automático
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "AWSCLIV2.msi"
Start-Process msiexec.exe -Wait -ArgumentList "/i AWSCLIV2.msi /quiet"

# Ou usar Chocolatey
choco install awscli
```

**macOS:**
```bash
# Via Homebrew
brew install awscli

# Ou download direto
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install awscli

# CentOS/RHEL
sudo yum install awscli
```

#### **Passo 2: Configurar Credenciais R2**

```bash
# Configurar credenciais
aws configure set aws_access_key_id sua_access_key
aws configure set aws_secret_access_key sua_secret_key
aws configure set region auto
```

#### **Passo 3: Upload do Vídeo**

```bash
# Upload com multipart automático
aws s3 cp video-google-ads.mp4 s3://rarity-videos/video-google-ads.mp4 \
  --endpoint-url=https://sua-account-id.r2.cloudflarestorage.com \
  --cli-read-timeout=0 \
  --cli-connect-timeout=60
```

### **Solução 2: Scripts Automatizados**

#### **Node.js (Recomendado para desenvolvedores)**

```bash
# Usar script otimizado
node scripts/upload-large-video-r2.js video-google-ads.mp4 googleads
```

#### **PowerShell (Windows)**

```powershell
# Usar script PowerShell
.\scripts\upload-large-video-r2.ps1 -FilePath "video-google-ads.mp4" -VideoType "googleads"
```

### **Solução 3: R2 API Direta (Avançado)**

Para desenvolvedores experientes, pode usar a API R2 diretamente com multipart upload.

## 🚀 **Configuração Completa**

### **1. Configurar Variáveis de Ambiente**

```bash
# .env.local
R2_ACCOUNT_ID=sua_account_id
R2_ACCESS_KEY_ID=sua_access_key
R2_SECRET_ACCESS_KEY=sua_secret_key
R2_BUCKET_NAME=rarity-videos
NEXT_PUBLIC_VIDEO_URL_GOOGLEADS=https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-google-ads.mp4
```

### **2. Criar Bucket R2**

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá para **R2 Object Storage**
3. Clique em **Create bucket**
4. Nome: `rarity-videos`
5. **IMPORTANTE**: Configure como **público** para acesso direto

### **3. Upload do Vídeo**

#### **Opção A: AWS CLI (Mais Simples)**

```bash
# 1. Instalar AWS CLI (se não tiver)
# 2. Configurar credenciais
aws configure set aws_access_key_id sua_access_key
aws configure set aws_secret_access_key sua_secret_key
aws configure set region auto

# 3. Upload do vídeo
aws s3 cp video-google-ads.mp4 s3://rarity-videos/video-google-ads.mp4 \
  --endpoint-url=https://sua-account-id.r2.cloudflarestorage.com
```

#### **Opção B: Script Automatizado**

```bash
# 1. Configurar variáveis de ambiente
export R2_ACCOUNT_ID=sua_account_id
export R2_ACCESS_KEY_ID=sua_access_key
export R2_SECRET_ACCESS_KEY=sua_secret_key

# 2. Executar script
node scripts/upload-large-video-r2.js video-google-ads.mp4 googleads
```

### **4. Verificar Upload**

```bash
# Listar arquivos no bucket
aws s3 ls s3://rarity-videos/ --endpoint-url=https://sua-account-id.r2.cloudflarestorage.com

# Testar URL do vídeo
curl -I https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-google-ads.mp4
```

### **5. Configurar no Vercel**

```bash
# Adicionar variáveis de ambiente
vercel env add R2_ACCOUNT_ID production
vercel env add R2_ACCESS_KEY_ID production
vercel env add R2_SECRET_ACCESS_KEY production
vercel env add NEXT_PUBLIC_VIDEO_URL_GOOGLEADS production

# Deploy
vercel --prod
```

## 🧪 **Testes**

### **1. Teste Local**

```bash
# Iniciar servidor
npm run dev

# Acessar página
# http://localhost:3000/3
```

### **2. Teste de URL**

```bash
# Testar URL direta
curl -I https://sua-account-id.r2.cloudflarestorage.com/rarity-videos/video-google-ads.mp4

# Deve retornar:
# HTTP/2 200
# Content-Type: video/mp4
# Accept-Ranges: bytes
```

### **3. Teste de API Proxy**

```bash
# Testar proxy local
curl -I http://localhost:3000/api/video-proxy-googleads

# Deve retornar:
# HTTP/1.1 200
# Content-Type: video/mp4
# Accept-Ranges: bytes
```

## 🐛 **Troubleshooting**

### **Erro: "Access Denied"**

**Causa**: Credenciais incorretas ou bucket não público
**Solução**:
1. Verificar credenciais R2
2. Configurar bucket como público
3. Verificar permissões do token

### **Erro: "Connection Timeout"**

**Causa**: Vídeo muito grande ou conexão lenta
**Solução**:
1. Usar multipart upload
2. Aumentar timeout
3. Usar CDN

### **Erro: "File Not Found"**

**Causa**: Arquivo não foi uploadado corretamente
**Solução**:
1. Verificar se arquivo existe no bucket
2. Verificar nome do arquivo
3. Verificar URL completa

### **Vídeo não carrega na página**

**Causa**: Problemas de CORS ou headers
**Solução**:
1. Verificar headers do R2
2. Usar API proxy como fallback
3. Verificar configuração CORS

## 📊 **Otimizações para Vídeos Grandes**

### **1. Compressão de Vídeo**

```bash
# Otimizar vídeo antes do upload
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4

# Para vídeos muito grandes
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k output.mp4
```

### **2. Multipart Upload**

- **Chunk Size**: 50MB (recomendado)
- **Retry**: 3 tentativas automáticas
- **Timeout**: 60 segundos por chunk

### **3. CDN e Cache**

- Cloudflare R2 inclui CDN global
- Cache de 1 ano para vídeos
- Compressão gzip automática

## 💡 **Dicas Importantes**

### **1. Preparação do Vídeo**

- **Formato**: MP4 (recomendado)
- **Codec**: H.264
- **Áudio**: AAC
- **Resolução**: 1080p ou 720p
- **Bitrate**: 2-5 Mbps

### **2. Monitoramento**

- Verificar logs de upload
- Monitorar uso de bandwidth
- Testar em diferentes dispositivos

### **3. Backup**

- Manter backup local do vídeo
- Documentar configurações
- Testar restore

## 🎯 **Comandos Rápidos**

```bash
# Upload rápido
aws s3 cp video.mp4 s3://rarity-videos/ --endpoint-url=https://account.r2.cloudflarestorage.com

# Verificar upload
aws s3 ls s3://rarity-videos/ --endpoint-url=https://account.r2.cloudflarestorage.com

# Testar URL
curl -I https://account.r2.cloudflarestorage.com/rarity-videos/video.mp4

# Deploy
vercel --prod
```

## 📞 **Suporte**

- **AWS CLI Docs**: https://docs.aws.amazon.com/cli/
- **Cloudflare R2 Docs**: https://developers.cloudflare.com/r2/
- **Multipart Upload**: https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html

---

**🎬 Pronto!** Seu vídeo de 1.7GB está configurado e otimizado para a página /3 usando Cloudflare R2 com multipart upload!

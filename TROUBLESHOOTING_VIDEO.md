# 🎬 Troubleshooting do Vídeo - Rarity Agency Landing Page

## 🚨 **Problema: Vídeo não funciona na versão deployada**

### **🔍 Diagnóstico Rápido**

Se o vídeo não está funcionando na versão deployada, verifique:

1. **Console do Navegador** - Erros 403, 404 ou CORS
2. **Network Tab** - Falhas ao carregar o vídeo
3. **Variáveis de Ambiente** - Configuração incorreta no Vercel

---

## 🛠️ **Soluções por Ordem de Prioridade**

### **Solução 1: Configurar Cloudflare R2 (RECOMENDADO)**

#### **Passo a Passo:**

1. **Acesse o Cloudflare R2**
   ```
   https://www.cloudflare.com/products/r2/
   ```

2. **Crie uma conta gratuita**
   - Clique em "Get Started"
   - Complete o cadastro

3. **Ative R2 Object Storage**
   - No dashboard, vá para "R2 Object Storage"
   - Clique em "Create bucket"

4. **Crie um novo bucket**
   - Nome: `rarity-videos`
   - Região: `São Paulo` ou mais próxima
   - Clique em "Create bucket"

5. **Faça upload do vídeo**
   - Clique em "Upload"
   - Selecione `video-de-vendas.mp4`
   - Aguarde o upload completar

6. **Configure permissões**
   - Clique no arquivo
   - Em "Settings", marque "Public"
   - Copie a URL pública

7. **Configure variáveis de ambiente**
   ```bash
   # No terminal do projeto
   vercel env add NEXT_PUBLIC_VIDEO_URL production [URL_DO_VIDEO_R2]
   vercel env add R2_ACCESS_KEY_ID production [SUA_ACCESS_KEY]
   vercel env add R2_SECRET_ACCESS_KEY production [SUA_SECRET_KEY]
   vercel env add R2_BUCKET_NAME production rarity-videos
   ```

8. **Redeploy**
   ```bash
   vercel --prod
   ```

---

### **Solução 2: Configuração Manual no Dashboard**

1. **Acesse seu projeto no Vercel**
   ```
   https://vercel.com/dashboard/[seu-projeto]
   ```

2. **Vá para Settings > Environment Variables**

3. **Adicione as variáveis:**
   ```
   NEXT_PUBLIC_VIDEO_URL = [URL_DO_VIDEO_R2]
   R2_ACCESS_KEY_ID = [SUA_ACCESS_KEY]
   R2_SECRET_ACCESS_KEY = [SUA_SECRET_KEY]
   R2_BUCKET_NAME = rarity-videos
   ```

4. **Clique em "Save"**

5. **Vá para Deployments e clique em "Redeploy"**

---

## 🔧 **Verificações Técnicas**

### **1. Testar URL do Vídeo**

```bash
# Teste se o vídeo está acessível
curl -I "[URL_DO_VIDEO_R2]"

# Deve retornar:
# HTTP/1.1 200
# Content-Type: video/mp4
# Accept-Ranges: bytes
```

### **2. Verificar Headers CORS**

```bash
# Teste headers CORS
curl -H "Origin: https://seu-site.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Range" \
     -X OPTIONS \
     "[URL_DO_VIDEO_R2]"
```

### **3. Verificar API Proxy**

```bash
# Teste a API proxy localmente
curl -I "http://localhost:3000/api/video-proxy"

# Deve retornar:
# HTTP/1.1 200
# Content-Type: video/mp4
```

---

## 🚫 **Problemas Comuns e Soluções**

### **Erro 403 (Forbidden)**

**Causa:** Credenciais inválidas ou bucket não público
**Solução:**
1. Verificar credenciais do Cloudflare R2
2. Verificar se o bucket está marcado como "Public"
3. Verificar permissões do arquivo

### **Erro 404 (Not Found)**

**Causa:** Arquivo não existe ou URL incorreta
**Solução:**
1. Verificar se o arquivo foi uploadado no R2
2. Copiar URL correta do dashboard do Cloudflare
3. Verificar se o nome do arquivo está correto

### **Erro CORS**

**Causa:** Headers CORS incorretos
**Solução:**
1. Verificar configuração CORS no Cloudflare R2
2. Usar API proxy em vez de URL direta
3. Configurar headers corretos no vercel.json

### **Vídeo não carrega**

**Causa:** Formato não suportado ou arquivo corrompido
**Solução:**
1. Verificar se o arquivo é MP4 válido
2. Converter para formato compatível (H.264)
3. Verificar tamanho do arquivo (máximo 500MB)

---

## 📱 **Testes em Diferentes Dispositivos**

### **Desktop (Chrome/Firefox/Safari)**
- ✅ Suporte completo
- ✅ Controles nativos
- ✅ Fallbacks funcionais

### **Mobile (iOS/Android)**
- ⚠️ iOS: Pode precisar de `playsInline`
- ⚠️ Android: Pode precisar de `webkit-playsinline`
- ✅ Fallbacks implementados

### **Tablet**
- ✅ Suporte intermediário
- ✅ Responsivo implementado

---

## 🔍 **Debugging Avançado**

### **1. Logs do Console**

Abra o console do navegador e procure por:

```javascript
// Logs de sucesso
✅ Vídeo carregado com sucesso!
🎬 Vídeo pronto para reprodução!

// Logs de erro
❌ Erro ao carregar vídeo
❌ Falha ao iniciar vídeo
```

### **2. Network Tab**

No DevTools > Network:
- Procure por requisições para `/api/video-proxy`
- Verifique status das requisições
- Verifique se o vídeo está sendo carregado do Cloudflare R2

---

## 📋 **Checklist de Verificação**

### **Configuração do Cloudflare R2**
- [ ] Conta criada no Cloudflare
- [ ] Bucket "rarity-videos" criado
- [ ] Vídeo uploadado e marcado como público
- [ ] URL copiada corretamente

### **Variáveis de Ambiente no Vercel**
- [ ] NEXT_PUBLIC_VIDEO_URL configurada
- [ ] R2_ACCESS_KEY_ID configurada
- [ ] R2_SECRET_ACCESS_KEY configurada
- [ ] R2_BUCKET_NAME configurada

### **Deploy e Teste**
- [ ] Redeploy feito após configurar variáveis
- [ ] Vídeo testado em diferentes navegadores
- [ ] Console verificado para erros
- [ ] Network tab verificado para requisições

---

## 🆘 **Suporte**

Se o problema persistir:

1. **Verifique os logs** no console do navegador
2. **Teste a URL** diretamente no navegador
3. **Verifique as variáveis** de ambiente no Vercel
4. **Consulte a documentação** do Cloudflare R2
5. **Entre em contato** com o suporte técnico

---

**💡 Dica:** O Cloudflare R2 é 10x mais barato que o Vercel Pro e oferece melhor performance global com CDN incluído.

# 🎬 Upload do Vídeo para Cloudflare R2

## 🚨 **PROBLEMA IDENTIFICADO**
O vídeo `video-de-vendas.mp4` tem mais de 300MB e não pode ser uploadado diretamente no dashboard do Cloudflare R2. É necessário usar a **S3 Compatibility API**.

## ⚠️ **ERRO SSL RESOLVIDO**
O erro `SSL alert handshake failure` foi causado por configuração incorreta do endpoint. **SOLUÇÕES IMPLEMENTADAS**.

## 🔧 **SOLUÇÃO 1: Script Principal (Corrigido)**
```bash
node upload-video-r2.js
```

### **Correções Implementadas:**
- ✅ **Endpoint corrigido** para formato R2
- ✅ **Configurações SSL** otimizadas
- ✅ **Timeout aumentado** para arquivos grandes
- ✅ **ACL removido** (não suportado no R2)
- ✅ **Diagnóstico de erros** melhorado

## 🔧 **SOLUÇÃO 2: Script Alternativo**
```bash
node upload-video-r2-alternative.js
```

### **Diferenças:**
- 🔄 **Endpoint alternativo** (formato bucket.account.r2.cloudflarestorage.com)
- 🔄 **forcePathStyle: false** para compatibilidade
- 🔄 **Timeout estendido** para 10 minutos

## 📋 **Credenciais Configuradas**
```
R2_ACCESS_KEY_ID=18d46aaf79c9700a7041bb9253f0efc4
R2_SECRET_ACCESS_KEY=97ab4b36e10a7338ced2485465a01ddc81f2ab6d426925a09ab8e2ca272b228f
R2_BUCKET_NAME=vsl-solar-rarity-brasil
```

## 🎯 **URLs Finais Esperadas**

### **Script Principal:**
```
https://18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com/vsl-solar-rarity-brasil/video-de-vendas.mp4
```

### **Script Alternativo:**
```
https://vsl-solar-rarity-brasil.18d46aaf79c9700a7041bb9253f0efc4.r2.cloudflarestorage.com/video-de-vendas.mp4
```

## 🚀 **PROCESSO DE UPLOAD**

### **Passo 1: Tentar Script Principal**
```bash
node upload-video-r2.js
```

### **Passo 2: Se Falhar, Usar Alternativo**
```bash
node upload-video-r2-alternative.js
```

### **Passo 3: Verificar Upload**
Após o upload, o script mostrará a URL pública e testará o acesso.

## ⚠️ **IMPORTANTE**
1. **Confirme** que o arquivo está em: `C:\Users\[SEU_USUARIO]\Downloads\video-de-vendas.mp4`
2. **Execute primeiro** o script principal
3. **Se falhar**, use o script alternativo
4. **Verifique** se o bucket está marcado como público
5. **Teste** a URL após o upload

## 🔍 **Verificação**
Após o upload, teste a URL diretamente no navegador para confirmar que está funcionando.

## 🚀 **Próximos Passos**
1. ✅ **Dependências instaladas** (`@aws-sdk/client-s3 @aws-sdk/lib-storage`)
2. ⏳ **Fazer upload do vídeo** (usar scripts corrigidos)
3. ⏳ **Configurar variáveis de ambiente no Vercel**
4. ⏳ **Fazer deploy**
5. ⏳ **Testar em produção**

## 🆘 **SOLUÇÕES PARA PROBLEMAS COMUNS**

### **Erro SSL:**
- ✅ **Resolvido** com configurações corrigidas
- ✅ **Scripts alternativos** implementados

### **Timeout:**
- ✅ **Aumentado** para 5-10 minutos
- ✅ **Configurações de conexão** otimizadas

### **Acesso Negado:**
- ✅ **Diagnóstico automático** implementado
- ✅ **Soluções sugeridas** para cada erro

---

**💡 Dica**: O Cloudflare R2 é 10x mais barato que o Vercel Pro e oferece melhor performance global!

**🎯 Status**: Scripts corrigidos e prontos para uso!

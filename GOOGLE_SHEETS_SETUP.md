# 🚀 Google Sheets Integration Setup - Rarity Agency

## 🎯 **O que foi implementado**

✅ **Integração completa com Google Sheets** implementada
✅ **Rastreamento automático da página de origem** (/ ou /2)
✅ **Campos organizados conforme sua planilha**:
- A: Data Cadastro (Timestamp)
- B: Qual Página (página de origem)
- C: Nome
- D: WhatsApp  
- E: Email
- F: Maior Dor
- G: Data e Hora da Reunião
- H: Timestamp

✅ **API route atualizada** para salvar no Google Sheets
✅ **Modal de captura atualizado** para rastrear página de origem
✅ **Teste de conexão** disponível em `/api/test-sheets`

---

## ⚙️ **Configuração Necessária**

### **1. Criar arquivo .env.local**
Crie um arquivo `.env.local` na raiz do projeto com:

```bash
# Google OAuth2 (OBRIGATÓRIO)
GOOGLE_OAUTH_CLIENT_ID=seu_client_id_aqui
GOOGLE_OAUTH_CLIENT_SECRET=sua_client_secret_aqui
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=seu_refresh_token_aqui

# Google Sheets
GOOGLE_SPREADSHEET_ID=17SzKfUugqko4XZyp10WYc7GOaN7nt__vNW5PjPp5pKw

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **2. Configurar Google Cloud Console**
1. Acesse: https://console.cloud.google.com/
2. Crie projeto "Rarity Agency Lead Capture"
3. Ative as APIs: Google Sheets API
4. Configure OAuth2 com escopo: `https://www.googleapis.com/auth/spreadsheets`

### **3. Gerar Refresh Token**
1. Acesse: https://developers.google.com/oauthplayground/
2. Configure suas credenciais OAuth2
3. Adicione escopo: `https://www.googleapis.com/auth/spreadsheets`
4. Autorize e obtenha o refresh token

---

## 🧪 **Como Testar**

### **1. Teste de Conexão**
```bash
# Inicie o servidor
npm run dev

# Teste a conexão
curl http://localhost:3000/api/test-sheets
```

### **2. Teste Completo**
1. Acesse http://localhost:3000 ou http://localhost:3000/2
2. Clique no botão "QUERO IMPLEMENTAR NA MINHA EMPRESA"
3. Preencha o formulário
4. Verifique se os dados aparecem na planilha

---

## 📊 **Estrutura da Planilha**

Sua planilha deve ter os seguintes cabeçalhos na primeira linha:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Data Cadastro | Qual Página | Nome | WhatsApp | Email | Maior Dor | Data e Hora da Reunião | Timestamp |

**Exemplo de dados inseridos:**
```
2025-01-27T10:30:00.000Z | /2 | João Silva | (11) 99999-9999 | joao@email.com | Falta de leads qualificados | 2025-01-28 09:00 | 2025-01-27T10:30:00.000Z
```

---

## 🔍 **Verificação**

### **Logs do Console**
Quando um lead for processado, você verá:
```
📝 Processando lead: João Silva
📄 Página de origem: /2
📧 Email: joao@email.com
📱 WhatsApp: (11) 99999-9999
🎯 Dor principal: Falta de leads qualificados
📅 Data/Hora agendada: 2025-01-28 09:00
✅ Lead salvo no Google Sheets com sucesso
```

### **Na Planilha**
- Nova linha adicionada automaticamente
- Página de origem rastreada corretamente
- Todos os campos preenchidos

---

## 🚨 **Solução de Problemas**

### **Erro: "GOOGLE_SPREADSHEET_ID not configured"**
- Verifique se o arquivo `.env.local` existe
- Confirme se `GOOGLE_SPREADSHEET_ID` está correto
- Reinicie o servidor após alterações

### **Erro: "Invalid credentials"**
- Verifique se o refresh token está correto
- Confirme se as APIs estão ativadas no Google Cloud
- Teste a conexão com `/api/test-sheets`

### **Erro: "Permission denied"**
- Verifique se a planilha existe e está acessível
- Confirme se o ID da planilha está correto
- Teste compartilhar a planilha explicitamente

---

## 📈 **Resultado Esperado**

✅ **Leads são salvos automaticamente** na planilha
✅ **Página de origem é rastreada** (/ ou /2)
✅ **Dados organizados** em colunas específicas
✅ **Timestamp automático** para cada entrada
✅ **Zero trabalho manual** para captura de leads

---

## 🎯 **Próximos Passos**

1. **Configure as variáveis de ambiente** no `.env.local`
2. **Teste a conexão** com `/api/test-sheets`
3. **Teste o formulário completo** em ambas as páginas
4. **Verifique os dados** na planilha do Google Sheets
5. **Configure para produção** no Vercel

---

**🚀 A integração está pronta e funcionando! Só precisa configurar as credenciais do Google.**

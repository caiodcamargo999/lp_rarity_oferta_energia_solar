# Configuração Google Workspace - Guia Completo

## 🎯 **Visão Geral**
Este guia mostra como configurar todas as integrações com Google Workspace para o fluxo de captação de leads da Rarity Agency, incluindo:
- Google Calendar (agendamento automático + Google Meet)
- Google Sheets (base de dados de leads)
- Gmail (emails de confirmação e lembretes)

## 📋 **Pré-requisitos**
- Conta Google ativa (matheusdrarity@gmail.com)
- Acesso ao Google Cloud Console
- Verificação em duas etapas ativada no Gmail

---

## 🚀 **Passo 1: Criar Projeto no Google Cloud Console**

### 1.1 Acessar o Console
- Acesse: https://console.cloud.google.com/
- Faça login com a conta `matheusdrarity@gmail.com`

### 1.2 Criar Novo Projeto
1. Clique em **"Selecionar projeto"** (ao lado do logo Google Cloud)
2. Clique em **"Novo projeto"**
3. **Nome do projeto**: `Rarity Agency Lead Capture`
4. **Organização**: (deixe como está)
5. Clique em **"Criar"**
6. Aguarde a criação (pode levar alguns segundos)
7. Certifique-se de que o projeto está selecionado

---

## 🔌 **Passo 2: Ativar APIs Necessárias**

### 2.1 Acessar Biblioteca de APIs
1. No menu lateral esquerdo, vá em **"APIs e serviços"** → **"Biblioteca"**
2. Ou acesse diretamente: https://console.cloud.google.com/apis/library

### 2.2 Ativar Google Calendar API
1. Na barra de pesquisa, digite: `Google Calendar API`
2. Clique no resultado **"Google Calendar API"**
3. Clique em **"Ativar"**
4. Aguarde a ativação

### 2.3 Ativar Google Sheets API
1. Volte para a biblioteca (botão voltar ou link da biblioteca)
2. Pesquise: `Google Sheets API`
3. Clique no resultado **"Google Sheets API"**
4. Clique em **"Ativar"**

### 2.4 Ativar Gmail API
1. Volte para a biblioteca
2. Pesquise: `Gmail API`
3. Clique no resultado **"Gmail API"**
4. Clique em **"Ativar"**

### ✅ Verificação
- Vá em **"APIs e serviços"** → **"APIs e serviços ativados"**
- Você deve ver as 3 APIs listadas como ativadas

---

## 🔐 **Passo 3: Configurar OAuth2**

### 3.1 Configurar Tela de Consentimento OAuth
1. Vá em **"APIs e serviços"** → **"Tela de consentimento OAuth"**
2. Selecione **"Externo"** (se não for Google Workspace)
3. Clique em **"Criar"**

### 3.2 Preencher Informações do App
- **Nome do aplicativo**: `Rarity Agency Lead Capture`
- **Email de suporte do usuário**: `matheusdrarity@gmail.com`
- **Domínio autorizado**: `rarityagency.io` (se aplicável)
- **Email do desenvolvedor**: `matheusdrarity@gmail.com`
- Clique em **"Salvar e continuar"**

### 3.3 Configurar Escopos
1. Clique em **"Adicionar ou remover escopos"**
2. Adicione os seguintes escopos:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/gmail.send`
3. Clique em **"Atualizar"**
4. Clique em **"Salvar e continuar"**

### 3.4 Criar Credenciais OAuth
1. Vá em **"APIs e serviços"** → **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** → **"ID do cliente OAuth"**
3. **Tipo de aplicativo**: `Aplicativo da Web`
4. **Nome**: `Rarity Lead Capture Client`

### 3.5 Configurar URIs
**URIs de origem autorizados:**
```
http://localhost:3000
https://sua-url-de-producao.vercel.app
```

**URIs de redirecionamento autorizados:**
```
http://localhost:3000/api/google/oauth/callback
https://sua-url-de-producao.vercel.app/api/google/oauth/callback
```

6. Clique em **"Criar"**

### 3.6 Copiar Credenciais
- Uma janela aparecerá com:
  - **ID do cliente**: Copie para `GOOGLE_OAUTH_CLIENT_ID`
  - **Chave secreta do cliente**: Copie para `GOOGLE_OAUTH_CLIENT_SECRET`
- Você pode baixar o JSON ou copiar manualmente
- **IMPORTANTE**: Guarde essas credenciais com segurança!

---

## 🔄 **Passo 4: Gerar Refresh Token**

### 4.1 Acessar OAuth Playground
- Acesse: https://developers.google.com/oauthplayground/

### 4.2 Configurar Credenciais
1. No canto superior direito, clique na **engrenagem ⚙️**
2. Marque **"Use your own OAuth credentials"**
3. Cole o **OAuth Client ID** (do passo 3.6)
4. Cole o **OAuth Client secret** (do passo 3.6)
5. Clique fora da modal para fechar

### 4.3 Selecionar Escopos
Na caixa **"Select & authorize APIs"**, adicione:
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/gmail.send
```

### 4.4 Autorizar
1. Clique em **"Authorize APIs"**
2. **IMPORTANTE**: Faça login com `matheusdrarity@gmail.com`
3. Autorize todas as permissões solicitadas
4. Você será redirecionado de volta para o playground

### 4.5 Obter Refresh Token
1. Clique em **"Exchange authorization code for tokens"**
2. Copie o **"Refresh token"** que aparece
3. Guarde para `GOOGLE_OAUTH_REFRESH_TOKEN`

---

## 📊 **Passo 5: Criar Google Sheets**

### 5.1 Criar Nova Planilha
1. Acesse: https://sheets.google.com/
2. Clique em **"+"** para criar nova planilha
3. Renomeie para **"Rarity Leads"**

### 5.2 Configurar Aba de Leads
1. Renomeie a primeira aba para **"Leads"**
2. Crie os seguintes cabeçalhos na linha 1:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 |
|---|---|---|---|---|---|---|---|---|---|
| Data Cadastro | Nome | WhatsApp | Email | Dor Principal | Horário Selecionado | Data/Hora Agendada | Status | Link Meet | Event ID |

### 5.3 Copiar ID da Planilha
- Na URL da planilha, copie o ID:
- `https://docs.google.com/spreadsheets/d/{ESTE_É_O_ID}/edit`
- Guarde para `GOOGLE_SPREADSHEET_ID`

### 5.4 Compartilhar Planilha (Opcional)
- Clique em **"Compartilhar"**
- Adicione `matheusdrarity@gmail.com` como editor
- Isso garante acesso mesmo se houver problemas com OAuth

---

## 📧 **Passo 6: Configurar Gmail (App Password)**

### 6.1 Acessar Configurações de Segurança
- Acesse: https://myaccount.google.com/security
- Faça login com `matheusdrarity@gmail.com`

### 6.2 Ativar Verificação em Duas Etapas
1. Se não estiver ativa, clique em **"Verificação em duas etapas"**
2. Siga o processo de configuração
3. **IMPORTANTE**: Isso é obrigatório para senhas de app

### 6.3 Gerar Senha de App
1. Volte para as configurações de segurança
2. Clique em **"Senhas de app"**
3. **Selecionar app**: `Email`
4. **Selecionar dispositivo**: `Outro (nome personalizado)`
5. Digite: `Rarity Lead Capture`
6. Clique em **"Gerar"**
7. **IMPORTANTE**: Copie a senha de 16 dígitos gerada
8. Guarde para `SMTP_PASS`

---

## ⚙️ **Passo 7: Configurar Variáveis de Ambiente**

### 7.1 Criar Arquivo .env.local
Copie o arquivo `env.example` para `.env.local`:
```bash
cp env.example .env.local
```

### 7.2 Preencher Variáveis
Abra `.env.local` e preencha:

```bash
# Google OAuth2
GOOGLE_OAUTH_CLIENT_ID=seu_client_id_do_passo_3
GOOGLE_OAUTH_CLIENT_SECRET=sua_client_secret_do_passo_3
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=seu_refresh_token_do_passo_4

# Google Services
GOOGLE_SPREADSHEET_ID=id_da_planilha_do_passo_5
GOOGLE_CALENDAR_ID=primary

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=matheusdrarity@gmail.com
SMTP_PASS=senha_de_app_do_passo_6
```

### 7.3 Configurar Produção (Vercel)
Para deploy em produção, configure as variáveis no Vercel:

```bash
vercel env add GOOGLE_OAUTH_CLIENT_ID
vercel env add GOOGLE_OAUTH_CLIENT_SECRET
vercel env add GOOGLE_OAUTH_REFRESH_TOKEN
vercel env add GOOGLE_SPREADSHEET_ID
vercel env add SMTP_PASS
```

---

## ✅ **Passo 8: Testar a Integração**

### 8.1 Iniciar Servidor Local
```bash
npm run dev
```

### 8.2 Testar Fluxo Completo
1. Acesse: http://localhost:3000
2. Clique no botão **"QUERO IMPLEMENTAR NA MINHA EMPRESA"**
3. Preencha o formulário modal:
   - Nome: `Teste Lead`
   - WhatsApp: `+55 (11) 99999-9999`
   - Email: `seu-email-de-teste@gmail.com`
   - Dor: `Teste de integração`
   - Horário: Qualquer horário disponível
4. Clique em **"Confirmar Agendamento"**

### 8.3 Verificar Resultados
**Deve aparecer a mensagem de sucesso no modal**

**Verificar no Google Calendar:**
- Acesse: https://calendar.google.com/
- Deve haver um evento criado para amanhã
- Evento deve ter link do Google Meet
- Deve incluir o email de teste como convidado

**Verificar no Google Sheets:**
- Acesse sua planilha "Rarity Leads"
- Deve haver uma nova linha com os dados do teste
- Todas as colunas devem estar preenchidas

**Verificar Email:**
- Cheque o email de teste usado
- Deve haver um email de confirmação da Rarity Agency
- Email deve conter link do Google Meet
- Deve incluir todos os detalhes da sessão

### 8.4 Verificar Console
No terminal onde está rodando `npm run dev`, deve aparecer:
```
Processando lead: Teste Lead
Criando evento no calendário...
Salvando no Google Sheets...
Enviando email de confirmação...
Lead processado com sucesso: Teste Lead
```

---

## 🐛 **Solução de Problemas**

### Erro: "Redirect URI mismatch"
- Verifique se os URIs de redirecionamento estão corretos no Google Cloud Console
- Certifique-se de que não há barras extras no final das URLs

### Erro: "Invalid refresh token"
- Gere um novo refresh token no OAuth Playground
- Certifique-se de estar usando a conta correta (matheusdrarity@gmail.com)

### Erro: "Permission denied" no Sheets
- Verifique se o ID da planilha está correto
- Confirme que a planilha existe e está acessível
- Teste compartilhar a planilha explicitamente com a conta de serviço

### Erro: "SMTP Authentication failed"
- Verifique se a verificação em duas etapas está ativada
- Confirme que está usando a senha de app (não a senha normal)
- Teste se a senha de app foi copiada corretamente

### Erro: "Calendar API has not been used"
- Confirme que todas as APIs foram ativadas no Google Cloud Console
- Aguarde alguns minutos após ativar as APIs
- Verifique se está usando o projeto correto

---

## 🔒 **Segurança e Melhores Práticas**

### Proteger Credenciais
- Nunca commite o arquivo `.env.local`
- Use variáveis de ambiente para produção
- Monitore o uso das APIs no Google Cloud Console

### Limites de API
- Google Calendar: 1.000.000 requests/dia
- Google Sheets: 600 requests/100 segundos/usuário
- Gmail: 1.000.000.000 quota units/dia

### Monitoramento
- Configure alertas no Google Cloud Console
- Monitore logs de erro na aplicação
- Verifique regularmente o funcionamento do fluxo

---

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Confirme as configurações do Google Cloud Console
3. Teste cada integração separadamente
4. Consulte a documentação oficial do Google APIs

**Links úteis:**
- [Google Calendar API](https://developers.google.com/calendar/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Gmail API](https://developers.google.com/gmail/api)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

*Última atualização: Janeiro 2025*
*Versão: 1.0*

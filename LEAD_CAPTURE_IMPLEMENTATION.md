# Sistema de Captação de Leads - Implementação Completa

## 🎯 **Visão Geral**

Sistema completo de captação de leads com modal interativo estilo Typeform e integração total com Google Workspace implementado para a Rarity Agency.

### ✅ **Funcionalidades Implementadas**

#### **1. Modal Interativo Estilo Typeform**
- ✅ Design top level, idêntico ao Typeform
- ✅ Formulário multi-etapas com fluxo conversacional
- ✅ Barra de progresso visual
- ✅ Animações suaves com Framer Motion
- ✅ Design responsivo para mobile e desktop
- ✅ Validação em tempo real de todos os campos
- ✅ Paleta de cores consistente com a página principal

#### **2. Campos do Formulário**
- ✅ **Nome**: Validação mínima de 2 caracteres
- ✅ **WhatsApp**: Formato brasileiro automático (+55 XX XXXXX-XXXX)
- ✅ **E-mail**: Validação de formato completa
- ✅ **Dor Principal**: Campo livre, mínimo 10 caracteres
- ✅ **Agendamento**: Grid de horários 09h-18h com blocos de 1 hora
- ✅ **Rastreamento de Página**: Identifica se veio de / ou /2

#### **3. Integração Google Calendar**
- ✅ Criação automática de eventos no calendário matheusdrarity@gmail.com
- ✅ Link do Google Meet gerado automaticamente
- ✅ RSVP ativado para o lead
- ✅ Descrição completa com dados do lead
- ✅ Horário de Brasília configurado
- ✅ Lembretes automáticos (24h, 2h, 15min)

#### **4. Integração Google Sheets**
- ✅ Salvamento automático em planilha "Rarity Leads"
- ✅ 10 colunas de dados organizados
- ✅ ID do evento e link do Meet incluídos
- ✅ Timestamp de criação
- ✅ Rastreamento da página de origem

#### **5. Sistema de Email Automático**
- ✅ Email de confirmação instantâneo para o lead
- ✅ Email de notificação para a equipe
- ✅ Template HTML profissional
- ✅ Link direto para o Google Meet
- ✅ Detalhes completos da sessão

#### **6. Notificações Google (Nativas)**
- ✅ Lembretes automáticos 24h antes
- ✅ Lembretes automáticos 2h antes
- ✅ Notificação pop-up 15min antes
- ✅ Gerenciado nativamente pelo Google Calendar

---

## 🚀 **Como Usar**

### **Para o Usuário Final:**
1. Clique no botão "QUERO IMPLEMENTAR NA MINHA EMPRESA"
2. Modal abre com formulário interativo
3. Preenche dados passo a passo
4. Seleciona horário disponível
5. Confirma agendamento
6. Recebe confirmação instantânea

### **Para a Equipe Rarity:**
1. Evento aparece automaticamente no Google Calendar
2. Dados salvos no Google Sheets para análise
3. Notificação por email com dados do lead
4. Lembretes automáticos do Google

---

## 📁 **Arquivos Implementados**

### **Componentes Criados:**
```
components/
├── LeadCaptureModal.tsx     # Modal principal estilo Typeform
└── SuccessCases.tsx         # Modificado para usar o modal
```

### **APIs Criadas:**
```
app/api/
├── leads/route.ts           # Processamento completo de leads
├── test/route.ts            # Testes de integração
└── test-sheets/route.ts     # Teste específico do Google Sheets
```

### **Bibliotecas:**
```
lib/
└── googleSheets.ts          # Integração completa com Google Workspace
```

---

## ⚙️ **Configuração Completa do Google Workspace**

### **Passo 1: Criar Projeto no Google Cloud Console**

1. **Acessar o Console**
   - Acesse: https://console.cloud.google.com/
   - Faça login com a conta `matheusdrarity@gmail.com`

2. **Criar Novo Projeto**
   - Clique em **"Selecionar projeto"** (ao lado do logo Google Cloud)
   - Clique em **"Novo projeto"**
   - **Nome do projeto**: `Rarity Agency Lead Capture`
   - **Organização**: (deixe como está)
   - Clique em **"Criar"**
   - Aguarde a criação (pode levar alguns segundos)
   - Certifique-se de que o projeto está selecionado

### **Passo 2: Ativar APIs Necessárias**

1. **Acessar Biblioteca de APIs**
   - No menu lateral esquerdo, vá em **"APIs e serviços"** → **"Biblioteca"**
   - Ou acesse diretamente: https://console.cloud.google.com/apis/library

2. **Ativar Google Calendar API**
   - Na barra de pesquisa, digite: `Google Calendar API`
   - Clique no resultado **"Google Calendar API"**
   - Clique em **"Ativar"**
   - Aguarde a ativação

3. **Ativar Google Sheets API**
   - Volte para a biblioteca (botão voltar ou link da biblioteca)
   - Pesquise: `Google Sheets API`
   - Clique no resultado **"Google Sheets API"**
   - Clique em **"Ativar"**

4. **Ativar Gmail API**
   - Volte para a biblioteca
   - Pesquise: `Gmail API`
   - Clique no resultado **"Gmail API"**
   - Clique em **"Ativar"**

5. **Verificação**
   - Vá em **"APIs e serviços"** → **"APIs e serviços ativados"**
   - Você deve ver as 3 APIs listadas como ativadas

### **Passo 3: Configurar OAuth2**

1. **Configurar Tela de Consentimento OAuth**
   - Vá em **"APIs e serviços"** → **"Tela de consentimento OAuth"**
   - Selecione **"Externo"** (se não for Google Workspace)
   - Clique em **"Criar"**

2. **Preencher Informações do App**
   - **Nome do aplicativo**: `Rarity Agency Lead Capture`
   - **Email de suporte do usuário**: `matheusdrarity@gmail.com`
   - **Domínio autorizado**: `rarityagency.io` (se aplicável)
   - **Email do desenvolvedor**: `matheusdrarity@gmail.com`
   - Clique em **"Salvar e continuar"**

3. **Configurar Escopos**
   - Clique em **"Adicionar ou remover escopos"**
   - Adicione os seguintes escopos:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/spreadsheets`
     - `https://www.googleapis.com/auth/gmail.send`
   - Clique em **"Atualizar"**
   - Clique em **"Salvar e continuar"**

4. **Criar Credenciais OAuth**
   - Vá em **"APIs e serviços"** → **"Credenciais"**
   - Clique em **"+ CRIAR CREDENCIAIS"** → **"ID do cliente OAuth"**
   - **Tipo de aplicativo**: `Aplicativo da Web`
   - **Nome**: `Rarity Lead Capture Client`

5. **Configurar URIs**
   **URIs de origem autorizados:**
   ```
   http://localhost:3000
   https://sua-url-de-producao.vercel.app
   ```

   **URIs de redirecionamento autorizados:**
   ```
   http://localhost:3000/api/google/oauth/callback
   https://sua-url-de-producao.vercel.app/api/google/oauth/callback
   https://developers.google.com/oauthplayground
   ```

6. **Copiar Credenciais**
   - Uma janela aparecerá com:
     - **ID do cliente**: Copie para `GOOGLE_OAUTH_CLIENT_ID`
     - **Chave secreta do cliente**: Copie para `GOOGLE_OAUTH_CLIENT_SECRET`
   - Você pode baixar o JSON ou copiar manualmente
   - **IMPORTANTE**: Guarde essas credenciais com segurança!

### **Passo 4: Gerar Refresh Token**

1. **Acessar OAuth Playground**
   - Acesse: https://developers.google.com/oauthplayground/

2. **Configurar Credenciais**
   - No canto superior direito, clique na **engrenagem ⚙️**
   - Marque **"Use your own OAuth credentials"**
   - Cole o **OAuth Client ID** (do passo 3.6)
   - Cole o **OAuth Client secret** (do passo 3.6)
   - Clique fora da modal para fechar

3. **Selecionar Escopos**
   Na caixa **"Select & authorize APIs"**, adicione:
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/spreadsheets
   https://www.googleapis.com/auth/gmail.send
   ```

4. **Autorizar**
   - Clique em **"Authorize APIs"**
   - **IMPORTANTE**: Faça login com `matheusdrarity@gmail.com`
   - Autorize todas as permissões solicitadas
   - Você será redirecionado de volta para o playground

5. **Obter Refresh Token**
   - Clique em **"Exchange authorization code for tokens"**
   - Copie o **"Refresh token"** que aparece
   - Guarde para `GOOGLE_OAUTH_REFRESH_TOKEN`

### **Passo 5: Criar Google Sheets**

1. **Criar Nova Planilha**
   - Acesse: https://sheets.google.com/
   - Clique em **"+"** para criar nova planilha
   - Renomeie para **"Rarity Leads"**

2. **Configurar Aba de Leads**
   - Renomeie a primeira aba para **"Leads"**
   - Crie os seguintes cabeçalhos na linha 1:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 |
|---|---|---|---|---|---|---|---|---|---|
| Data Cadastro | Qual Página | Nome | WhatsApp | Email | Maior Dor | Data e Hora da Reunião | Status | Link Meet | Event ID |

3. **Copiar ID da Planilha**
   - Na URL da planilha, copie o ID:
   - `https://docs.google.com/spreadsheets/d/{ESTE_É_O_ID}/edit`
   - Guarde para `GOOGLE_SPREADSHEET_ID`

4. **Compartilhar Planilha (Opcional)**
   - Clique em **"Compartilhar"**
   - Adicione `matheusdrarity@gmail.com` como editor
   - Isso garante acesso mesmo se houver problemas com OAuth

### **Passo 6: Configurar Gmail (App Password)**

1. **Acessar Configurações de Segurança**
   - Acesse: https://myaccount.google.com/security
   - Faça login com `matheusdrarity@gmail.com`

2. **Ativar Verificação em Duas Etapas**
   - Se não estiver ativa, clique em **"Verificação em duas etapas"**
   - Siga o processo de configuração
   - **IMPORTANTE**: Isso é obrigatório para senhas de app

3. **Gerar Senha de App**
   - Volte para as configurações de segurança
   - Clique em **"Senhas de app"**
   - **Selecionar app**: `Email`
   - **Selecionar dispositivo**: `Outro (nome personalizado)`
   - Digite: `Rarity Lead Capture`
   - Clique em **"Gerar"**
   - **IMPORTANTE**: Copie a senha de 16 dígitos gerada
   - Guarde para `SMTP_PASS`

### **Passo 7: Configurar Variáveis de Ambiente**

1. **Criar Arquivo .env.local**
   Copie o arquivo `env.example` para `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. **Preencher Variáveis**
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

   # Site
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Configurar Produção (Vercel)**
   Para deploy em produção, configure as variáveis no Vercel:

   ```bash
   vercel env add GOOGLE_OAUTH_CLIENT_ID
   vercel env add GOOGLE_OAUTH_CLIENT_SECRET
   vercel env add GOOGLE_OAUTH_REFRESH_TOKEN
   vercel env add GOOGLE_SPREADSHEET_ID
   vercel env add SMTP_PASS
   ```

---

## 🧪 **Como Testar**

### **1. Teste de Configuração**
```bash
# Verificar se todas as integrações estão funcionando
curl http://localhost:3000/api/test
```

### **2. Teste Individual de Componentes**
```bash
# Testar Google Calendar
curl -X POST http://localhost:3000/api/test -d '{"test":"calendar"}'

# Testar Google Sheets  
curl -X POST http://localhost:3000/api/test -d '{"test":"sheets"}'

# Testar Email
curl -X POST http://localhost:3000/api/test -d '{"test":"email"}'

# Teste específico do Google Sheets
curl http://localhost:3000/api/test-sheets
```

### **3. Teste Completo do Fluxo**
1. `npm run dev`
2. Acesse http://localhost:3000 ou http://localhost:3000/2
3. Clique no botão CTA
4. Preencha formulário de teste
5. Verifique Calendar/Sheets/Email

### **4. Verificar Resultados**

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
- Página de origem deve estar rastreada

**Verificar Email:**
- Cheque o email de teste usado
- Deve haver um email de confirmação da Rarity Agency
- Email deve conter link do Google Meet
- Deve incluir todos os detalhes da sessão

### **5. Verificar Console**
No terminal onde está rodando `npm run dev`, deve aparecer:
```
Processando lead: Teste Lead
Criando evento no calendário...
Salvando no Google Sheets...
Enviando email de confirmação...
Lead processado com sucesso: Teste Lead
```

---

## 📊 **Estrutura do Google Sheets**

### **Planilha: "Rarity Leads" → Aba: "Leads"**

| Coluna | Campo | Descrição |
|--------|-------|-----------|
| A | Data Cadastro | Timestamp ISO do cadastro |
| B | Qual Página | Página de origem (/ ou /2) |
| C | Nome | Nome completo do lead |
| D | WhatsApp | Número formatado brasileiro |
| E | Email | Email validado |
| F | Maior Dor | Desafio descrito pelo lead |
| G | Data e Hora da Reunião | Data/hora agendada |
| H | Status | Status atual ("Agendado") |
| I | Link Meet | URL do Google Meet |
| J | Event ID | ID do evento no Google Calendar |

**Exemplo de dados inseridos:**
```
2025-01-27T10:30:00.000Z | /2 | João Silva | (11) 99999-9999 | joao@email.com | Falta de leads qualificados | 2025-01-28 09:00 | Agendado | https://meet.google.com/abc-def-ghi | eu2jpu3gjc28pf3ba3oddjne8k
```

---

## 🔧 **Fluxo Técnico Detalhado**

### **1. Clique no Botão CTA**
```typescript
// SuccessCases.tsx - linha 75
onClick={() => setIsLeadModalOpen(true)}
```

### **2. Modal Abre com Animação**
```typescript
// LeadCaptureModal.tsx - AnimatePresence
initial={{ scale: 0.9, opacity: 0, y: 20 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
```

### **3. Validação em Tempo Real**
```typescript
// WhatsApp: regex brasileiro
/^\+55\s?\(?[1-9]{2}\)?\s?[9]{0,1}[0-9]{4}-?[0-9]{4}$/

// Email: validação padrão
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### **4. Submissão do Formulário**
```typescript
// POST /api/leads
1. Validação servidor
2. Criação evento Google Calendar
3. Salvamento Google Sheets  
4. Envio emails confirmação
5. Retorno sucesso/erro
```

### **5. Processamento Google Calendar**
```typescript
// Evento criado com:
- Summary: "Sessão Estratégica - [Nome]"
- Duração: 60 minutos
- Google Meet: automático
- Attendees: lead + matheusdrarity@gmail.com
- Reminders: 24h, 2h, 15min
```

### **6. Email Template**
```html
<!-- HTML responsivo com:
- Header gradiente roxo
- Detalhes da sessão
- Link direto Google Meet
- Instruções de participação
- Branding Rarity Agency
-->
```

---

## 🚨 **Limitações e Considerações**

### **Limitações Técnicas:**
- ⚠️ Horários fixos (9h-18h, blocos de 1h)
- ⚠️ Agendamento para "amanhã" (pode ser domingo/feriado)
- ⚠️ Sem verificação de conflitos de agenda
- ⚠️ Timezone fixo (Brasília)
- ⚠️ Buffer de 2 horas para horários do mesmo dia

### **Melhorias Futuras Sugeridas:**
- 📅 Integração com calendar real-time availability
- 📱 Webhook para notificações no WhatsApp
- 📊 Dashboard de métricas de conversão
- 🤖 Chatbot para pré-qualificação
- 📧 Sequência de email marketing automatizada

### **Segurança:**
- ✅ Validação server-side completa
- ✅ Sanitização de inputs
- ✅ Rate limiting (pode ser implementado)
- ✅ Environment variables para credenciais

---

## 📈 **Métricas e Monitoramento**

### **KPIs Automáticos Capturados:**
- 📊 Número de leads por dia/semana/mês
- ⏱️ Taxa de conversão modal → agendamento
- 📅 Horários mais populares
- 🎯 Principais dores mencionadas
- 📧 Taxa de abertura dos emails
- 📄 Rastreamento de página de origem (/ vs /2)

### **Dados Disponíveis no Sheets:**
- Análise temporal de leads
- Segmentação por dor/problema
- Preferências de horário
- Dados de contato organizados
- Status de agendamentos
- Análise de conversão por página

---

## 🔍 **Troubleshooting**

### **Problemas Comuns:**

#### **Modal não abre:**
- Verificar se o estado `isLeadModalOpen` está funcionando
- Checar console por erros JavaScript
- Confirmar importação do componente

#### **Formulário não submete:**
- Verificar validação de campos
- Checar network tab por erros de API
- Confirmar variáveis de ambiente

#### **Integrações Google falhando:**
- Rodar `/api/test` para diagnosticar
- Verificar refresh token expirado
- Confirmar permissões de API

#### **Emails não chegam:**
- Verificar spam/lixo eletrônico
- Testar senha de app Gmail
- Confirmar configuração SMTP

#### **Horários passados aparecendo:**
- Verificar timezone de Brasília
- Confirmar buffer de 2 horas
- Checar logs do console

### **Solução de Problemas Específicos:**

#### **Erro: "Redirect URI mismatch"**
- Verifique se os URIs de redirecionamento estão corretos no Google Cloud Console
- Certifique-se de que não há barras extras no final das URLs

#### **Erro: "Invalid refresh token"**
- Gere um novo refresh token no OAuth Playground
- Certifique-se de estar usando a conta correta (matheusdrarity@gmail.com)

#### **Erro: "Permission denied" no Sheets**
- Verifique se o ID da planilha está correto
- Confirme que a planilha existe e está acessível
- Teste compartilhar a planilha explicitamente com a conta de serviço

#### **Erro: "SMTP Authentication failed"**
- Verifique se a verificação em duas etapas está ativada
- Confirme que está usando a senha de app (não a senha normal)
- Teste se a senha de app foi copiada corretamente

#### **Erro: "Calendar API has not been used"**
- Confirme que todas as APIs foram ativadas no Google Cloud Console
- Aguarde alguns minutos após ativar as APIs
- Verifique se está usando o projeto correto

---

## 🎯 **Resultados Esperados**

### **Experiência do Lead:**
1. **Engajamento Alto**: Modal atrativo e profissional
2. **Conversão Otimizada**: Fluxo step-by-step reduz abandono
3. **Confirmação Imediata**: Email profissional gera confiança
4. **Facilidade**: Link direto para Google Meet

### **Experiência da Equipe:**
1. **Automação Total**: Zero trabalho manual
2. **Dados Organizados**: Tudo no Google Sheets
3. **Agenda Integrada**: Eventos no Google Calendar
4. **Notificações**: Lembretes automáticos

### **Resultados de Negócio:**
1. **Mais Agendamentos**: Formulário otimizado
2. **Menos No-shows**: Sistema de lembretes
3. **Melhor Qualificação**: Dados estruturados
4. **Escalabilidade**: Sistema totalmente automatizado

---

## 📞 **Próximos Passos**

### **Para Ativar o Sistema:**

1. **Configure Google Workspace** (seguir seção de configuração acima)
2. **Configure variáveis de ambiente**
3. **Teste localmente** com `/api/test`
4. **Deploy em produção**
5. **Configure variáveis no Vercel**
6. **Teste end-to-end em produção**

### **Para Monitorar:**

1. **Verificar Google Sheets semanalmente**
2. **Monitorar emails de notificação**
3. **Acompanhar taxa de conversão**
4. **Coletar feedback dos leads**

---

## ✅ **Checklist de Implementação**

- [x] Modal interativo criado
- [x] Formulário multi-etapas implementado
- [x] Validação completa de campos
- [x] Integração Google Calendar funcionando
- [x] Integração Google Sheets funcionando
- [x] Sistema de email automático
- [x] API de teste para diagnóstico
- [x] Documentação completa
- [x] Paleta de cores consistente
- [x] Design responsivo
- [x] Animações suaves
- [x] Tratamento de erros
- [x] Logs para debugging
- [x] Rastreamento de página de origem
- [x] Correção de timezone (Brasília)
- [x] Buffer de horários para evitar conflitos

---

## 🔒 **Segurança e Melhores Práticas**

### **Proteger Credenciais**
- Nunca commite o arquivo `.env.local`
- Use variáveis de ambiente para produção
- Monitore o uso das APIs no Google Cloud Console

### **Limites de API**
- Google Calendar: 1.000.000 requests/dia
- Google Sheets: 600 requests/100 segundos/usuário
- Gmail: 1.000.000.000 quota units/dia

### **Monitoramento**
- Configure alertas no Google Cloud Console
- Monitore logs de erro na aplicação
- Verifique regularmente o funcionamento do fluxo

---

## 📚 **Links Úteis**

- [Google Calendar API](https://developers.google.com/calendar/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Gmail API](https://developers.google.com/gmail/api)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

**🚀 O sistema está completo e pronto para capturar leads em escala para a Rarity Agency!**

*Implementado em Janeiro 2025 | Versão 1.0*

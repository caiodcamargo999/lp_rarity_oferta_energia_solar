# Guia de Integração com Go High Level

## 🎯 Visão Geral

Esta integração permite que todos os leads capturados pelo formulário da landing page sejam automaticamente:
- Criados como contatos no Go High Level
- Adicionados ao pipeline específico da sua subconta
- Organizados com tags e campos customizados
- Convertidos em oportunidades com valor monetário

## 🔧 Configuração Rápida

### 1. Obter Credenciais do Go High Level

**1.1. API Key:**
1. Acesse sua subconta: `https://app.3a3r.com/v2/location/SORzJGuoZ25WsfiJPg3b/`
2. Vá em `Settings` → `Integrations` → `API Keys`
3. Clique em `Create API Key`
4. Nome: "Landing Page Integration"
5. Scopes necessários:
   - `contacts.write` (criar/atualizar contatos)
   - `opportunities.write` (criar oportunidades)
   - `locations.read` (ler informações da subconta)
6. Copie a API Key gerada

**1.2. Location ID:**
- Na URL da sua subconta: `https://app.3a3r.com/v2/location/SORzJGuoZ25WsfiJPg3b/`
- O Location ID é: `SORzJGuoZ25WsfiJPg3b`

**1.3. Pipeline ID e Stage ID:**
1. Acesse: `https://app.3a3r.com/v2/location/SORzJGuoZ25WsfiJPg3b/opportunities/list`
2. Vá em `Settings` → `Opportunities` → `Pipelines`
3. Selecione o pipeline onde quer adicionar os leads
4. Copie o Pipeline ID da URL ou configurações
5. Clique na primeira etapa (stage) do pipeline
6. Copie o Stage ID

### 2. Configurar Variáveis de Ambiente

Adicione no seu `.env.local`:

```bash
# Go High Level
GHL_API_KEY=sua-api-key-aqui
GHL_LOCATION_ID=SORzJGuoZ25WsfiJPg3b
GHL_PIPELINE_ID=seu-pipeline-id
GHL_STAGE_ID=seu-stage-id
```

### 3. Testar Integração

```bash
# Testar conexão
curl http://localhost:3000/api/test-ghl

# Testar criação de lead
curl -X POST http://localhost:3000/api/test-ghl
```

## 🚀 Fluxo Automatizado

### Quando um lead preenche o formulário:

1. **Contato criado/atualizado no GHL:**
   - Nome completo dividido em primeiro/último nome
   - Email e telefone salvos
   - Tags adicionadas automaticamente:
     - "Landing Page"
     - "Página v1" ou "Página v2" 
     - "Tem Orçamento" ou "Sem Orçamento"

2. **Campos customizados preenchidos:**
   - `maior_dor`: Principal desafio mencionado
   - `tem_orcamento`: "sim" ou "não"
   - `pagina_origem`: "/" ou "/2"
   - `data_hora_agendamento`: Horário agendado ou "Não agendado"

3. **Oportunidade criada no pipeline:**
   - Nome: "João Silva - Com Orçamento"
   - Valor: R$ 25.000 (se tem orçamento) ou R$ 0
   - Notas com todos os detalhes do lead
   - Status: "Aberto"

## 📊 Dados Capturados

### Informações do Contato:
- ✅ Nome completo
- ✅ Email 
- ✅ WhatsApp (apenas números)
- ✅ Fonte: "Landing Page - /2"
- ✅ Timezone: "America/Sao_Paulo"

### Tags Automáticas:
- ✅ "Landing Page"
- ✅ "Página v1" ou "Página v2"
- ✅ "Tem Orçamento" ou "Sem Orçamento"

### Oportunidade:
- ✅ Pipeline específico da sua subconta
- ✅ Valor monetário baseado no orçamento
- ✅ Notas completas com detalhes
- ✅ Status: Aberto

## 🔧 Deploy em Produção

### Vercel:
```bash
vercel env add GHL_API_KEY production [SUA_API_KEY]
vercel env add GHL_LOCATION_ID production SORzJGuoZ25WsfiJPg3b  
vercel env add GHL_PIPELINE_ID production [SEU_PIPELINE_ID]
vercel env add GHL_STAGE_ID production [SEU_STAGE_ID]
vercel --prod
```

### Outras plataformas:
Configure as mesmas variáveis de ambiente na sua plataforma de deploy.

## ✅ Verificar Funcionamento

1. **Preencha o formulário** na landing page
2. **Verifique no GHL** se o contato foi criado
3. **Confira o pipeline** se a oportunidade apareceu
4. **Analise as tags** aplicadas ao contato

## 🚨 Troubleshooting

### Erro: "GHL_API_KEY não está configurado"
- Verifique se a variável está definida no `.env.local`
- Confirme se a API Key está correta

### Erro: "Falha ao criar contato"
- Verifique se os scopes da API Key estão corretos
- Teste a conexão com: `curl http://localhost:3000/api/test-ghl`

### Lead não aparece no pipeline:
- Confirme se Pipeline ID e Stage ID estão corretos
- Verifique se o pipeline existe e está ativo

### Contato duplicado:
- O sistema atualiza contatos existentes automaticamente
- Use o email como identificador único

## 📈 Resultados Esperados

- ✅ **100% automação** na captura de leads
- ✅ **Leads organizados** no seu pipeline específico
- ✅ **Dados estruturados** com tags e campos customizados
- ✅ **Oportunidades criadas** com valor monetário
- ✅ **Processo totalmente automatizado**
- ✅ **Backup dos dados** no Google Sheets mantido

## 🔍 Endpoints de Teste

### Testar Conexão:
```bash
GET /api/test-ghl
```

### Testar Criação de Lead:
```bash
POST /api/test-ghl
```

### Testar Formulário Completo:
```bash
POST /api/leads
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "whatsapp": "(11) 99999-9999",
  "painPoint": "Falta de leads qualificados",
  "budget": "Sim, tenho.",
  "scheduledDate": "2025-01-28",
  "scheduledTime": "09:00",
  "sourcePage": "/2"
}
```

## 📋 Checklist de Implementação

- [ ] API Key do GHL configurada
- [ ] Location ID configurado
- [ ] Pipeline ID configurado
- [ ] Stage ID configurado
- [ ] Teste de conexão funcionando
- [ ] Teste de criação de lead funcionando
- [ ] Formulário da landing page testado
- [ ] Lead aparece no pipeline do GHL
- [ ] Tags aplicadas corretamente
- [ ] Campos customizados preenchidos

---

**🎉 Pronto! Agora todos os leads do formulário vão automaticamente para o seu pipeline no Go High Level!**

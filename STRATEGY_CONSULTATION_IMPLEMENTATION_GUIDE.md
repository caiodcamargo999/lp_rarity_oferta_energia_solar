# FUNIL DE ESTRATÉGIA & CONSULTORIA: GUIA COMPLETO DE IMPLEMENTAÇÃO

## 🎯 **Visão Geral**
Este guia mostra como implementar um funil completo de captura de leads para serviços de Estratégia & Consultoria da Rarity Agency Brasil, incluindo:
- Formulário multi-etapas com acompanhamento de progresso
- Integração com Google Calendar usando OAuth 2.0
- Coleta de dados no Google Sheets
- Lembretes automáticos por email
- Redirecionamento para WhatsApp para não-investidores
- Design responsivo e otimizado para o mercado brasileiro

---

## 📁 **Estrutura de Arquivos**

### **🎯 Componentes Principais:**
```
components/
├── LeadCaptureModal.tsx          # Modal principal do funil
├── ui/                           # Componentes de UI (botões, cards, diálogos)
```

### **🌐 Páginas e Rotas:**
```
app/
├── layout.tsx                    # Layout principal
├── page.tsx                      # Página principal com botão do funil
└── globals.css                   # Estilos globais
```

### **🔌 APIs e Integrações:**
```
app/api/
├── calendar/                     # Disponibilidade e agendamento
│   └── route.ts
├── email/                        # Envio de emails
│   └── route.ts
├── email-sequence/               # Lembretes automáticos
│   └── route.ts
├── leads/                        # Armazenamento de leads
│   └── route.ts
└── google/oauth/                 # Autenticação OAuth
    ├── route.ts                  # Início da autenticação
    └── callback/route.ts         # Callback OAuth
```

### **📚 Bibliotecas e Utilitários:**
```
lib/
├── email-templates.ts            # Templates de email minimalistas
├── google-services.ts            # Integração com APIs do Google
└── types.ts                     # Definições TypeScript
```

### **⚙️ Configurações:**
```
├── vercel.json                  # Configuração cron para lembretes
├── tailwind.config.ts           # Configuração do Tailwind CSS
└── .env.local                   # Variáveis de ambiente
```

---

## 🚀 **Implementação Passo a Passo**

### **Passo 1: Configuração do Projeto**
```bash
# Criar projeto Next.js
npx create-next-app@latest funil-rarity-agency --typescript --tailwind --app

# Instalar dependências
npm install framer-motion react-hook-form @hookform/resolvers zod
npm install googleapis nodemailer
npm install @types/nodemailer --save-dev
```

### **Passo 2: Criar Estrutura Básica da Página**
```tsx
// app/page.tsx
import { useState } from 'react';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';

export default function HomePage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  
  return (
    <main>
      <Card onClick={() => setIsLeadModalOpen(true)}>
        <h2>Estratégia & Consultoria</h2>
        <p>Obtenha estratégias personalizadas de IA, automação e escalabilidade de negócios.</p>
        <span>Agendar Consultoria Estratégica →</span>
      </Card>
      
      <LeadCaptureModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </main>
  );
}
```

### **Passo 3: Criar Modal de Captura de Leads**
```tsx
// components/LeadCaptureModal.tsx
export function LeadCaptureModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  
  const formSteps = [
    { id: 'intro', title: 'Introdução' },
    { id: 'name', title: 'Nome', field: 'name' },
    { id: 'whatsapp', title: 'WhatsApp', field: 'whatsapp' },
    { id: 'email', title: 'Email', field: 'email' },
    { id: 'instagram', title: 'Instagram', field: 'instagram' },
    { id: 'industry', title: 'Setor', field: 'industry' },
    { id: 'struggle', title: 'Principal Desafio', field: 'struggle' },
    { id: 'budget', title: 'Orçamento', field: 'budget' },
    { id: 'budgetAmount', title: 'Valor do Orçamento', field: 'budgetAmount' },
    { id: 'calendar', title: 'Agendar Chamada', field: 'scheduledDateTime' }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
        </div>
        
        {/* Conteúdo da etapa atual */}
        <div>{renderCurrentStep()}</div>
        
        {/* Navegação */}
        <div className="flex justify-between">
          <Button onClick={handleBack}>Voltar</Button>
          <Button onClick={handleNext}>Próximo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### **Passo 4: Implementar Lógica do Formulário**
```tsx
const handleNext = async () => {
  // Validar campo atual
  const currentField = formSteps[currentStep].field;
  if (currentField) {
    const isValid = await trigger(currentField);
    if (!isValid) return;
  }
  
  // Lógica especial para etapa de orçamento
  if (currentStepData.id === 'budget' && watchedValues['budget'] === 'no') {
    // Salvar dados do lead automaticamente
    await saveLeadData();
    // Redirecionar para WhatsApp
    redirectToWhatsApp();
    return;
  }
  
  // Próxima etapa regular
  if (currentStep < formSteps.length - 1) {
    setCurrentStep(currentStep + 1);
  }
};
```

### **Passo 5: Integração com Google Calendar**
```tsx
// lib/google-services.ts
export async function createEvent(eventData) {
  const auth = await getGoogleAuth();
  const calendar = google.calendar({ version: 'v3', auth });
  
  const event = {
    summary: `Consultoria Estratégica com ${eventData.name}`,
    start: { dateTime: eventData.startTime, timeZone: eventData.timezone },
    end: { dateTime: eventData.endTime, timeZone: eventData.timezone },
    attendees: [
      { email: eventData.email },
      { email: 'caiorarity@gmail.com' }
    ],
    conferenceData: {
      createRequest: { requestId: uuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
    }
  };
  
  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });
    
    return response.data;
  } catch (error) {
    console.error('Falha na criação do evento no calendário:', error);
    throw error;
  }
}
```

### **Passo 6: Configuração do Google OAuth**
```tsx
// app/api/google/oauth/route.ts
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.email'
];

export async function GET() {
  const oAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  );
  
  const url = oAuth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  
  return NextResponse.redirect(url);
}
```

### **Passo 7: Armazenamento de Dados dos Leads**
```tsx
// app/api/leads/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  try {
    const auth = await getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const values = [
      [
        data.name,
        data.whatsapp,
        data.email,
        data.instagram,
        data.industry,
        data.struggle,
        data.budget === 'yes' ? `R$ ${data.budgetAmount}` : 'sem orçamento',
        data.scheduledDateTime || '',
        new Date().toISOString()
      ]
    ];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:I',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Falha ao salvar lead:', error);
    return NextResponse.json({ error: 'Falha ao salvar lead' }, { status: 500 });
  }
}
```

### **Passo 8: Sistema de Email**
```tsx
// lib/email-templates.ts
export function generateConfirmationEmail(data) {
  return {
    subject: 'Sua consultoria estratégica foi confirmada - Rarity Agency Brasil',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 640px; margin: 0 auto; padding: 24px; }
            .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; }
            .button { background: #111827; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <h2>Sua consultoria estratégica foi confirmada</h2>
              <p>Olá ${data.name}, obrigado por agendar sua sessão de Estratégia & Consultoria com a Rarity Agency Brasil.</p>
              <div>Quando: ${data.scheduledTime}</div>
              <div>Onde: Google Meet</div>
              <a class="button" href="{{MEETING_LINK}}">Entrar na chamada</a>
              <p>Qualquer dúvida, entre em contato conosco pelo Instagram: <a href="https://www.instagram.com/rarity.brasil/">@rarity.brasil</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}
```

### **Passo 9: Lembretes Automáticos**
```tsx
// app/api/email-sequence/route.ts
export async function GET() {
  try {
    const auth = await getGoogleAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Obter eventos próximos
    const now = new Date();
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h a partir de agora
    
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    const events = response.data.items || [];
    
    for (const event of events) {
      const startTime = new Date(event.start.dateTime);
      const timeUntilEvent = startTime.getTime() - now.getTime();
      const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60);
      
      // Enviar lembrete apropriado
      if (hoursUntilEvent <= 2 && hoursUntilEvent > 1.5) {
        await sendReminder(event, '2h');
      } else if (hoursUntilEvent <= 0.25 && hoursUntilEvent > 0) {
        await sendReminder(event, '15min');
      }
    }
    
    return NextResponse.json({ success: true, eventsProcessed: events.length });
  } catch (error) {
    console.error('Erro na sequência de emails:', error);
    return NextResponse.json({ error: 'Falha ao processar lembretes' }, { status: 500 });
  }
}
```

---

## 🔧 **Variáveis de Ambiente**
```bash
# .env.local
GOOGLE_OAUTH_CLIENT_ID=seu_client_id
GOOGLE_OAUTH_CLIENT_SECRET=seu_client_secret
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=seu_refresh_token

GOOGLE_SPREADSHEET_ID=seu_spreadsheet_id
GOOGLE_CALENDAR_ID=seu_calendar_id

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
MAIL_FROM=seu_email@gmail.com
```

---

## 📋 **Lista de Verificação de Testes**
- [ ] Validação do formulário funciona para todos os campos
- [ ] Barra de progresso atualiza corretamente
- [ ] Redirecionamento para WhatsApp funciona para usuários "sem orçamento"
- [ ] Criação de evento no Google Calendar é bem-sucedida
- [ ] Link do Google Meet é gerado
- [ ] Dados do lead são salvos no Google Sheets
- [ ] Notificações por email são enviadas
- [ ] Lembretes automáticos funcionam (24h, 2h, 15min)
- [ ] Design responsivo funciona bem em dispositivos móveis
- [ ] Integração com Instagram da Rarity Agency Brasil

---

## 🚀 **Deploy**
```bash
# Build e deploy
npm run build
npm run start

# Ou deploy na Vercel
vercel --prod
```

---

## 📚 **Principais Funcionalidades Implementadas**
1. **Formulário multi-etapas** com acompanhamento de progresso
2. **Lógica inteligente de orçamento** com redirecionamento para WhatsApp
3. **Integração com Google Calendar** usando OAuth 2.0
4. **Coleta de dados no Google Sheets**
5. **Lembretes automáticos por email**
6. **Design responsivo otimizado para o mercado brasileiro**
7. **Templates de email profissionais**
8. **Verificação de disponibilidade em tempo real**
9. **Qualificação e roteamento de leads**
10. **Integração com a marca Rarity Agency Brasil**

Esta implementação fornece um sistema completo e profissional de captura de leads que pode ser facilmente personalizado e escalado para diferentes necessidades de negócios da Rarity Agency Brasil no mercado brasileiro.

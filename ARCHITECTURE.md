# Rarity Agency Landing Page - Documentação de Arquitetura

## 🚨 **REGRAS MÁXIMAS - NUNCA VIOLAR**

### **REGRA MÁXIMA #1: COPY E DESIGN SAGRADOS**
- ❌ **NUNCA** altere copy, textos, design ou layout sem autorização **EXPLÍCITA** do usuário
- ❌ **NUNCA** mude cores, fontes, espaçamentos ou elementos visuais
- ❌ **NUNCA** altere o conteúdo textual das seções
- ❌ **NUNCA** modifique a estrutura visual da página
- ✅ **SEMPRE** mantenha o design e copy exatamente como especificado
- ✅ **SEMPRE** peça permissão antes de qualquer mudança visual/textual
- ✅ **SEMPRE** implemente apenas funcionalidades técnicas solicitadas

---

## 🏗️ **Visão Geral da Arquitetura**

Este documento descreve a arquitetura técnica, padrões de design e decisões arquiteturais para o projeto Rarity Agency Landing Page.

---

## 🎯 **Princípios Arquiteturais**

### **1. Performance Primeiro**
- **Next.js 14 App Router** para performance e SEO otimizados
- **Compilador SWC** para builds e desenvolvimento rápidos
- **Otimização de Imagens** com suporte WebP/AVIF
- **Divisão de Código** para entrega eficiente de bundles

### **2. Escalabilidade e Manutenibilidade**
- **Arquitetura Baseada em Componentes** com separação clara de responsabilidades
- **TypeScript** para segurança de tipos e melhor experiência do desenvolvedor
- **CSS Modular** com classes utilitárias do Tailwind CSS
- **Estrutura de Arquivos Consistente** seguindo convenções do Next.js

### **3. Experiência do Usuário**
- **Aprimoramento Progressivo** com degradação graciosa
- **Abordagem Acessibilidade Primeiro** (conformidade WCAG 2.1 AA)
- **Design Responsivo** com metodologia mobile-first
- **Animações Suaves** usando Framer Motion

---

## 🏛️ **Arquitetura do Sistema**

### **Diagrama de Arquitetura de Alto Nível**
```
┌─────────────────────────────────────────────────────────────┐
│                    Navegador Cliente                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Aplicação Next.js                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   App Router    │  │   Componentes   │  │   Estilos   │ │
│  │                 │  │                 │  │             │ │
│  │ • Layout        │  │ • Componentes UI│  │ • Tailwind  │ │
│  │ • Páginas       │  │ • Formulários   │  │ • Custom    │ │
│  │ • Rotas API     │  │ • Animações     │  │ • Responsivo│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Serviços Externos                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Google Fonts  │  │   Chakra UI     │  │   Lucide    │ │
│  │                 │  │                 │  │   Ícones    │ │
│  │ • Fonte Poppins │  │ • Componentes UI│  │ • Ícones SVG│ │
│  │ • Fontes Web    │  │ • Sistema Tema  │  │ • Otimizado │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 **Arquitetura da Estrutura do Projeto**

### **Organização de Diretórios**
```
rarity-agency-landing-page/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Componente de layout raiz
│   ├── page.tsx                 # Componente da página inicial
│   ├── strategy-call/           # Rota de captura de leads
│   │   └── page.tsx            # Página de chamada estratégica
│   └── globals.css              # Estilos globais
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes UI base
│   │   └── Button.tsx          # Componente de botão customizado
│   └── LeadCaptureForm.tsx     # Formulário multi-etapas
├── public/                       # Ativos estáticos
│   └── rarity_logo.png         # Logo da agência
├── lib/                         # Funções utilitárias (futuro)
├── types/                       # Definições TypeScript (futuro)
├── styles/                      # Estilos adicionais (futuro)
└── config/                      # Arquivos de configuração
```

### **Convenções de Nomenclatura de Arquivos**
- **Componentes**: PascalCase (ex: `LeadCaptureForm.tsx`)
- **Páginas**: minúsculas com hífens (ex: `strategy-call/page.tsx`)
- **Utilitários**: camelCase (ex: `formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_ENDPOINTS.ts`)

---

## 🧩 **Arquitetura de Componentes**

### **Hierarquia de Componentes**
```
Layout da Aplicação
├── Cabeçalho (Logo)
├── Conteúdo Principal
│   ├── Seção Hero
│   ├── Seção de Vídeo
│   ├── Seção CTA
│   └── Casos de Sucesso
├── Formulário de Captura de Leads
│   ├── Etapa de Introdução
│   ├── Etapa de Detalhes do Negócio
│   └── Etapa de Agendamento da Chamada
└── Rodapé
```

### **Padrões de Design de Componentes**

#### **1. Padrão Container/Apresentacional**
```tsx
// Componente Container (Lógica)
export default function StrategyCallPage() {
  const [currentStep, setCurrentStep] = useState(0)
  
  return (
    <LeadCaptureForm 
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  )
}

// Componente Apresentacional (UI)
export default function LeadCaptureForm({ currentStep, setCurrentStep }) {
  // Renderização pura da UI
}
```

#### **2. Padrão de Componente Composto**
```tsx
// Implementação futura para etapas do formulário
<Form>
  <Form.Step title="Introdução">
    <IntroductionContent />
  </Form.Step>
  <Form.Step title="Detalhes">
    <BusinessDetailsForm />
  </Form.Step>
</Form>
```

#### **3. Padrão Render Props**
```tsx
// Para gerenciamento complexo de estado
<FormStateProvider>
  {(formState, updateForm) => (
    <LeadCaptureForm 
      state={formState}
      onUpdate={updateForm}
    />
  )}
</FormStateProvider>
```

---

## 🎨 **Arquitetura de Estilos**

### **Camadas da Arquitetura CSS**
```
1. Tailwind CSS (Classes Utilitárias)
   ├── Utilitários base (cores, espaçamento, tipografia)
   ├── Utilitários de componentes (botões, formulários, cards)
   └── Utilitários responsivos (breakpoints)

2. CSS Customizado (globals.css)
   ├── Variáveis CSS (propriedades customizadas)
   ├── Estilos globais (body, html)
   ├── Animações customizadas (keyframes)
   └── Sobrescritas do navegador (scrollbar, foco)

3. Estilos específicos de componentes
   ├── Classes Tailwind no JSX
   ├── Estilos dinâmicos com CSS-in-JS
   └── Utilitários de design responsivo
```

### **Sistema de Design Tokens**
```css
:root {
  /* Cores */
  --primary-500: #8A2BE2;
  --secondary-500: #DA70D6;
  --text-primary: #F5F5F5;
  --text-secondary: #b0b0b0;
  
  /* Espaçamento */
  --spacing-xs: 0.2rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Tipografia */
  --font-family: 'Poppins', sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}
```

---

## 🔄 **Arquitetura de Gerenciamento de Estado**

### **Gerenciamento de Estado Local**
```tsx
// Estado de nível de componente
const [formData, setFormData] = useState<FormData>({
  name: '',
  email: '',
  budget: 'yes'
})

// Estado de validação do formulário
const [errors, setErrors] = useState<FormErrors>({})
const [isSubmitting, setIsSubmitting] = useState(false)
```

### **Padrões Futuros de Gerenciamento de Estado**

#### **1. Context API para Estado Global**
```tsx
// Contexto de tema
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
})

// Contexto de formulário
const FormContext = createContext({
  formData: {},
  updateForm: () => {},
  validateForm: () => {}
})
```

#### **2. Hooks Customizados para Lógica**
```tsx
// Hook de validação de formulário
const useFormValidation = (formData: FormData) => {
  const [errors, setErrors] = useState({})
  
  const validate = useCallback(() => {
    // Lógica de validação
  }, [formData])
  
  return { errors, validate }
}

// Hook de chamada de API
const useApiCall = (endpoint: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const callApi = useCallback(async () => {
    // Lógica da API
  }, [endpoint])
  
  return { data, loading, callApi }
}
```

---

## 🚀 **Arquitetura de Performance**

### **Estratégias de Otimização de Performance**

#### **1. Divisão de Código**
```tsx
// Imports dinâmicos para componentes pesados
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// Divisão de código baseada em rotas (automática com App Router)
```

#### **2. Otimização de Imagens**
```tsx
// Componente Image do Next.js com otimização
<Image
  src="/rarity_logo.png"
  alt="Logo da Rarity Agency"
  width={1200}
  height={200}
  priority={true} // Otimização LCP
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### **3. Performance de Animações**
```tsx
// Framer Motion com otimizações de performance
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ 
    duration: 0.5,
    ease: "easeOut"
  }}
  layout // Animações de layout otimizadas
  layoutId="unique-id" // Transições de elementos compartilhados
>
  {/* Conteúdo */}
</motion.div>
```

---

## 🔒 **Arquitetura de Segurança**

### **Medidas de Segurança Implementadas**

#### **1. Política de Segurança de Conteúdo**
```tsx
// Headers do next.config.js
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
    ],
  },
]
```

#### **2. Segurança de Formulários**
```tsx
// Sanitização de entrada
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

// Proteção CSRF (implementação futura)
const csrfToken = getCsrfToken()
```

---

## 🧪 **Arquitetura de Testes**

### **Estratégia de Testes**

#### **1. Testes Unitários**
```tsx
// Teste de componentes com React Testing Library
import { render, screen } from '@testing-library/react'
import { LeadCaptureForm } from './LeadCaptureForm'

test('renderiza etapas do formulário corretamente', () => {
  render(<LeadCaptureForm currentStep={0} />)
  expect(screen.getByText('Introdução')).toBeInTheDocument()
})
```

#### **2. Testes de Integração**
```tsx
// Teste do fluxo do formulário
test('completa fluxo completo do formulário', async () => {
  render(<LeadCaptureForm />)
  
  // Preenche etapas do formulário
  await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
  await userEvent.click(screen.getByText('Próximo'))
  
  // Verifica progressão da etapa
  expect(screen.getByText('Detalhes do Negócio')).toBeInTheDocument()
})
```

#### **3. Testes E2E**
```tsx
// Testes E2E com Playwright
test('fluxo de captura de leads', async ({ page }) => {
  await page.goto('/strategy-call')
  await page.fill('[name="name"]', 'Usuário Teste')
  await page.click('text=Próximo')
  await expect(page.locator('text=Detalhes do Negócio')).toBeVisible()
})
```

---

## 📱 **Arquitetura Responsiva**

### **Estratégia de Breakpoints**
```css
/* Abordagem Mobile First */
/* Estilos base (mobile) */
.container { padding: 1rem; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { padding: 3rem; }
}
```

### **Responsividade de Componentes**
```tsx
// Padrões de componentes responsivos
const ResponsiveGrid = () => {
  return (
    <div className="
      grid 
      grid-cols-1           /* Mobile: 1 coluna */
      md:grid-cols-2       /* Tablet: 2 colunas */
      lg:grid-cols-3       /* Desktop: 3 colunas */
      gap-4 md:gap-6 lg:gap-8
    ">
      {/* Itens da grade */}
    </div>
  )
}
```

---

## 🔄 **Arquitetura de Fluxo de Dados**

### **Fluxo de Dados Unidirecional**
```
Ação do Usuário → Evento do Componente → Atualização de Estado → Re-renderização → Atualização da UI
     ↓
Entrada do Formulário → handleInputChange → setFormData → Atualização do Componente → Feedback Visual
```

### **Diagrama de Fluxo de Dados**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Usuário   │───▶│  Componente │───▶│   Estado    │
│   Entrada   │    │             │    │  Atualização│
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐
                    │ Re-renderiza│    │ Atualização │
                    │             │    │     da UI   │
                    └─────────────┘    └─────────────┘
```

---

## 🚀 **Arquitetura de Deploy**

### **Processo de Build**
```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento Next.js

# Build de Produção
npm run build        # Cria diretório .next/
npm run start        # Inicia servidor de produção

# Export Estático (se necessário)
npm run export       # Cria arquivos estáticos
```

### **Opções de Deploy**

#### **1. Vercel (Recomendado)**
```bash
# Deploy automático
vercel --prod

# Variáveis de ambiente
NEXT_PUBLIC_SITE_URL=https://rarityagency.io
```

#### **2. Self-Hosted**
```bash
# Build e deploy
npm run build
npm run start

# Ou use PM2 para gerenciamento de processos
pm2 start npm --name "rarity-agency" -- start
```

---

## 🔮 **Considerações Futuras de Arquitetura**

### **Melhorias de Escalabilidade**
- **Micro-frontends** para funcionalidades complexas
- **Service Workers** para funcionalidade offline
- **Edge Computing** para performance global
- **GraphQL** para busca de dados flexível

### **Aprimoramentos de Performance**
- **Server-Side Rendering** para páginas críticas
- **Static Site Generation** para conteúdo de marketing
- **Incremental Static Regeneration** para conteúdo dinâmico
- **Web Workers** para computações pesadas

### **Monitoramento e Analytics**
- **Rastreamento Core Web Vitals**
- **Implementação de Error Boundary**
- **Integração de monitoramento de performance**
- **Analytics de comportamento do usuário**

---

## 📚 **Registros de Decisões Arquiteturais (ADRs)**

### **ADR-001: Next.js App Router**
**Contexto**: Necessidade de padrões modernos do React e performance otimizada
**Decisão**: Usar Next.js 14 com App Router
**Consequências**: Melhor performance, recursos modernos do React, SEO aprimorado

### **ADR-002: Integração TypeScript**
**Contexto**: Necessidade de segurança de tipos e melhor experiência do desenvolvedor
**Decisão**: Implementação completa do TypeScript
**Consequências**: Melhor qualidade do código, menos bugs, manutenibilidade aprimorada

### **ADR-003: Tailwind CSS + CSS Customizado**
**Contexto**: Necessidade de desenvolvimento rápido e sistema de design customizado
**Decisão**: Abordagem híbrida com utilitários Tailwind e CSS customizado
**Consequências**: Desenvolvimento rápido, design consistente, estilos manuteníveis

---

## 🎯 **Metas e Métricas de Arquitetura**

### **Metas de Performance**
- **Pontuação Lighthouse**: 90+ (Performance, Acessibilidade, Melhores Práticas, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### **Metas de Manutenibilidade**
- **Cobertura de Código**: 80%+ para componentes críticos
- **Tamanho do Bundle**: < 500KB (comprimido)
- **Tempo de Build**: < 2 minutos
- **Tempo de Deploy**: < 5 minutos

---

*Este documento de arquitetura serve como um guia vivo para o projeto Rarity Agency Landing Page. Deve ser atualizado conforme o projeto evolui e novas decisões arquiteturais são tomadas.*

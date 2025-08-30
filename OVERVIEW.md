# Rarity Agency Landing Page - Edição Next.js

## 🚨 **REGRAS MÁXIMAS - NUNCA VIOLAR**

### **REGRA MÁXIMA #1: COPY E DESIGN SAGRADOS**
- ❌ **NUNCA** altere copy, textos, design ou layout sem autorização **EXPLÍCITA** do usuário
- ❌ **NUNCA** mude cores, fontes, espaçamentos ou elementos visuais
- ❌ **NUNCA** altere o conteúdo textual das seções
- ❌ **NUNCA** modifique a estrutura visual da página
- ✅ **SEMPRE** mantenha o design e copy exatamente como especificado
- ✅ **SEMPRE** peça permissão antes de qualquer mudança visual/textual
- ✅ **SEMPRE** implemente apenas funcionalidades técnicas solicitadas

### **REGRA MÁXIMA #2: IMPLEMENTAÇÃO TÉCNICA APENAS**
- ✅ Implementar apenas funcionalidades técnicas solicitadas
- ✅ Otimizações de performance (sem alterar visual)
- ✅ Lógica de programação (sem alterar conteúdo)
- ✅ Estrutura de código (sem alterar design)
- ✅ Funcionalidades de backend (sem alterar frontend)

---

Uma landing page moderna e de alta performance para a Rarity Agency - Para venda de serviço de marketing para empresas de energia solar no Bra, construída com tecnologias de ponta para experiência de usuário e performance de SEO otimizadas.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Sistema de Design Customizado
- **Componentes UI**: Chakra UI + Componentes Customizados
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Performance**: Otimização de Imagens Next.js, Compilador SWC
- **SEO**: API de Metadados Next.js, Open Graph, Twitter Cards

## 🎯 Funcionalidades Principais

- **Alta Performance**: Otimizado com recursos do Next.js 14
- **SEO Otimizado**: Metadados integrados, Open Graph e dados estruturados
- **Design Responsivo**: Abordagem mobile-first com Tailwind CSS
- **Animações Suaves**: Framer Motion para interações envolventes
- **UI Moderna**: Componentes Chakra UI com sistema de design customizado
- **Captura de Leads**: Formulário multi-etapas com roteamento inteligente
- **Acessibilidade**: Conforme WCAG com gerenciamento adequado de foco

## 🚀 Começando

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositório>
cd rarity-agency-landing-page

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build e Deploy
```bash
# Build para produção
npm run build

# Inicie o servidor de produção
npm start

# Deploy na Vercel (recomendado)
vercel --prod
```

## 📁 Estrutura do Projeto

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz com provedor Chakra UI
│   ├── page.tsx                 # Página inicial com hero e casos de sucesso
│   ├── strategy-call/           # Funil de captura de leads
│   │   └── page.tsx            # Página do formulário multi-etapas
│   └── globals.css              # Estilos globais e Tailwind
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes UI
│   │   └── Button.tsx          # Componente de botão customizado
│   └── LeadCaptureForm.tsx     # Formulário multi-etapas de captura de leads
├── public/                       # Ativos estáticos
│   └── rarity_logo.png         # Logo da agência
├── package.json                  # Dependências e scripts
├── next.config.js               # Configuração Next.js
├── tailwind.config.js           # Configuração Tailwind CSS
├── tsconfig.json                # Configuração TypeScript
├── install.bat                  # Script de instalação Windows
├── install.sh                   # Script de instalação Linux/Mac
├── env.example                  # Template de variáveis de ambiente
├── .gitignore                   # Regras de ignore do Git
├── next-env.d.ts               # Definições TypeScript do Next.js
├── DESIGN_RULES.md              # Documentação do sistema de design
├── STRATEGY_CONSULTATION_IMPLEMENTATION_GUIDE.md # Guia de implementação de captura de leads
└── ARCHITECTURE.md              # Documentação da arquitetura do projeto
```

## 🎨 Sistema de Design

Este projeto segue as regras abrangentes de design descritas no `DESIGN_RULES.md`, incluindo:

- **Paleta de Cores**: Tema escuro com gradientes roxos (#8A2BE2, #DA70D6)
- **Tipografia**: Família de fontes Poppins com hierarquia adequada
- **Layout**: Design de largura total com espaçamento mínimo
- **Animações**: Animações de entrada escalonadas com Framer Motion
- **Responsivo**: Abordagem mobile-first com otimização de breakpoints

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```bash
# Adicione suas variáveis de ambiente aqui
NEXT_PUBLIC_SITE_URL=https://rarityagency.io
```

### Tailwind CSS
A paleta de cores customizada e animações são configuradas no `tailwind.config.js` para corresponder ao sistema de design.

### Next.js
Otimizado para performance com:
- Compilador SWC para builds rápidos
- Otimização de imagens
- Divisão automática de código
- Monitoramento de performance integrado

## 📱 Breakpoints Responsivos

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

## 🚀 Funcionalidades de Performance

- **Otimização de Imagens**: Componente Image do Next.js com suporte WebP/AVIF
- **Divisão de Código**: Divisão automática baseada em rotas
- **Minificação**: Compilador SWC para builds de produção
- **Cache**: Estratégias de cache integradas
- **Carregamento Lazy**: Carregamento lazy automático de componentes

## 🔍 Funcionalidades de SEO

- **API de Metadados**: Tags meta dinâmicas e Open Graph
- **Dados Estruturados**: JSON-LD para rich snippets
- **Performance**: Otimização Core Web Vitals
- **Acessibilidade**: Conformidade WCAG 2.1 AA
- **Mobile-First**: Design otimizado para mobile

## 🧪 Testes

```bash
# Execute o linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 📦 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Outras Plataformas
- **Netlify**: Conecte repositório GitHub
- **AWS Amplify**: Conecte repositório Git
- **Self-hosted**: Build e deploy em qualquer servidor

## 🤝 Contribuindo

1. Faça fork do repositório
2. Crie uma branch de feature
3. Faça suas alterações
4. Teste thoroughly
5. Envie um pull request

## 📄 Licença

Este projeto é proprietário da Rarity Agency Brasil.

---

**Rarity Agency © 2025 | Todos os direitos reservados.**

---

# Rarity Agency Landing Page - Next.js

Uma landing page moderna e de alta performance para a Rarity Agency - Growth for Startups, construída com tecnologias de ponta para experiência de usuário e performance de SEO otimizadas.

## 🚀 **Funcionalidades Implementadas**

### **Versão /1 - Todas as Seções Visíveis**
- ✅ **Seção de Urgência** aparece desde o começo
- ✅ **CTA Button** aparece desde o começo
- ✅ **Casos de Sucesso** sempre visíveis
- ✅ **Design responsivo** e otimizado

### **Versão /2 - Com Delays e Timing**
- ✅ **Seção de Urgência** aparece após 1:00 de vídeo
- ✅ **CTA Button** aparece após 1:20 de vídeo
- ✅ **Timing controlado** para máxima conversão
- ✅ **Experiência progressiva** do usuário

### **Funcionalidades de Vídeo**
- 🎬 **Botão de Play Circular** escuro com texto "Clique para assistir"
- 🎯 **Clique em qualquer parte do vídeo** inicia a reprodução
- ⏱️ **Símbolo "on going video"** aparece por 2 segundos após clicar play
- 🖼️ **Thumbnail inicial** exibido antes da reprodução
- 🎭 **Animações suaves** com Framer Motion

## 🛠️ **Stack Tecnológica**

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Sistema de Design Customizado
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Performance**: Otimização de Imagens Next.js, Compilador SWC

## 🎯 **Como Usar**

### **Navegação entre Versões**
1. **Acesse** `/navigation` para escolher entre as versões
2. **Versão /1**: Todas as seções visíveis desde o começo
3. **Versão /2**: Com delays e timing controlado

**Nota**: A raiz (/) redireciona automaticamente para `/1` 

### **Funcionalidades de Vídeo**
1. **Clique no botão de play** ou em qualquer parte do vídeo
2. **Símbolo "Reproduzindo..."** aparece por 2 segundos
3. **Seções aparecem** conforme o timing configurado (versão 2)
4. **Controles de pausa** aparecem no hover durante reprodução

## 🚀 **Começando**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/caiodcamargo999/lp_rarity_oferta_energia_solar.git
cd lp_rarity_oferta_energia_solar

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### **Build e Deploy**
```bash
# Build para produção
npm run build

# Inicie o servidor de produção
npm start

# Deploy na Vercel (recomendado)
vercel --prod
```

## 📁 **Estrutura do Projeto**

```
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Versão 1 (todas as seções)
│   ├── 2/page.tsx              # Versão 2 (com delays)
│   ├── navigation/page.tsx      # Página de escolha de versão
│   └── globals.css              # Estilos globais
├── components/                   # Componentes reutilizáveis
│   ├── VideoSection.tsx         # Seção de vídeo com funcionalidades
│   ├── SuccessCases.tsx         # Casos de sucesso
│   └── LeadCaptureForm.tsx      # Formulário de captura
├── public/                       # Ativos estáticos
│   └── rarity_logo.png         # Logo da agência
└── package.json                  # Dependências e scripts
```

## 🎨 **Sistema de Design**

Este projeto segue as regras abrangentes de design descritas no `DESIGN_RULES.md`, incluindo:

- **Paleta de Cores**: Tema escuro com gradientes roxos (#8A2BE2, #DA70D6)
- **Tipografia**: Família de fontes Poppins com hierarquia adequada
- **Layout**: Design de largura total com espaçamento mínimo
- **Animações**: Animações de entrada escalonadas com Framer Motion
- **Responsivo**: Abordagem mobile-first com otimização de breakpoints

## 🔧 **Configuração**

### **Variáveis de Ambiente**
Crie um arquivo `.env.local`:
```bash
# Adicione suas variáveis de ambiente aqui
NEXT_PUBLIC_SITE_URL=https://rarityagency.io
```

### **Arquivo de Vídeo**
⚠️ **Importante**: O arquivo `video-de-vendas.mp4` não está incluído no repositório devido ao tamanho (362MB). 
- Adicione seu arquivo de vídeo na pasta `public/`
- Nome do arquivo: `video-de-vendas.mp4`
- Formato recomendado: MP4 com compressão otimizada

## 📱 **Breakpoints Responsivos**

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

## 🚀 **Funcionalidades de Performance**

- **Otimização de Imagens**: Componente Image do Next.js com suporte WebP/AVIF
- **Divisão de Código**: Divisão automática baseada em rotas
- **Minificação**: Compilador SWC para builds de produção
- **Cache**: Estratégias de cache integradas
- **Carregamento Lazy**: Carregamento lazy automático de componentes

## 🔍 **Funcionalidades de SEO**

- **API de Metadados**: Tags meta dinâmicas e Open Graph
- **Dados Estruturados**: JSON-LD para rich snippets
- **Performance**: Otimização Core Web Vitals
- **Acessibilidade**: Conformidade WCAG 2.1 AA
- **Mobile-First**: Design otimizado para mobile

## 🧪 **Testes**

```bash
# Execute o linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 📦 **Deploy**

### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

### **Outras Plataformas**
- **Netlify**: Conecte repositório GitHub
- **AWS Amplify**: Conecte repositório Git
- **Self-hosted**: Build e deploy em qualquer servidor

## 🤝 **Contribuindo**

1. Faça fork do repositório
2. Crie uma branch de feature
3. Faça suas alterações
4. Teste thoroughly
5. Envie um pull request

## 📄 **Licença**

Este projeto é proprietário da Rarity Agency Brasil.

---

**Rarity Agency © 2025 | Todos os direitos reservados.** 

---

## 🎬 **Configuração da Thumbnail do Vídeo - CRÍTICO**

### **⚠️ IMPORTANTE: Thumbnail Obrigatória**
A thumbnail do vídeo é **CRÍTICA** para a primeira impressão do lead e deve mostrar o Matheus com olhos **BEM ABERTOS**.

### **Arquivo Necessário**
- **Nome**: `video-thumbnail-eyes-open.jpg`
- **Localização**: `/public/video-thumbnail-eyes-open.jpg`
- **Formato**: JPG ou JPEG
- **Resolução**: Mínimo 720x1280px (proporção 9:16)

### **Requisitos Visuais CRÍTICOS**
- ✅ **Matheus com OLHOS BEM ABERTOS** (não fechados!)
- ✅ **Olhar direto para a câmera**
- ✅ **Expressão atenta e profissional**
- ✅ **Fundo escuro/simples** (não distrair)
- ✅ **Qualidade alta** (não pixelada)

### **O que NÃO usar**
- ❌ Matheus com olhos fechados
- ❌ Matheus olhando para o lado
- ❌ Fundo muito claro ou distrativo
- ❌ Imagem de baixa qualidade
- ❌ Outras pessoas na imagem

### **Como Criar a Thumbnail**
1. **Abra o vídeo** `video-de-vendas.mp4`
2. **Avance para um momento** onde Matheus está com olhos abertos
3. **Pause e capture** esse frame
4. **Salve como JPG** com o nome exato: `video-thumbnail-eyes-open.jpg`
5. **Coloque na pasta** `/public/` do projeto

### **Por que é Importante**
- **Primeira impressão** do lead sobre o vídeo
- **Profissionalismo** da marca
- **Engajamento** visual imediato
- **Consistência** com o design da página

### **Verificação**
- A thumbnail deve aparecer imediatamente ao carregar a página
- O vídeo deve funcionar corretamente ao clicar no botão de play
- O timing das seções deve funcionar conforme configurado

---

**🚨 ATENÇÃO**: A thumbnail é OBRIGATÓRIA para o vídeo funcionar corretamente e deve mostrar o Matheus com olhos BEM abertos olhando para a câmera! 
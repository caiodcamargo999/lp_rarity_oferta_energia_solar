# Rarity Agency Landing Page - Regras de Design

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

## 🚀 **Stack Tecnológica Atual**

### **Framework Principal**
- **Next.js 14** (App Router) - Framework React para produção
- **TypeScript** - Linguagem de programação tipada
- **React 18** - Biblioteca de interface do usuário

### **Estilização e UI**
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **CSS Customizado** - Estilos específicos do projeto

### **Componentes e Bibliotecas**
- **Lucide React** - Ícones SVG otimizados
- **Dynamic Imports** - Carregamento lazy de componentes
- **Suspense** - Gerenciamento de estados de carregamento

### **Performance e Otimização**
- **SWC Compiler** - Compilador rápido para Next.js
- **Image Optimization** - Otimização automática de imagens
- **Code Splitting** - Divisão automática de código
- **Performance Monitoring** - Monitoramento de métricas Core Web Vitals

---

## 🎨 **Visão Geral do Sistema de Design**

### **Identidade da Marca**
- **Empresa**: Rarity Agency
- **Tagline**: "Crescimento e Vendas para Empresas de Energia Solar"
- **Proposta de Valor**: "Dobrar Vendas em 60 dias"
- **Setor**: Marketing Digital & Agência de Crescimento

---

## 🎯 **Estrutura do Layout - IMPLEMENTAÇÃO ATUAL**

### **Sistema de Duas Versões**
1. **Versão /1** (Página raiz) - Todas as seções visíveis desde o começo
2. **Versão /2** - Com delays e timing controlado para máxima conversão

### **Primeira Seção (Above the Fold)**
1. **Área do Logo** (Header Fixo)
   - Logo centralizado no topo
   - Tamanho: 48x32 (mobile) / 64x40 (desktop)
   - Posicionamento: absolute top-0 z-50
   - Padding: 8 (p-8)

2. **Headline & Subheadline** (Hero Section)
   - Headline: "DOBRE suas Vendas de Placas Solares em 60 dias"
   - Tamanho da fonte: 3xl-6xl (responsivo)
   - Efeito de texto gradiente em "DOBRE"
   - Subheadline: Texto descritivo sobre serviços
   - Tamanho da fonte: lg-xl (responsivo)
   - Max-width: 4xl
   - Padding-top: pt-24 (mobile) / pt-28 (desktop)

3. **Seção de Vídeo** (VideoSection Component)
   - Label: "ASSISTA COMO FUNCIONA"
   - Formato vertical (aspect ratio 9:16)
   - Max-width: sm (384px)
   - **FUNCIONALIDADE**: Clique em qualquer parte do vídeo inicia a reprodução
   - Thumbnail: `/thumbmail_vsl.png`
   - Botão de play circular centralizado com backdrop-blur

4. **Botão Call-to-Action**
   - Texto: "AGENDAR SESSÃO ESTRATÉGICA"
   - Background: roxo (#A855F7)
   - Bordas arredondadas (8px border-radius)
   - Efeitos hover com animação de elevação

### **Segunda Seção**
- **Casos de Sucesso/Depoimentos**
- Três cards com métricas e resultados
- Layout em grid responsivo (1 coluna mobile, 3 desktop)
- Efeitos hover nos cards

### **Terceira Seção**
- **Seção de Urgência** (implementada em SuccessCases)
- Aparece conforme versão:
  - **Versão 1**: Sempre visível
  - **Versão 2**: Aparece após 1:00 de vídeo
- Design com gradiente roxo e bordas

---

## 🎬 **Especificações do Botão de Play - IMPLEMENTAÇÃO ATUAL**

### **Design do Botão**
- **Formato**: Círculo escuro com backdrop-blur
- **Tamanho**: 96px x 96px (w-24 h-24)
- **Posicionamento**: Centralizado sobre o vídeo
- **Background**: Preto semi-transparente (bg-black/80) com backdrop-blur-md
- **Borda**: Anel branco semi-transparente (border-white/20)

### **Ícone de Play**
- **Formato**: SVG com triângulo apontando para direita
- **Tamanho**: 48px x 48px (w-12 h-12)
- **Cor**: Branco puro (#FFFFFF)
- **Posicionamento**: Centralizado com margem esquerda de 4px (ml-1)

### **Efeitos Visuais**
- **Animações**: 
  - Hover: scale(1.05) + transição suave
- **Transições**: 300ms ease para todas as propriedades
- **Backdrop**: Blur suave para efeito de vidro

### **Funcionalidade de Clique - IMPLEMENTADA**
- **Área de Clique**: Todo o retângulo do vídeo (onClick no elemento video)
- **Comportamento**: 
  - Clique em qualquer parte do vídeo inicia a reprodução
  - Botão de play desaparece quando o vídeo está rodando
  - Controles de pausa aparecem no hover durante a reprodução
  - **Símbolo "Reproduzindo..."** aparece por 2 segundos após clicar play

---

## 🖼️ **Especificações da Thumbnail do Vídeo - CRÍTICO**

### **Arquivo Obrigatório**
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

### **Por que é Importante**
- **Primeira impressão** do lead sobre o vídeo
- **Profissionalismo** da marca
- **Engajamento** visual imediato
- **Consistência** com o design da página

### **Implementação Técnica**
- **Atributo poster**: Usado no elemento `<video>` para exibição imediata
- **Carregamento**: Thumbnail aparece antes do vídeo carregar
- **Fallback**: Se thumbnail não existir, vídeo pode não funcionar corretamente

---

## ⏱️ **Sistema de Timing - IMPLEMENTAÇÃO ATUAL**

### **Versão 1 (/1) - Sem Delays**
- ✅ **Seção de Urgência**: Sempre visível
- ✅ **CTA Button**: Sempre visível
- ✅ **Casos de Sucesso**: Sempre visíveis

### **Versão 2 (/2) - Com Delays Controlados**
- ⏰ **Seção de Urgência**: Aparece após 1:00 (60 segundos) de vídeo
- ⏰ **CTA Button**: Aparece após 1:20 (80 segundos) de vídeo
- ⏰ **Timing controlado** para máxima conversão
- ⏰ **Experiência progressiva** do usuário

---

## 🌈 **Paleta de Cores - IMPLEMENTAÇÃO ATUAL**

### **Cores Primárias**
- **Background**: Gradiente escuro (#0f0a1a → #1a0f2e → #0f0a1a)
- **Texto**: Branco (#FFFFFF)
- **Acento Primário**: Roxo (#A855F7)
- **Acento Secundário**: Roxo Claro (#E879F9)

### **Efeitos de Background**
- **Gradiente Base**: Gradiente vertical de 180 graus
- **Design Limpo**: Sem efeitos estrelados ou círculos roxos
- **Background Fixo**: Background permanece no lugar durante o scroll

### **Cores de Texto**
- **Texto Primário**: Branco (#FFFFFF)
- **Texto Secundário**: Cinza Claro (#D1D5DB)
- **Texto de Acento**: Gradiente roxo em frases-chave

---

## 📝 **Tipografia - IMPLEMENTAÇÃO ATUAL**

### **Família de Fontes**
- **Primária**: Poppins (Google Fonts)
- **Pesos**: 400 (Regular), 600 (Semi-bold), 700 (Bold)

### **Tamanhos de Fonte - IMPLEMENTADOS**
- **Logo**: 48x32 (mobile) / 64x40 (desktop)
- **Headline Principal**: 3xl-6xl (responsivo)
- **Subheadline**: lg-xl (responsivo)
- **Label do Vídeo**: lg (18px)
- **Texto do Botão**: lg (18px)
- **Título da Seção de Sucesso**: 4xl-5xl (responsivo)
- **Títulos dos Cards de Sucesso**: lg (18px)
- **Métricas de Sucesso**: 3xl (30px)

### **Efeitos de Texto**
- **Texto Gradiente**: Aplicado em "DOBRE" e títulos de seção
- **Responsivo**: Tamanhos adaptativos para mobile/desktop

---

## 📐 **Espaçamento e Layout - IMPLEMENTAÇÃO ATUAL**

### **Container**
- **Largura**: 100% full-width
- **Max-width**: Sem restrições
- **Padding**: Responsivo (px-4 para mobile)
- **Min-height**: 100vh

### **Espaçamento de Seções - IMPLEMENTADO**
- **Header**: p-8 (32px)
- **Hero**: pt-24/pt-28 (96px/112px), px-4 (16px)
- **Vídeo**: mb-4 (16px)
- **CTA**: mt-6 (24px)
- **Sucesso**: py-12 (48px), px-4 (16px)

### **Espaçamento de Elementos - IMPLEMENTADO**
- **Headline para Subheadline**: mb-6 (24px)
- **Subheadline para Vídeo**: mb-8 (32px)
- **Vídeo para Botão**: mt-6 (24px)

---

## 🎭 **Efeitos Visuais - IMPLEMENTAÇÃO ATUAL**

### **Animações - IMPLEMENTADAS**
- **Header**: fadeInDown 1s ease-out
- **Hero**: fadeIn 1.5s ease-out
- **Vídeo**: fadeInUp 1s ease-out
- **CTA**: fadeInUp 0.5s ease-out
- **Sucesso**: fadeInUp 2s ease-out

### **Efeitos Hover - IMPLEMENTADOS**
- **Botão de Play**: Scale 1.05 no hover
- **Botão CTA**: TranslateY(-1px) + sombra aprimorada
- **Cards de Sucesso**: TranslateY(-5px) + sombra roxa

### **Sombras - IMPLEMENTADAS**
- **Botão CTA**: 0 2px 8px rgba(168, 85, 247, 0.2)
- **Botão CTA Hover**: 0 4px 16px rgba(168, 85, 247, 0.3)
- **Cards de Sucesso Hover**: Efeito de elevação com transform

---

## 📱 **Design Responsivo - IMPLEMENTAÇÃO ATUAL**

### **Breakpoints - IMPLEMENTADOS**
- **Desktop**: Estilos padrão
- **Tablet**: max-width: 768px (md:)
- **Mobile**: max-width: 480px

### **Adaptações Mobile - IMPLEMENTADAS**
- **Headline**: Reduz para 3xl (mobile), 5xl (tablet), 6xl (desktop)
- **Logo**: Reduz para 48x32 (mobile), 64x40 (desktop)
- **Grid de Sucesso**: Layout de coluna única (mobile), 3 colunas (desktop)
- **Título de Sucesso**: Reduz para 4xl (mobile), 5xl (desktop)

---

## 🎯 **Diretrizes de Conteúdo - IMPLEMENTAÇÃO ATUAL**

### **Métricas de Sucesso - IMPLEMENTADAS**
- **Vendas Mensais**: +347% (Empresa de energia solar)
- **ROI em Marketing**: +2.8x (Retorno sobre investimento)
- **Custo de Aquisição**: -65% (Redução de custos)

### **Elementos da Marca - IMPLEMENTADOS**
- **Fonte do Logo**: Arquivo local (rarity_logo.png)
- **Link Externo**: Links para rarityagency.io
- **Copyright**: "Rarity Agency © 2025 | Especialistas em Marketing Digital para Energia Solar"

---

## 🚫 **Restrições de Design - ATUALIZADAS**

### **O que NÃO Fazer**
- ❌ Não use `npm run dev` (arquivo HTML estático)
- ❌ Não adicione espaços brancos excessivos
- ❌ Não use backgrounds brilhantes
- ❌ Não faça o vídeo horizontal (deve ser vertical)
- ❌ Não adicione gradientes de background nas seções (use o background principal)
- ❌ Não altere o sistema de timing das versões 1 e 2

### **O que Fazer**
- ✅ Use layout de largura total
- ✅ Mantenha elementos próximos uns dos outros
- ✅ Use acentos de gradiente roxo
- ✅ Mantenha o tema escuro
- ✅ Use formato de vídeo vertical
- ✅ Aplique animações hover
- ✅ Mantenha o sistema de duas versões funcionando

---

## 🔧 **Especificações Técnicas - IMPLEMENTAÇÃO ATUAL**

### **Estrutura de Arquivos - IMPLEMENTADA**
```
lp_rarity-oferta_energia_solar/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Versão 1 (todas as seções)
│   ├── 2/page.tsx              # Versão 2 (com delays)
│   ├── navigation/page.tsx      # Página de escolha de versão
│   └── globals.css              # Estilos globais
├── components/                   # Componentes reutilizáveis
│   ├── VideoSection.tsx         # Seção de vídeo com funcionalidades
│   ├── SuccessCases.tsx         # Casos de sucesso com timing
│   └── LeadCaptureForm.tsx      # Formulário de captura
├── public/                       # Ativos estáticos
│   ├── rarity_logo.png         # Logo da agência
│   └── thumbmail_vsl.png       # Thumbnail do vídeo
├── package.json                  # Dependências e scripts
├── next.config.js               # Configuração Next.js
├── tailwind.config.js           # Configuração Tailwind CSS
└── tsconfig.json                # Configuração TypeScript
```

### **Suporte de Navegador**
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Suporte a CSS Grid e Flexbox obrigatório
- Suporte a propriedades CSS customizadas (variáveis) obrigatório

### **Performance**
- Otimizado para carregamento rápido
- Dependências externas mínimas
- Animações CSS eficientes
- Imagens responsivas

---

## 📋 **Checklist de Implementação - ATUALIZADO**

- [x] Background gradiente roxo escuro
- [x] Efeito estrelado com pontos (removido para design limpo)
- [x] Posicionamento do logo grande
- [x] Espaçamento compacto dos elementos
- [x] Vídeo retangular vertical
- [x] Efeitos de texto gradiente
- [x] Animações hover
- [x] Design responsivo
- [x] Seção de casos de sucesso
- [x] Botão call-to-action
- [x] Detecção de idioma baseada em IP
- [x] Versão em português
- [x] Botões de troca de idioma
- [x] **Botão de play circular com funcionalidade de clique em qualquer parte do vídeo**
- [x] **Timing para aparecimento de elementos (urgência após 1:00, CTA após 1:20)**
- [x] **Sistema de duas versões implementado (/1 e /2)**
- [x] **Seção de urgência com design gradiente roxo**
- [x] **Thumbnail do vídeo implementado**
- [x] **Símbolo "Reproduzindo..." por 2 segundos**
- [x] **Controles de pausa no hover durante reprodução**

---

*Última Atualização: 2025*
*Versão do Sistema de Design: 3.0*
*Stack Atualizada: Next.js 14 + TypeScript + Tailwind CSS*
*Status: Sistema de duas versões implementado e funcional* 
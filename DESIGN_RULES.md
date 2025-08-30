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
- **Tagline**: "Growth for Startups"
- **Proposta de Valor**: "Unlock Your Growth Engine"
- **Setor**: Marketing Digital & Agência de Crescimento

---

## 🎯 **Estrutura do Layout**

### **Primeira Seção (Above the Fold)**
1. **Área do Logo** (Retângulo Vermelho)
   - Logo grande posicionado no topo
   - Tamanho: 1200px max-width
   - Padding mínimo: 0.5rem
   - Margin-bottom: 0.3rem

2. **Headline & Subheadline** (Retângulo Amarelo)
   - Headline: "DOBRE suas Vendas de Placas Solares"
   - Tamanho da fonte: 2.2rem
   - Efeito de texto gradiente em "DOBRE"
   - Subheadline: Texto descritivo sobre serviços
   - Tamanho da fonte: 1rem
   - Max-width: 500px
   - Espaçamento mínimo entre elementos

3. **Seção de Vídeo** (Retângulo Verde)
   - Label: "ASSISTA COMO FUNCIONA"
   - Formato vertical (aspect ratio 9:16)
   - Max-width: 400px
   - Botão de play circular centralizado
   - **FUNCIONALIDADE**: Clique em qualquer parte do retângulo do vídeo deve iniciar a reprodução

4. **Botão Call-to-Action**
   - Texto: "Agendar Consultoria Gratuita"
   - Background gradiente roxo
   - Bordas arredondadas (8px border-radius)
   - Efeitos hover com animação de elevação

### **Segunda Seção**
- **Casos de Sucesso/Depoimentos**
- Três cards com métricas e resultados
- Layout em grid (responsivo)
- Efeitos hover nos cards

---

## 🎬 **Especificações do Botão de Play**

### **Design do Botão**
- **Formato**: Círculo escuro com ícone de play centralizado
- **Tamanho**: 96px x 96px (w-24 h-24)
- **Posicionamento**: Centralizado sobre o vídeo
- **Background**: Preto semi-transparente com backdrop-blur
- **Borda**: Anel branco semi-transparente (border-white/80)

### **Ícone de Play**
- **Formato**: SVG com triângulo apontando para direita
- **Tamanho**: 48px x 48px (w-12 h-12)
- **Cor**: Branco puro (#FFFFFF)
- **Posicionamento**: Centralizado com margem esquerda de 4px (ml-1)

### **Efeitos Visuais**
- **Animações**: 
  - Círculo externo com animate-ping (opacidade 75%)
  - Hover: scale(1.1) + background mais claro
- **Transições**: 300ms ease para todas as propriedades
- **Backdrop**: Blur suave para efeito de vidro

### **Funcionalidade de Clique**
- **Área de Clique**: Todo o retângulo do vídeo (onClick no elemento video)
- **Comportamento**: 
  - Clique em qualquer parte do vídeo inicia a reprodução
  - Botão de play desaparece quando o vídeo está rodando
  - Controles de pausa aparecem no hover durante a reprodução

---

## 🌈 **Paleta de Cores**

### **Cores Primárias**
- **Background**: Gradiente escuro (#0a0a0a → #1a0a1a → #2a0a2a → #1a0a1a → #0a0a0a)
- **Texto**: Branco (#F5F5F5)
- **Acento Primário**: Roxo (#8A2BE2)
- **Acento Secundário**: Roxo Claro (#DA70D6)

### **Efeitos de Background**
- **Gradiente Base**: Gradiente diagonal de 135 graus
- **Círculos Roxos**: Múltiplos gradientes radiais com opacidade 0.05-0.1
- **Efeito Estrelado**: Pontos brancos (1px-2px) com opacidade 0.1
- **Background Fixo**: Background permanece no lugar durante o scroll

### **Cores de Texto**
- **Texto Primário**: Branco (#F5F5F5)
- **Texto Secundário**: Cinza Claro (#b0b0b0)
- **Texto de Acento**: Gradiente roxo em frases-chave

---

## 📝 **Tipografia**

### **Família de Fontes**
- **Primária**: Poppins (Google Fonts)
- **Pesos**: 400 (Regular), 600 (Semi-bold), 700 (Bold)

### **Tamanhos de Fonte**
- **Logo**: Grande (1200px max-width)
- **Headline Principal**: 2.2rem
- **Subheadline**: 1rem
- **Label do Vídeo**: 0.9rem
- **Texto do Botão**: 1.2rem
- **Título da Seção de Sucesso**: 2.5rem
- **Títulos dos Cards de Sucesso**: 1.5rem
- **Métricas de Sucesso**: 2rem

### **Efeitos de Texto**
- **Texto Gradiente**: Aplicado em "DOBRE" e títulos de seção
- **Espaçamento de Letras**: 2px para label da seção de vídeo
- **Transformação de Texto**: Maiúsculas para label do vídeo

---

## 📐 **Espaçamento e Layout**

### **Container**
- **Largura**: 100% full-width
- **Max-width**: Sem restrições
- **Padding**: Mínimo (0.5rem ou menos)
- **Min-height**: 100vh

### **Espaçamento de Seções**
- **Header**: 0.5rem padding, 0.3rem margin-bottom
- **Hero**: 0.5rem padding, 0.3rem margin-bottom
- **Vídeo**: 0.5rem padding, 0.3rem margin-bottom
- **CTA**: 0.5rem padding, 1rem margin-bottom
- **Sucesso**: 3rem padding, sem margins

### **Espaçamento de Elementos**
- **Headline para Subheadline**: 0.2rem margin
- **Subheadline para Vídeo**: 0.3rem margin
- **Vídeo para Botão**: 0.3rem margin

---

## 🎭 **Efeitos Visuais**

### **Animações**
- **Header**: fadeInDown 1s ease-out
- **Hero**: fadeIn 1.5s ease-out
- **Vídeo**: fadeInUp 1s ease-out
- **CTA**: fadeInUp 1.5s ease-out
- **Sucesso**: fadeInUp 2s ease-out

### **Efeitos Hover**
- **Botão de Play**: Scale 1.1 no hover
- **Botão CTA**: TranslateY(-5px) + sombra aprimorada
- **Cards de Sucesso**: TranslateY(-5px) + sombra roxa

### **Sombras**
- **Botão CTA**: 0 4px 20px rgba(0, 0, 0, 0.4)
- **Botão CTA Hover**: 0 8px 30px rgba(138, 43, 226, 0.5)
- **Cards de Sucesso Hover**: 0 10px 30px rgba(138, 43, 226, 0.2)

---

## 📱 **Design Responsivo**

### **Breakpoints**
- **Desktop**: Estilos padrão
- **Tablet**: max-width: 768px
- **Mobile**: max-width: 480px

### **Adaptações Mobile**
- **Headline**: Reduz para 2.2rem (mobile)
- **Logo**: Reduz para 140px max-width
- **Grid de Sucesso**: Layout de coluna única
- **Título de Sucesso**: Reduz para 1.8rem

---

## 🎯 **Diretrizes de Conteúdo**

### **Métricas de Sucesso**
- **Vendas Mensais**: +347% (Empresa de energia solar)
- **ROI em Marketing**: +2.8x (Retorno sobre investimento)
- **Custo de Aquisição**: -65% (Redução de custos)

### **Elementos da Marca**
- **Fonte do Logo**: Arquivo local (rarity_logo.png)
- **Link Externo**: Links para rarityagency.io
- **Copyright**: "Rarity Agency © 2025 | Todos os direitos reservados."

---

## 🚫 **Restrições de Design**

### **O que NÃO Fazer**
- ❌ Não use `npm run dev` (arquivo HTML estático)
- ❌ Não adicione espaços brancos excessivos
- ❌ Não use backgrounds brilhantes
- ❌ Não faça o vídeo horizontal (deve ser vertical)
- ❌ Não adicione gradientes de background nas seções (use o background principal)

### **O que Fazer**
- ✅ Use layout de largura total
- ✅ Mantenha elementos próximos uns dos outros
- ✅ Use acentos de gradiente roxo
- ✅ Mantenha o tema escuro
- ✅ Use formato de vídeo vertical
- ✅ Aplique animações hover

---

## 🔧 **Especificações Técnicas**

### **Estrutura de Arquivos**
```
lp_rarity-oferta_energia_solar/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Página inicial
│   ├── strategy-call/           # Rota de captura de leads
│   └── globals.css              # Estilos globais
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes UI
│   ├── VideoSection.tsx         # Seção de vídeo com funcionalidades
│   └── LeadCaptureForm.tsx      # Formulário de captura
├── public/                       # Ativos estáticos
│   └── rarity_logo.png         # Logo da agência
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

## 📋 **Checklist de Implementação**

- [x] Background gradiente roxo escuro
- [x] Efeito estrelado com pontos
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

---

*Última Atualização: 2025*
*Versão do Sistema de Design: 2.0*
*Stack Atualizada: Next.js 14 + TypeScript + Tailwind CSS* 
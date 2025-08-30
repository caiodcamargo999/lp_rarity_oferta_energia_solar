import React from 'react'
import { Button } from './Button'
import { ArrowRight, Play, Download, Trash2, Settings } from 'lucide-react'

// ===== COMPONENTE DE EXEMPLO DOS BOTÕES DESIGNERFLIX =====
export default function ButtonExamples() {
  return (
    <div className="p-8 space-y-8">
      {/* ===== TÍTULO DA SEÇÃO ===== */}
      <div className="text-center">
        <h2 className="text-h2 font-bold text-text-primary mb-4">
          Sistema de Botões Designerflix
        </h2>
        <p className="text-body text-text-secondary max-w-2xl mx-auto">
          Exemplos de como usar todas as variantes e tamanhos dos botões no seu projeto
        </p>
      </div>

      {/* ===== VARIANTES DE BOTÕES ===== */}
      <div className="space-y-6">
        <h3 className="text-h3 font-semibold text-text-primary">Variantes de Botões</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Botão Primary */}
          <div className="text-center space-y-2">
            <Button variant="primary" size="md" className="w-full">
              Botão Primary
            </Button>
            <p className="text-small text-text-secondary">Primary</p>
          </div>

          {/* Botão Secondary */}
          <div className="text-center space-y-2">
            <Button variant="secondary" size="md" className="w-full">
              Botão Secondary
            </Button>
            <p className="text-small text-text-secondary">Secondary</p>
          </div>

          {/* Botão Ghost */}
          <div className="text-center space-y-2">
            <Button variant="ghost" size="md" className="w-full">
              Botão Ghost
            </Button>
            <p className="text-small text-text-secondary">Ghost</p>
          </div>

          {/* Botão Destructive */}
          <div className="text-center space-y-2">
            <Button variant="destructive" size="md" className="w-full">
              Botão Destructive
            </Button>
            <p className="text-small text-text-secondary">Destructive</p>
          </div>
        </div>
      </div>

      {/* ===== TAMANHOS DE BOTÕES ===== */}
      <div className="space-y-6">
        <h3 className="text-h3 font-semibold text-text-primary">Tamanhos de Botões</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center space-y-2">
            <Button variant="primary" size="sm">
              Botão Small
            </Button>
            <p className="text-small text-text-secondary">Small</p>
          </div>

          <div className="text-center space-y-2">
            <Button variant="primary" size="md">
              Botão Medium
            </Button>
            <p className="text-small text-text-secondary">Medium</p>
          </div>

          <div className="text-center space-y-2">
            <Button variant="primary" size="lg">
              Botão Large
            </Button>
            <p className="text-small text-text-secondary">Large</p>
          </div>
        </div>
      </div>

      {/* ===== BOTÕES COM ÍCONES ===== */}
      <div className="space-y-6">
        <h3 className="text-h3 font-semibold text-text-primary">Botões com Ícones</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Botão com ícone à esquerda */}
          <div className="text-center space-y-2">
            <Button variant="primary" size="md" leftIcon={<Download size={20} />}>
              Download
            </Button>
            <p className="text-small text-text-secondary">Ícone à Esquerda</p>
          </div>

          {/* Botão com ícone à direita */}
          <div className="text-center space-y-2">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight size={20} />}>
              Continuar
            </Button>
            <p className="text-small text-text-secondary">Ícone à Direita</p>
          </div>

          {/* Botão com ícone apenas */}
          <div className="text-center space-y-2">
            <Button variant="ghost" size="md" leftIcon={<Settings size={20} />}>
              Configurações
            </Button>
            <p className="text-small text-text-secondary">Ícone + Texto</p>
          </div>
        </div>
      </div>

      {/* ===== BOTÕES COM ESTADOS ===== */}
      <div className="space-y-6">
        <h3 className="text-h3 font-semibold text-text-primary">Estados dos Botões</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Botão Loading */}
          <div className="text-center space-y-2">
            <Button variant="primary" size="md" loading>
              Carregando...
            </Button>
            <p className="text-small text-text-secondary">Loading</p>
          </div>

          {/* Botão Disabled */}
          <div className="text-center space-y-2">
            <Button variant="primary" size="md" disabled>
              Botão Desabilitado
            </Button>
            <p className="text-small text-text-secondary">Disabled</p>
          </div>

          {/* Botão Full Width */}
          <div className="text-center space-y-2">
            <Button variant="primary" size="md" fullWidth>
              Botão Largura Total
            </Button>
            <p className="text-small text-text-secondary">Full Width</p>
          </div>
        </div>
      </div>

      {/* ===== EXEMPLOS PRÁTICOS ===== */}
      <div className="space-y-6">
        <h3 className="text-h3 font-semibold text-text-primary">Exemplos Práticos para seu Projeto</h3>
        
        <div className="space-y-4">
          {/* CTA Principal */}
          <div className="text-center">
            <Button 
              variant="primary" 
              size="lg" 
              rightIcon={<ArrowRight size={24} />}
              className="min-w-[300px]"
            >
              AGENDAR SESSÃO ESTRATÉGICA
            </Button>
            <p className="text-small text-text-secondary mt-2">
              Botão CTA principal da landing page
            </p>
          </div>

          {/* Botões Secundários */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="md" leftIcon={<Play size={20} />}>
              Ver Demonstração
            </Button>
            
            <Button variant="ghost" size="md">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>

      {/* ===== CÓDIGO DE EXEMPLO ===== */}
      <div className="space-y-4">
        <h3 className="text-h4 font-semibold text-text-primary">Como Implementar no seu Código</h3>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <pre className="text-small text-gray-300 overflow-x-auto">
{`// ===== IMPORTAÇÃO =====
import { Button } from '@/components/ui/Button'
import { ArrowRight, Play } from 'lucide-react'

// ===== USO BÁSICO =====
<Button variant="primary" size="lg">
  AGENDAR SESSÃO ESTRATÉGICA
</Button>

// ===== COM ÍCONES =====
<Button 
  variant="secondary" 
  size="md" 
  leftIcon={<Play size={20} />}
>
  Ver Demonstração
</Button>

// ===== COM ESTADOS =====
<Button 
  variant="primary" 
  size="lg" 
  loading 
  fullWidth
>
  Carregando...
</Button>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

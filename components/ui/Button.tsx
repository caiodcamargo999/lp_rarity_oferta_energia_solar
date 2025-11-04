import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

// ===== TIPOS DO COMPONENTE =====
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactElement<LucideIcon>
  rightIcon?: React.ReactElement<LucideIcon>
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

// ===== COMPONENTE BUTTON DESIGNERFLIX =====
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  
  // ===== ESTADOS DO BOTÃO =====
  const isDisabled = disabled || loading
  
  // ===== CLASSES BASE =====
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `
  
  // ===== CLASSES POR VARIANTE =====
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-primary-500 text-white border-2 border-white/20
          hover:bg-primary-600 hover:shadow-[0px_12px_50px_0px_rgba(168,85,247,0.6)]
          active:bg-primary-600 active:transform-none
          shadow-[0px_8px_40px_0px_rgba(168,85,247,0.5)]
        `
      case 'secondary':
        return `
          bg-transparent text-primary-500 border-2 border-primary-500
          hover:bg-primary-500 hover:text-white hover:shadow-[0px_8px_40px_0px_rgba(168,85,247,0.5)]
          active:bg-primary-600 active:border-primary-600
        `
      case 'ghost':
        return `
          bg-transparent text-white
          hover:bg-white/10
          active:bg-white/20
        `
      case 'destructive':
        return `
          bg-red-500 text-white
          hover:bg-red-600
          active:bg-red-700
        `
      default:
        return ''
    }
  }
  
  // ===== CLASSES POR TAMANHO =====
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-10 px-4 text-sm'
      case 'lg':
        return 'h-14 px-8 text-lg'
      default:
        return 'h-12 px-6 text-base'
    }
  }
  
  // ===== RENDERIZAÇÃO DO ÍCONE DE LOADING =====
  const renderLoadingIcon = () => {
    if (!loading) return null
    
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="inline-block"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </motion.div>
    )
  }
  
  // ===== RENDERIZAÇÃO DO CONTEÚDO =====
  const renderContent = () => {
    if (loading) {
      return (
        <>
          {renderLoadingIcon()}
          <span className="ml-2">Carregando...</span>
        </>
      )
    }
    
    return (
      <>
        {leftIcon && (
          <span className="mr-2 inline-flex items-center">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2 inline-flex items-center">
            {rightIcon}
          </span>
        )}
      </>
    )
  }
  
  // ===== CLASSES FINAIS =====
  const finalClasses = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `.replace(/\s+/g, ' ').trim()
  
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={finalClasses}
      whileHover={!isDisabled ? { y: -1 } : {}}
      whileTap={!isDisabled ? { y: 0 } : {}}
      aria-busy={loading}
      aria-disabled={isDisabled}
      role="button"
      {...props}
    >
      {renderContent()}
    </motion.button>
  )
})

Button.displayName = 'Button'

// ===== EXPORTAÇÃO PRINCIPAL =====
export default Button

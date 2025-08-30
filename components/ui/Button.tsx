import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface ButtonProps extends ChakraButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', children, className, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'gradient':
          return {
            bg: 'linear-gradient(135deg, #8A2BE2 0%, #DA70D6 100%)',
            color: 'white',
            _hover: {
              bg: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 30px rgba(138, 43, 226, 0.5)',
            },
            _active: {
              transform: 'translateY(0)',
            },
          }
        case 'outline':
          return {
            border: '1px solid',
            borderColor: 'primary.500',
            color: 'primary.500',
            bg: 'transparent',
            _hover: {
              bg: 'primary.500',
              color: 'white',
            },
          }
        case 'ghost':
          return {
            bg: 'transparent',
            color: 'text.secondary',
            _hover: {
              bg: 'whiteAlpha.100',
              color: 'text.primary',
            },
          }
        default:
          return {}
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return { px: 4, py: 2, fontSize: 'sm' }
        case 'lg':
          return { px: 8, py: 4, fontSize: 'lg' }
        default:
          return { px: 6, py: 3, fontSize: 'md' }
      }
    }

    return (
      <ChakraButton
        ref={ref}
        variant={variant === 'gradient' ? 'solid' : variant}
        size={size}
        className={className}
        transition="all 0.3s ease"
        {...getVariantStyles()}
        {...getSizeStyles()}
        {...props}
      >
        {children}
      </ChakraButton>
    )
  }
)

Button.displayName = 'Button'

export default Button

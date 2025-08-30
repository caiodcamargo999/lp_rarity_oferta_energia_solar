import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// ===== CONFIGURAÇÃO DO TEMA DESIGNERFLIX =====
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// ===== TOKENS DE DESIGN DESIGNERFLIX =====
const theme = extendTheme({
  config,
  
  // ===== TIPOGRAFIA =====
  fonts: {
    heading: 'Inter, Inter Placeholder, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    body: 'Inter, Inter Placeholder, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  fontSizes: {
    // Escala fluida baseada no Designerflix
    h1: 'clamp(2.25rem, 2vw + 1rem, 3rem)',
    h2: 'clamp(1.8rem, 1.5vw + 1rem, 2.6rem)',
    h3: 'clamp(1.5rem, 1.2vw + 1rem, 2rem)',
    h4: 'clamp(1.25rem, 1vw + 1rem, 1.63rem)',
    h5: 'clamp(1.125rem, 0.8vw + 1rem, 1.25rem)',
    h6: 'clamp(1rem, 0.6vw + 1rem, 1.125rem)',
    body: 'clamp(0.95rem, 0.4vw + 1rem, 1rem)',
    small: 'clamp(0.875rem, 0.3vw + 1rem, 0.9rem)',
    overline: 'clamp(0.75rem, 0.2vw + 1rem, 0.8rem)',
  },
  
  lineHeights: {
    tight: '120%',
    normal: '140%',
    relaxed: '160%',
  },
  
  letterSpacings: {
    tight: '-0.04em',
    normal: '-0.03em',
    wide: '-0.02em',
    wider: '0.05em',
  },
  
  // ===== CORES DESIGNERFLIX =====
  colors: {
    designerflix: {
      blue: {
        50: '#CCE5FF',
        100: '#99CCFF',
        500: '#0F6AE7', // Primário
        600: '#227AF4', // Secundário
        700: '#006EDD',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#BFBFBF',
        tertiary: '#747474',
        muted: '#5B5B5B',
      },
      bg: {
        primary: '#000000',
        secondary: '#0C0C0C',
        tertiary: '#2C2C2C',
      }
    },
    
    // Cores do sistema baseadas no Designerflix
    blue: {
      50: '#CCE5FF',
      100: '#99CCFF',
      500: '#0F6AE7',
      600: '#227AF4',
      700: '#006EDD',
    },
    
    gray: {
      50: '#FFFFFF',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    // Cores de texto
    text: {
      primary: '#FFFFFF',
      secondary: '#BFBFBF',
      tertiary: '#747474',
      muted: '#5B5B5B',
    },
    
    // Backgrounds
    bg: {
      primary: '#000000',
      secondary: '#0C0C0C',
      tertiary: '#2C2C2C',
    }
  },
  
  // ===== ESPAÇAMENTO DESIGNERFLIX =====
  space: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // ===== BORDER RADIUS DESIGNERFLIX =====
  radii: {
    sm: '7px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '999px',
  },
  
  // ===== SOMBRAS DESIGNERFLIX =====
  shadows: {
    designerflix: '0px 8px 40px 0px rgba(0, 102, 204, 0.5), inset 0px 0px 10px 1px rgba(255, 255, 255, 0), 0px 0px 0px 1px rgba(0, 85, 255, 0.12)',
    'designerflix-hover': '0px 12px 50px 0px rgba(0, 102, 204, 0.6), inset 0px 0px 15px 1px rgba(255, 255, 255, 0.1), 0px 0px 0px 2px rgba(0, 85, 255, 0.2)',
  },
  
  // ===== ANIMAÇÕES DESIGNERFLIX =====
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // ===== COMPONENTES PERSONALIZADOS =====
  components: {
    // ===== BOTÕES DESIGNERFLIX =====
    Button: {
      baseStyle: {
        fontFamily: 'Inter, Inter Placeholder, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        fontWeight: 'medium',
        borderRadius: 'md',
        _focus: {
          boxShadow: '0 0 0 3px rgba(15, 106, 231, 0.1)',
        },
        _focusVisible: {
          outline: '2px solid',
          outlineColor: 'designerflix.blue.50',
          outlineOffset: '2px',
        },
      },
      
      sizes: {
        sm: {
          h: '2.5rem',
          px: '1rem',
          fontSize: 'small',
        },
        md: {
          h: '3rem',
          px: '1.5rem',
          fontSize: 'body',
        },
        lg: {
          h: '3.5rem',
          px: '2rem',
          fontSize: 'h6',
        },
      },
      
      variants: {
        // ===== VARIANTE PRIMÁRIA DESIGNERFLIX =====
        primary: {
          bg: 'designerflix.blue.500',
          color: 'designerflix.text.primary',
          border: '2px solid',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 'md',
          boxShadow: 'designerflix',
          _hover: {
            bg: 'designerflix.blue.600',
            boxShadow: 'designerflix-hover',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'designerflix.blue.700',
            transform: 'translateY(0)',
          },
          _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            _hover: {
              bg: 'designerflix.blue.500',
              transform: 'none',
              boxShadow: 'designerflix',
            },
          },
        },
        
        // ===== VARIANTE SECUNDÁRIA DESIGNERFLIX =====
        secondary: {
          bg: 'transparent',
          color: 'designerflix.blue.500',
          border: '2px solid',
          borderColor: 'designerflix.blue.500',
          borderRadius: 'md',
          _hover: {
            bg: 'designerflix.blue.500',
            color: 'designerflix.text.primary',
            transform: 'translateY(-1px)',
            boxShadow: 'designerflix',
          },
          _active: {
            bg: 'designerflix.blue.600',
            borderColor: 'designerflix.blue.600',
            transform: 'translateY(0)',
          },
        },
        
        // ===== VARIANTE GHOST DESIGNERFLIX =====
        ghost: {
          bg: 'transparent',
          color: 'designerflix.text.primary',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(0)',
          },
        },
        
        // ===== VARIANTE DESTRUCTIVE DESIGNERFLIX =====
        destructive: {
          bg: '#EF4444',
          color: 'designerflix.text.primary',
          _hover: {
            bg: '#DC2626',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: '#B91C1C',
            transform: 'translateY(0)',
          },
        },
      },
      
      defaultProps: {
        variant: 'primary',
        size: 'md',
      },
    },
    
    // ===== HEADINGS DESIGNERFLIX =====
    Heading: {
      baseStyle: {
        fontFamily: 'Inter, Inter Placeholder, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        fontWeight: 'semibold',
        lineHeight: 'tight',
        letterSpacing: 'tight',
        color: 'designerflix.text.primary',
      },
    },
    
    // ===== TEXT DESIGNERFLIX =====
    Text: {
      baseStyle: {
        fontFamily: 'Inter, Inter Placeholder, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        fontWeight: 'medium',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'designerflix.text.secondary',
      },
    },
  },
  
  // ===== ESTILOS GLOBAIS DESIGNERFLIX =====
  styles: {
    global: {
      body: {
        bg: 'designerflix.bg.primary',
        color: 'designerflix.text.primary',
        fontFamily: 'Inter, Inter Placeholder, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        fontSize: 'body',
        fontWeight: 'medium',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      },
      
      // ===== FOCUS VISÍVEL PARA ACESSIBILIDADE =====
      '*:focus-visible': {
        outline: '2px solid',
        outlineColor: 'designerflix.blue.50',
        outlineOffset: '2px',
      },
      
      // ===== REDUÇÃO DE MOVIMENTO =====
      '@media (prefers-reduced-motion: reduce)': {
        '*': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
        },
      },
    },
  },
})

export default theme

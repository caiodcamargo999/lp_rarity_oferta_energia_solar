/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ===== TIPOGRAFIA DESIGNERFLIX =====
      fontFamily: {
        'inter': ['Inter', 'Inter Placeholder', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        'sans': ['Inter', 'Inter Placeholder', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Escala fluida baseada no Designerflix
        'h1': ['clamp(2.25rem, 2vw + 1rem, 3rem)', {
          lineHeight: '120%',
          letterSpacing: '-0.04em',
          fontWeight: '700',
        }],
        'h2': ['clamp(1.8rem, 1.5vw + 1rem, 2.6rem)', {
          lineHeight: '120%',
          letterSpacing: '-0.04em',
          fontWeight: '600',
        }],
        'h3': ['clamp(1.5rem, 1.2vw + 1rem, 2rem)', {
          lineHeight: '120%',
          letterSpacing: '-0.04em',
          fontWeight: '600',
        }],
        'h4': ['clamp(1.25rem, 1vw + 1rem, 1.63rem)', {
          lineHeight: '120%',
          letterSpacing: '-0.04em',
          fontWeight: '600',
        }],
        'h5': ['clamp(1.125rem, 0.8vw + 1rem, 1.25rem)', {
          lineHeight: '120%',
          letterSpacing: '-0.04em',
          fontWeight: '600',
        }],
        'h6': ['clamp(1rem, 0.6vw + 1rem, 1.125rem)', {
          lineHeight: '120%',
          letterSpacing: '-0.04em',
          fontWeight: '600',
        }],
        'body': ['clamp(0.95rem, 0.4vw + 1rem, 1rem)', {
          lineHeight: '140%',
          letterSpacing: '-0.03em',
          fontWeight: '500',
        }],
        'small': ['clamp(0.875rem, 0.3vw + 1rem, 0.9rem)', {
          lineHeight: '140%',
          letterSpacing: '-0.03em',
          fontWeight: '500',
        }],
        'overline': ['clamp(0.75rem, 0.2vw + 1rem, 0.8rem)', {
          lineHeight: '120%',
          letterSpacing: '0.05em',
          fontWeight: '500',
        }],
      },
      
      // ===== CORES EXISTENTES DA PÁGINA (NÃO ALTERADAS) =====
      colors: {
        primary: {
          500: '#A855F7', // Roxo mais claro para melhor contraste
          600: '#9333EA', // Roxo mais claro para hover
        },
        secondary: {
          500: '#E879F9', // Roxo claro mais suave
        },
        text: {
          primary: '#FFFFFF', // Branco puro para máximo contraste
          secondary: '#D1D5DB', // Cinza mais claro para melhor legibilidade
        },
        background: {
          start: 'rgb(10, 10, 10)',
          end: 'rgb(42, 10, 42)',
        },
      },
      
      // ===== ESPAÇAMENTO DESIGNERFLIX =====
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
      },
      
      // ===== BORDER RADIUS DESIGNERFLIX =====
      borderRadius: {
        'sm': '7px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      
      // ===== SOMBRAS DESIGNERFLIX =====
      boxShadow: {
        'designerflix': '0px 8px 40px 0px rgba(168, 85, 247, 0.5)',
        'designerflix-hover': '0px 12px 50px 0px rgba(168, 85, 247, 0.6)',
      },
      
      // ===== ANIMAÇÕES DESIGNERFLIX =====
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      // ===== TRANSITIONS DESIGNERFLIX =====
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      
      // ===== EASING DESIGNERFLIX =====
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

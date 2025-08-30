/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#A855F7', // Roxo mais claro para melhor contraste
          600: '#9333EA', // Roxo mais claro para hover
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#C084FC', // Roxo claro mais suave
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0a0a0a', // Base dark from design rules
        },
        text: {
          primary: '#FFFFFF', // Branco puro para máximo contraste
          secondary: '#D1D5DB', // Cinza mais claro para melhor legibilidade
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '2.2': '2.2rem',
        '2.5': '2.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 25%, #2a0a2a 50%, #1a0a1a 75%, #0a0a0a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'fade-in-down': 'fadeInDown 1s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'fade-in-up-slow': 'fadeInUp 1.5s ease-out',
        'fade-in-up-slower': 'fadeInUp 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      spacing: {
        '0.2': '0.2rem',
        '0.3': '0.3rem',
        '0.5': '0.5rem',
      },
      borderRadius: {
        '50': '50px',
      },
              boxShadow: {
          'cta': '0 4px 20px rgba(0, 0, 0, 0.4)',
          'cta-hover': '0 8px 30px rgba(168, 85, 247, 0.5)',
          'card-hover': '0 10px 30px rgba(168, 85, 247, 0.2)',
        },
    },
  },
  plugins: [],
}

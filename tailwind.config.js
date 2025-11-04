/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			inter: [
  				'Inter',
  				'Inter Placeholder',
  				'system-ui',
  				'-apple-system',
  				'Segoe UI',
  				'Roboto',
  				'Arial',
  				'sans-serif'
  			],
  			sans: [
  				'Inter',
  				'Inter Placeholder',
  				'system-ui',
  				'-apple-system',
  				'Segoe UI',
  				'Roboto',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			h1: [
  				'clamp(2.25rem, 2vw + 1rem, 3rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '-0.04em',
  					fontWeight: '700'
  				}
  			],
  			h2: [
  				'clamp(1.8rem, 1.5vw + 1rem, 2.6rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '-0.04em',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'clamp(1.5rem, 1.2vw + 1rem, 2rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '-0.04em',
  					fontWeight: '600'
  				}
  			],
  			h4: [
  				'clamp(1.25rem, 1vw + 1rem, 1.63rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '-0.04em',
  					fontWeight: '600'
  				}
  			],
  			h5: [
  				'clamp(1.125rem, 0.8vw + 1rem, 1.25rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '-0.04em',
  					fontWeight: '600'
  				}
  			],
  			h6: [
  				'clamp(1rem, 0.6vw + 1rem, 1.125rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '-0.04em',
  					fontWeight: '600'
  				}
  			],
  			body: [
  				'clamp(0.95rem, 0.4vw + 1rem, 1rem)',
  				{
  					lineHeight: '140%',
  					letterSpacing: '-0.03em',
  					fontWeight: '500'
  				}
  			],
  			small: [
  				'clamp(0.875rem, 0.3vw + 1rem, 0.9rem)',
  				{
  					lineHeight: '140%',
  					letterSpacing: '-0.03em',
  					fontWeight: '500'
  				}
  			],
  			overline: [
  				'clamp(0.75rem, 0.2vw + 1rem, 0.8rem)',
  				{
  					lineHeight: '120%',
  					letterSpacing: '0.05em',
  					fontWeight: '500'
  				}
  			]
  		},
  		colors: {
  			primary: {
  				'500': '#A855F7',
  				'600': '#9333EA',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'500': '#E879F9',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			text: {
  				primary: '#FFFFFF',
  				secondary: '#D1D5DB'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		spacing: {
  			xs: '0.25rem',
  			sm: '0.5rem',
  			md: '1rem',
  			lg: '1.5rem',
  			xl: '2rem',
  			'2xl': '3rem',
  			'3xl': '4rem'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: '24px'
  		},
  		boxShadow: {
  			designerflix: '0px 8px 40px 0px rgba(168, 85, 247, 0.5)',
  			'designerflix-hover': '0px 12px 50px 0px rgba(168, 85, 247, 0.6)'
  		},
  		animation: {
  			'fade-in-up': 'fadeInUp 0.6s ease-out',
  			'fade-in-down': 'fadeInDown 0.6s ease-out',
  			'scale-in': 'scaleIn 0.3s ease-out'
  		},
  		transitionDuration: {
  			fast: '150ms',
  			normal: '300ms',
  			slow: '500ms'
  		},
  		transitionTimingFunction: {
  			'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  			'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

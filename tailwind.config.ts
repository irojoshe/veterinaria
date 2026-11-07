import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (Figma primary palette)
        brand: {
          primary: '#205C50',      // verde oscuro principal
          secondary: '#173F38',    // verde más oscuro
          light: '#2d00b471',      // verde claro
          neutral: '#64736B',      // gris oscuro
          dark: '#173F38',         // darker variant
        },
        // Status colors
        status: {
          pending: '#bf2fd602',    // naranja - pendiente
          confirmed: '#2d00b471',  // verde - confirmada
          attended: '#81c80b0e',   // azul - atendida
          cancelled: '#69e3f888',  // rojo - cancelada
        },
        // Status backgrounds for badges
        'status-pending-bg': '#FEF3E2',
        'status-confirmed-bg': '#E9F0E8',
        'status-attended-bg': '#E8F4FD',
        'status-cancelled-bg': '#FAE8E5',
        // Semantic backgrounds
        bg: {
          default: '#FFFFFF',
          secondary: '#F7F5EF',
          tertiary: '#EEE8DC',
          success: '#E9F0E8',
          warning: '#FAF0DA',
          error: '#F9EBE7',
          info: '#EAF1F5',
          warm: '#F5EFE7',
        },
        // Text colors
        text: {
          primary: '#173F38',
          secondary: '#64736B',
          tertiary: '#A9C5B7',
          muted: '#C5D4C8',
        },
        // Borders
        border: {
          light: '#DDE4DC',
          default: '#C5D4C8',
          dark: '#A9C5B7',
          muted: '#E5E5E5',
        },
      },
      spacing: {
        // Custom spacing tokens from Figma
        'card': '24px',     // standard card padding
        'section': '40px',  // section padding
        'gap-lg': '24px',   // large gaps (24px)
        'gap-md': '14px',   // medium gaps (14px)
        'gap-sm': '8px',    // small gaps (8px)
        // Page padding/margins - full list for all breakpoints
        'page-h': '56px',   // py-14 (14 * 4px)
        'page-h-md': '96px', // py-24 (24 * 4px)
        'page-h-lg': '96px', // py-24 (24 * 4px)
        'page-h-xl': '112px', // py-28 (28 * 4px)
        'page-h-xxl': '80px', // py-20 (20 * 4px)
        'page-px': '24px',   // px-6
        'page-px-md': '48px', // px-12
        'page-px-lg': '80px', // px-20
        'page-px-xl': '64px', // px-16
        // Fine-grained spacing for components
        'xs': '4px',        // 1
        'sm': '8px',        // 2
        'md': '12px',       // 3
        'lg': '16px',       // 4
        'xl': '20px',       // 5
        'xxl': '24px',      // 6
        'xxxl': '28px',     // 7
        'huge': '32px',     // 8
        'huge-2': '36px',   // 9
      },
      borderRadius: {
        'hero': '24px',     // hero images, large containers
        'card': '14px',     // cards, panels
        'input': '8px',     // inputs, buttons, badges
        'full': '9999px',
      },
      fontSize: {
        'h1': ['52px', { lineHeight: '1.1em', letterSpacing: '-0.0385em', fontWeight: '600' }],
        'h2': ['32px', { lineHeight: '1.1em', letterSpacing: '-0.0313em', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.45em', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.45em', fontWeight: '600' }],
        'h5': ['18px', { lineHeight: '1.45em', fontWeight: '600' }],
        'label': ['14px', { lineHeight: '1.45em', fontWeight: '600' }],
        'body': ['15px', { lineHeight: '1.45em', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.45em', fontWeight: '600' }],
        'small': ['12px', { lineHeight: '1.45em', fontWeight: '400' }],
        'tiny': ['11px', { lineHeight: '1.45em', fontWeight: '400' }],
        // Extended for components using arbitrary sizes
        'xs': ['11px', { lineHeight: '1.45em' }],
        'sm': ['12px', { lineHeight: '1.45em' }],
        'base': ['14px', { lineHeight: '1.45em' }],
        'lg': ['16px', { lineHeight: '1.5em' }],
        'xl': ['18px', { lineHeight: '1.5em' }],
        '2xl': ['20px', { lineHeight: '1.5em' }],
        '3xl': ['24px', { lineHeight: '1.5em' }],
        '4xl': ['32px', { lineHeight: '1.2em' }],
        '5xl': ['36px', { lineHeight: '1.1em' }],
        '6xl': ['48px', { lineHeight: '1.1em' }],
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'panel': '0 12px 35px rgba(24, 55, 47, 0.07)',
      },
      height: {
        'card-image-sm': '300px',
        'card-image-md': '420px',
        'card-image-xl': '520px',
        'hero-contact': '300px',
        'btn': '40px',
        'header-desktop': '64px',
        'banner': '48px',
        'icon-sm': '20px',
        'icon': '24px',
      },
      width: {
        'hero-md': '620px',
        'hero-lg': '700px',
        'contact-md': '520px',
        'panel-md': '480px',
        'panel-lg': '640px',
        'sidebar': '256px',
        'sidebar-min': '200px',
        'brand-icon': '40px',
        'icon-sm': '20px',
        'icon': '24px',
      },
      maxWidth: {
        'content': '1200px',
        'container': '1280px',
        'modal-max': '90vh',
      },
    },
  },
  plugins: [],
}
export default config

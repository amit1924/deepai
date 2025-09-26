import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      typography: ({ theme }) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.blue.400'),
            '--tw-prose-bold': theme('colors.yellow.300'),
            '--tw-prose-bullets': theme('colors.orange.400'),
            '--tw-prose-code': theme('colors.green.400'),
            
            h1: {
              background: `linear-gradient(135deg, ${theme('colors.pink.400')}, ${theme('colors.purple.400')}, ${theme('colors.cyan.400')})`,
              backgroundClip: 'text',
              color: 'transparent',
            },
            h2: {
              background: `linear-gradient(135deg, ${theme('colors.purple.400')}, ${theme('colors.blue.400')})`,
              backgroundClip: 'text',
              color: 'transparent',
            },
            h3: {
              background: `linear-gradient(135deg, ${theme('colors.cyan.400')}, ${theme('colors.green.400')})`,
              backgroundClip: 'text',
              color: 'transparent',
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#6B7280 #374151',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          background: '#374151',
          borderRadius: '4px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          background: '#6B7280',
          borderRadius: '4px',
        },
      },
      '.responsive-table': {
        display: 'block',
        width: '100%',
        overflowX: 'auto',
        '& table': {
          minWidth: '650px',
          width: '100%',
        },
        '@screen sm': {
          display: 'table',
          overflowX: 'visible',
          '& table': {
            minWidth: 'auto',
          },
        },
      });
    },
  ],
};
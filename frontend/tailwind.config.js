// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       // Add this for better mobile responsiveness

//       fontFamily: {
//         custom: ['"Poppins"', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// };

import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        invert: {
          css: {
            h1: { color: theme('colors.pink.400') },
            h2: { color: theme('colors.purple.400') },
            h3: { color: theme('colors.cyan.400') },
            'ul > li::marker': { color: theme('colors.orange.400') },
            'ol > li::marker': { color: theme('colors.indigo.400') },
            blockquote: {
              color: theme('colors.emerald.300'),
              borderLeftColor: theme('colors.emerald.500'),
            },
            strong: { color: theme('colors.yellow.300') },
            code: {
              color: theme('colors.green.300'),
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

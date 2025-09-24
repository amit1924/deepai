/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Add this for better mobile responsiveness

      fontFamily: {
        custom: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

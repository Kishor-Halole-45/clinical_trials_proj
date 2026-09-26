/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'DM Sans', 'sans-serif'],
      },
      colors: {
        background: '#F6F6F0',
        surface: '#FFFDF8',
        primary: '#315D46',
        secondary: '#60866B',
        text: '#24372F',
        muted: '#69766C',
        border: '#E2E5DA',
        success: '#487A58',
        warning: '#A86C2C',
        critical: '#B5483A',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(36, 55, 47, 0.03), 0 8px 24px rgba(36, 55, 47, 0.04)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}

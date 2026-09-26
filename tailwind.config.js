/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        primary: '#123A6B',
        secondary: '#0F766E',
        text: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        success: '#1F9D6B',
        warning: '#D97706',
        critical: '#DC2626',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}

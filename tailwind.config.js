/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'theme-background': 'var(--theme-background)',
        'theme-card': 'var(--theme-card)',
        'theme-border': 'var(--theme-border)',
        'theme-hover': 'var(--theme-hover)',
        'theme-primary': 'var(--theme-primary)',
        'theme-text-primary': 'var(--theme-text-primary)',
        'theme-text-secondary': 'var(--theme-text-secondary)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  plugins: [],
};
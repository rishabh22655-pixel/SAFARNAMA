/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safari: {
          bg: '#0C0A09',
          card: '#141210',
          'card-hover': '#1C1916',
          border: '#26231E',
          'border-light': '#3A352E',
          amber: '#F5A65B',
          'amber-hover': '#E99544',
          copper: '#D18E50',
          cream: '#F5EFE6',
          muted: '#9E9589',
          dim: '#686259',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

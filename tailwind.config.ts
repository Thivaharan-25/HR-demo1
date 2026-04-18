import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        geist: ['Geist Mono', 'monospace'],
      },
      colors: {
        violet: { DEFAULT: '#7C3AED', glow: '#8B5CF6' },
      },
    },
  },
  plugins: [],
} satisfies Config

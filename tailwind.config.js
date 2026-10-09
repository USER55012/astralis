/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060608',
          900: '#09090b',
          850: '#0f0f13',
          800: '#14141a',
          700: '#1e1e27',
          600: '#2b2b36',
        },
        brass: {
          300: '#dfcaa7',
          400: '#c5a880',
          500: '#a3845b',
          600: '#7e6441',
        },
        platinum: '#e4e4e7',
        bone: '#f4f4f5',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '0.22em',
        editorial: '0.15em',
      },
    },
  },
  plugins: [],
}

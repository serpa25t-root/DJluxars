/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        lux: {
          dark: '#050505',
          surface: '#0a0a0a',
          muted: '#a1a1aa',
          accent: '#dc2626',
          accentHover: '#b91c1c',
          crimson: '#e50914',
        }
      }
    },
  },
  plugins: [],
}

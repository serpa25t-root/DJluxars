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
          dark: '#0f0f12',
          surface: '#1a1a1e',
          muted: '#a1a1aa',
          accent: '#c5a253',
          accentHover: '#b8933f',
        }
      }
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa React y el enrutador en un paquete base
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separa las librerías pesadas de interfaz que ralentizan la carga
          'ui-vendor': ['framer-motion', 'lucide-react'],
          // Separa utilidades de red
          'axios-vendor': ['axios'],
        },
      },
    },
    // Eleva el límite de advertencia de tamaño de chunk
    chunkSizeWarningLimit: 1000,
  },
})
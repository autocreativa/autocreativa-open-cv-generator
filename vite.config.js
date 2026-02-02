import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cv-generator/',
  server: {
    proxy: {
      '/api': 'http://localhost:5174',
    },
  },
  build: {
    outDir: 'cv-generator',
  },
})

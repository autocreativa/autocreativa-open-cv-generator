import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cv-generator/',
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        timeout: 130000,
        proxyTimeout: 130000,
      },
    },
  },
  build: {
    outDir: 'cv-generator',
  },
})

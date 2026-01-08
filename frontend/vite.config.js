import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group critical React and Redux libraries together
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          // Keep the heavy PDF and Chart tools separate
          'vendor-utils': ['jspdf', 'html2canvas', 'chart.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, 
  },
})
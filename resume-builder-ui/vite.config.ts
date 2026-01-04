/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn'
        ]
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist'],  // Separate chunk for PDF.js (~200KB gzipped)
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/icons': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  }
})
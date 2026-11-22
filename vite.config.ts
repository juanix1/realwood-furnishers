import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Termux/ARM64 friendly: Babel-based React plugin (no SWC native binary),
// Tailwind via PostCSS (no @tailwindcss/vite), and no Node globals
// (__dirname, process, path) used in this file.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})

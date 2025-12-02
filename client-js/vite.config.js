import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 Wajib import ini

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Wajib panggil fungsi ini
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
build: {
  outDir: 'dist',
  }
})
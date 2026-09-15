import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this repo under /Calendario-eventos/, so production
  // builds need that base path; local dev keeps serving from the root.
  base: command === 'build' ? '/Calendario-eventos/' : '/',
  plugins: [react(), tailwindcss()],
}))

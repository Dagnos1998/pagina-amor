import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' → rutas relativas: funciona igual en Vercel, Netlify y GitHub Pages (subcarpeta).
export default defineConfig({
  plugins: [react()],
  base: './',
})

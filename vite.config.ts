import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Cloudflare Pages 使用根路径 '/'
  // GitHub Pages 需要子路径时，设置环境变量 VITE_BASE_PATH
  base: process.env.VITE_BASE_PATH || '/',
})


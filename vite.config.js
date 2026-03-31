import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://petnet-backend-production.up.railway.app/',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
*/
//alterar quando for para produção, para o endereço do backend, e retirar o proxy do package.json
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


/*
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.netcao.com.br',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
*/
//alterar quando for para produção, para o endereço do backend, e retirar o proxy do package.json
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // 모든 네트워크 인터페이스에서 접속 가능
    open: true
  }
})


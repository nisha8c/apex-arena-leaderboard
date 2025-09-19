import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: { '/api': 'http://localhost:4000' }
    },
    resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})

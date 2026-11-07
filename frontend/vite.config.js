import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Yantra Sanchay',
        short_name: 'Yantra Sanchay',
        description: 'Smart agricultural machinery sharing and assistance platform',
        theme_color: '#2E7D32',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        scope: '/',
    icons: [
  {
    src: '/favicon.svg',
    sizes: 'any',
    type: 'image/svg+xml',
  },
],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
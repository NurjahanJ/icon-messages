import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    // Polyfill process.env for libraries that depend on it
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
    },
  },
  envPrefix: 'VITE_',
});

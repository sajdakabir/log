import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single-origin dev: the SPA runs on :5173 and proxies API + public routes to the
// Express API on :4000, so the browser only ever talks to one origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4100', changeOrigin: true },
      '/public': { target: 'http://localhost:4100', changeOrigin: true },
    },
  },
});

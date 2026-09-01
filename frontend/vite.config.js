import { defineConfig } from 'vite';

export default defineConfig({
  // Serve the SPA under /app/ in dev so the asset paths in index.html
  // (which are prefixed with /app/ for production) resolve correctly.
  // Production: Caddy strips /app before proxying to the backend.
  base: '/app/',
  root: 'public',
  server: {
    port: 5173,
    proxy: {
      // Backend API (Node modular monolith) — default port 3001 (env-overridable).
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});

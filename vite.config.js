import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.VITE_BASE ?? (process.env.GITHUB_ACTIONS ? '/claude/' : '/'),
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'apps/portfolio/index.html'),
        todo: resolve(__dirname, 'apps/todo/index.html'),
        kampanj: resolve(__dirname, 'apps/kampanj/index.html'),
        'seo-audit': resolve(__dirname, 'apps/seo-audit/index.html'),
        trackr: resolve(__dirname, 'apps/trackr/index.html'),
      },
    },
  },
});

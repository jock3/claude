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
        'portfolio-case1': resolve(__dirname, 'apps/portfolio/case1/index.html'),
        'portfolio-case1-marke': resolve(__dirname, 'apps/portfolio/case1/marke/index.html'),
        'portfolio-case6': resolve(__dirname, 'apps/portfolio/case6/index.html'),
        kampanj: resolve(__dirname, 'apps/kampanj/index.html'),
        'seo-audit': resolve(__dirname, 'apps/seo-audit/index.html'),
        'brus-fx': resolve(__dirname, 'apps/brus-fx/index.html'),
        'portfolio-case7': resolve(__dirname, 'apps/portfolio/case7/index.html'),
        musictheory: resolve(__dirname, 'apps/musictheory/index.html'),
        forum: resolve(__dirname, 'apps/forum/index.html'),
      },
    },
  },
});

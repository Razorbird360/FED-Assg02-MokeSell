import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/FED-Assg02-MokeSell/' : '/',
  root: 'src',
  publicDir: '../public',
  plugins: [],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        threejs: resolve(__dirname, 'src/threejs/threejs-index.html')
      }
    }
  }
});
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const getHtmlFiles = (dir) => {
  const files = readdirSync(dir);
  let htmlFiles = {};

  files.forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      htmlFiles = { ...htmlFiles, ...getHtmlFiles(fullPath) };
    } else if (file.endsWith('.html')) {
      const name = relative(resolve(__dirname, 'src'), fullPath).replace(/\.html$/, '');
      htmlFiles[name] = fullPath;
    }
  });

  return htmlFiles;
};

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/FED-Assg02-MokeSell/' : '/',
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    copyPublicDir: true,
    rollupOptions: {
      input: getHtmlFiles(resolve(__dirname, 'src')),
      external: ['/node_modules/vanilla-tilt/dist/vanilla-tilt.min.js'],
    }
  },
  optimizeDeps: {
    include: [
      'firebase/firestore',
      'firebase/app'
    ]
  },
  server: {
    proxy: {
      '/google.firestore.v1.Firestore': {
        target: 'https://firestore.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google\.firestore\.v1\.Firestore/, '')
      }
    }
  }
});
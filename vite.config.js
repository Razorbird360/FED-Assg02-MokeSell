import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Recursively get all HTML files in the given directory
const getHtmlFiles = (dir) => {
  const files = readdirSync(dir);
  let htmlFiles = {};

  files.forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      htmlFiles = { ...htmlFiles, ...getHtmlFiles(fullPath) };
    } else if (file.endsWith('.html')) {
      // Generate a relative path for Rollup compatibility
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
    copyPublicDir: true,
    rollupOptions: {
      external: ['/node_modules/vanilla-tilt/dist/vanilla-tilt.min.js'],
    }
  },
});

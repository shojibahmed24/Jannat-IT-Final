import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '', // Empty base so it uses relative paths for standard assets, but no chunks anyway
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      manifest: true,
      outDir: 'dist',
      rollupOptions: {
        input: 'src/main.tsx',
        output: {
          inlineDynamicImports: true, // Forces a single JS file (no chunk 404 errors!)
        }
      }
    },
    server: {
      port: 3000,
      allowedHosts: true as any,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/static/manifest.json';

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        react(),
        crx({ manifest }),
    ],
    build: {
        target: 'esnext',
        emptyOutDir: true,
        sourcemap: true,
    },
}); 
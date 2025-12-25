
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Explicitly defining process.env.API_KEY so it's globally available in the client bundle.
    // This value is taken from the environment where 'vite build' or 'vite dev' is run.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      // AQUÍ ESTABA EL ERROR: Ahora apunta al punto actual (.) no a src
      '@': path.resolve(__dirname, '.'), 
    }
  }
});
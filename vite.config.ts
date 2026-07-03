import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: resolve(__dirname, 'src/app'),
      pages: resolve(__dirname, 'src/pages'),
      features: resolve(__dirname, 'src/features'),
      entities: resolve(__dirname, 'src/entities'),
      shared: resolve(__dirname, 'src/shared'),
      widgets: resolve(__dirname, 'src/widgets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
});

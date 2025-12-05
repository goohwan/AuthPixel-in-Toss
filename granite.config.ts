import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'auth-pixel',
  brand: {
    displayName: 'AuthPixel',
    primaryColor: '#64B5F6',
    icon: '',
    bridgeColorMode: 'basic',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});

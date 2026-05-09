import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.NEXT_PUBLIC_GA_ID': JSON.stringify(env.NEXT_PUBLIC_GA_ID || ''),
        'process.env.NEXT_PUBLIC_GTM_ID': JSON.stringify(env.NEXT_PUBLIC_GTM_ID || ''),
        'process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION': JSON.stringify(env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        dedupe: ['react', 'react-dom'],
      }
    };
});

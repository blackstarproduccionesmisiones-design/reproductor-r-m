import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api/station-nowplaying': {
          target: 'https://cesarradio.realserver.es',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/station-nowplaying/, '/api/nowplaying/rock_y_metal'),
        },
        '/api/station-art': {
          target: 'https://cesarradio.realserver.es',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/station-art/, '/api/station/rock_y_metal/art'),
        },
        '/api/stream': {
          target: 'https://cesarradio.realserver.es',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/stream/, '/listen/rock_y_metal/radio.mp3'),
        },
        '/static': {
          target: 'https://cesarradio.realserver.es',
          changeOrigin: true,
          secure: false,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

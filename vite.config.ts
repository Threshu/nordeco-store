import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-inject variables and mixins into all SCSS files
        // This eliminates the need to @import in every component
        additionalData: `@import "@/styles/shared";`,
        // Silence Bootstrap deprecation warnings (Bootstrap issue, not ours)
        // https://github.com/twbs/bootstrap/issues/40962
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        quietDeps: true,
      },
    },
  },
});

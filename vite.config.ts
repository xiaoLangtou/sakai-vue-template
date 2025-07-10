import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const { PrimeVueResolver } = await import('@primevue/auto-import-resolver');
    
    return {
        optimizeDeps: {
            noDiscovery: true
        },
        plugins: [
            vue(),
            Components({
                resolvers: [PrimeVueResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
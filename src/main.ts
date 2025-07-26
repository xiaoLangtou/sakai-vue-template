import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import { Form as PrimeForm, FormField } from '@primevue/forms';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// 导入 TanStack Query 配置
import { VueQueryPlugin } from '@tanstack/vue-query'


import '@/assets/styles.scss';
import { createPinia } from 'pinia';

/**
 * 创建 Pinia 实例
 */
export const pinia = createPinia();

const app = createApp(App);

app.use(pinia);

// 注册路由
app.use(router);

// 注册 PrimeVue
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

// 注册 PrimeVue Forms 组件
app.component('PrimeForm', PrimeForm);
app.component('FormField', FormField);

// 注册 TanStack Query
app.use(VueQueryPlugin);

// 挂载应用
app.mount('#app');

import { GLOBAL_STORAGE_PREFIX } from '@/global/constants';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const store = createPinia();

store.use(
    createPersistedState({
        key: (id) => `${GLOBAL_STORAGE_PREFIX}_pinia_${id}`,
        storage: {
            getItem: (key) => {
                return JSON.parse(localStorage.getItem(key) || '{}');
            },
            setItem: (key, value) => {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }
    })
);

// 导出所有 store
export { useAuthStore } from './auth';
export { usePageLoadingStore } from './loading';
export { useTabsStore } from './tabs';
export default store;

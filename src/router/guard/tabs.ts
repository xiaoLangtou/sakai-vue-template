import { useTabsStore } from '@/stores';
import type { Router } from 'vue-router';

/**
 * 设置标签页路由守卫
 * @param router - 路由实例
 */
export default function setupTabsGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const tabsStore = useTabsStore();

        // 如果是登录页面，不处理标签页
        if (to.name === 'Login') {
            next();
            return;
        }
        if (to.path !== '/' && !tabsStore.tabs.some((tab) => tab.path === to.path)) {
            console.log('添加标签页', to.meta);
            const newTab = {
                key: to.path,
                title: (to.meta?.title as string) || to.name?.toString() || '未命名页面',
                path: to.path,
                icon: (to.meta?.icon as string) || 'pi pi-file',
                closable: true,
                isHome: false,
                loading: false,
                error: false
            };
            tabsStore.tabs.push(newTab);
        }

        // 设置当前路由对应的标签页为激活状态
        const currentTab = tabsStore.tabs.find((tab) => tab.path === to.path);
        if (currentTab) {
            tabsStore.setActiveTab(currentTab.key);
        }

        next();
    });
}

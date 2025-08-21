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

        // 确保首页标签存在
        const homeTab = {
            key: 'home',
            title: '首页',
            path: '/',
            icon: 'pi pi-home',
            closable: false,
            isHome: true,
            loading: false,
            error: false
        };

        // 如果没有首页标签，添加首页标签
        if (!tabsStore.tabs.some(tab => tab.isHome)) {
            tabsStore.tabs.unshift(homeTab);
        }

        // 如果没有激活的标签页，设置首页为激活状态
        if (!tabsStore.activeTabKey) {
            tabsStore.activeTabKey = homeTab.key;
        }

        // 如果当前路由不是首页，且不存在对应的标签页，则添加标签页
        if (to.path !== '/' && !tabsStore.tabs.some(tab => tab.path === to.path)) {
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
        const currentTab = tabsStore.tabs.find(tab => tab.path === to.path);
        if (currentTab) {
            tabsStore.setActiveTab(currentTab.key);
        }

        next();
    });
}

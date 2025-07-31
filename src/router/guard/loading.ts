import { usePageLoadingStore } from '@/stores';
import type { Router } from 'vue-router';

/**
 * 页面加载守卫
 * 在路由切换时显示/隐藏页面加载状态
 */
export function setupLoadingGuard(router: Router) {
    // 路由开始导航时显示loading
    router.beforeEach((to, from, next) => {
        // 只有在不同页面间切换时才显示loading
        if (to.path !== from.path) {
            const pageLoadingStore = usePageLoadingStore();
            pageLoadingStore.startLoading('页面加载中...');
        }
        next();
    });

    // 路由导航完成后隐藏loading
    router.afterEach(() => {
        const pageLoadingStore = usePageLoadingStore();
        // 延迟隐藏，确保页面资源加载完成
        setTimeout(() => {
            pageLoadingStore.finishLoading();
        }, 500);
    });

    // 路由导航错误时也要隐藏loading
    router.onError(() => {
        const pageLoadingStore = usePageLoadingStore();
        pageLoadingStore.finishLoading();
    });
}

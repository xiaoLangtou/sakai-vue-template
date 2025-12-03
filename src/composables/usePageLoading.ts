import { usePageLoadingStore } from '@/stores';

/**
 * 页面加载状态管理 Composable
 * 提供页面级别的加载状态控制
 */
export function usePageLoading() {
    const pageLoadingStore = usePageLoadingStore();

    /**
     * 显示页面加载状态
     * @param text - 加载提示文本
     */
    const showPageLoading = (text = '页面加载中...') => {
        pageLoadingStore.startLoading(text);
    };

    /**
     * 隐藏页面加载状态
     */
    const hidePageLoading = () => {
        pageLoadingStore.finishLoading();
    };

    /**
     * 异步操作包装器，自动显示/隐藏加载状态
     * @param asyncFn - 异步函数
     * @param loadingText - 加载提示文本
     */
    const withPageLoading = async <T>(asyncFn: () => Promise<T>, loadingText = '页面加载中...'): Promise<T> => {
        try {
            showPageLoading(loadingText);
            const result = await asyncFn();
            return result;
        } finally {
            hidePageLoading();
        }
    };

    return {
        isLoading: pageLoadingStore.isLoading,
        loadingText: pageLoadingStore.loadingText,
        showPageLoading,
        hidePageLoading,
        withPageLoading
    };
}

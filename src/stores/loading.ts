import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 页面加载状态管理
 */
export const usePageLoadingStore = defineStore('pageLoading', () => {
    /** 页面加载状态 */
    const isLoading = ref(false);

    /** 加载文本 */
    const loadingText = ref('页面加载中...');

    /**
     * 开始页面加载
     * @param text - 加载提示文本
     */
    const startLoading = (text = '页面加载中...') => {
        loadingText.value = text;
        isLoading.value = true;
    };

    /**
     * 结束页面加载
     */
    const finishLoading = () => {
        isLoading.value = false;
    };

    return {
        isLoading,
        loadingText,
        startLoading,
        finishLoading
    };
});

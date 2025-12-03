import { ref } from 'vue';
import { http } from '@/services/core/http';
import type { RequestConfig } from '@/services/types/types';

/**
 * 错误处理相关的 composable
 */
export function useErrorHandling() {
    const isPageReady = ref(false);
    const hasNetworkError = ref(false);

    /**
     * 安全的API请求 - 网络错误不会阻止页面渲染
     * @param url 请求地址
     * @param config 请求配置
     * @returns Promise<T | null>
     */
    const safeRequest = async <T = any>(url: string, config?: RequestConfig): Promise<T | null> => {
        try {
            const result = await http.get<T>(url, {
                ...config,
                preventPageBlock: true, // 关键配置：网络错误不阻止页面渲染
                showError: false // 可选：不显示错误提示
            });

            hasNetworkError.value = false;
            return result;
        } catch (error) {
            console.warn('安全请求失败，但页面继续渲染:', error);
            hasNetworkError.value = true;
            return null;
        }
    };

    /**
     * 批量安全请求 - 即使部分请求失败也不影响页面渲染
     * @param requests 请求配置数组
     * @returns Promise<Array<T | null>>
     */
    const batchSafeRequests = async <T = any>(requests: Array<{ url: string; config?: RequestConfig }>): Promise<Array<T | null>> => {
        const promises = requests.map(({ url, config }) => safeRequest<T>(url, config));

        return Promise.all(promises);
    };

    /**
     * 页面初始化 - 确保关键数据加载完成后才显示页面
     * @param criticalRequests 关键请求数组
     * @param optionalRequests 可选请求数组
     */
    const initializePage = async (criticalRequests: Array<{ url: string; config?: RequestConfig }>, optionalRequests: Array<{ url: string; config?: RequestConfig }> = []) => {
        try {
            // 关键请求必须成功
            const criticalPromises = criticalRequests.map(({ url, config }) => http.get(url, config));

            // 可选请求失败不影响页面渲染
            const optionalPromises = optionalRequests.map(({ url, config }) => safeRequest(url, config));

            // 等待关键请求完成
            await Promise.all(criticalPromises);

            // 可选请求并行执行，不等待结果
            Promise.all(optionalPromises);

            isPageReady.value = true;
        } catch (error) {
            console.error('关键请求失败:', error);
            // 可以在这里处理关键请求失败的情况
            // 比如显示错误页面或重试机制
            throw error;
        }
    };

    /**
     * 重试机制
     * @param requestFn 请求函数
     * @param maxRetries 最大重试次数
     * @param delay 重试延迟（毫秒）
     */
    const retryRequest = async <T>(requestFn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
        let lastError: any;

        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                lastError = error;

                if (i < maxRetries) {
                    console.warn(`请求失败，${delay}ms后进行第${i + 1}次重试:`, error);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    delay *= 2; // 指数退避
                }
            }
        }

        throw lastError;
    };

    return {
        isPageReady,
        hasNetworkError,
        safeRequest,
        batchSafeRequests,
        initializePage,
        retryRequest
    };
}

/**
 * 使用示例：
 *
 * ```typescript
 * // 在组件中使用
 * const { isPageReady, safeRequest, initializePage } = useErrorHandling();
 *
 * // 页面初始化
 * onMounted(async () => {
 *   await initializePage(
 *     // 关键请求 - 必须成功
 *     [{ url: '/api/user/profile' }],
 *     // 可选请求 - 失败不影响页面渲染
 *     [
 *       { url: '/api/notifications' },
 *       { url: '/api/recommendations' }
 *     ]
 *   );
 * });
 *
 * // 安全的数据请求
 * const loadOptionalData = async () => {
 *   const data = await safeRequest('/api/optional-data');
 *   if (data) {
 *     // 处理数据
 *   } else {
 *     // 显示默认内容或占位符
 *   }
 * };
 * ```
 */

import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTabsStore } from '@/stores/tabs';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import type { TabItem } from '@/stores/tabs';

/**
 * 标签页组合式函数配置
 */
interface UseTabsOptions {
    /** 是否自动添加当前路由为标签页 */
    autoAddCurrentRoute?: boolean;
    /** 是否在路由变化时自动添加标签页 */
    autoAddOnRouteChange?: boolean;
    /** 是否显示确认对话框 */
    showConfirm?: boolean;
    /** 是否显示提示消息 */
    showToast?: boolean;
}

/**
 * 标签页管理组合式函数
 * @param options - 配置选项
 * @returns 标签页相关的响应式数据和方法
 */
export function useTabs(options: UseTabsOptions = {}) {
    const { autoAddCurrentRoute = true, autoAddOnRouteChange = true, showConfirm = true, showToast = true } = options;

    const router = useRouter();
    const route = useRoute();
    const tabsStore = useTabsStore();
    const confirm = showConfirm ? useConfirm() : null;
    const toast = showToast ? useToast() : null;

    // 响应式数据
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 计算属性
    const tabs = computed(() => tabsStore.activeTabs);
    const activeTab = computed(() => tabsStore.activeTab);
    const activeTabKey = computed(() => tabsStore.activeTabKey);
    const canAddMore = computed(() => tabsStore.canAddTab);
    const hasClosableTabs = computed(() => tabsStore.activeTabs.some((tab) => tab.closable));

    /**
     * 添加标签页
     * @param routeOrTab - 路由对象或标签页对象
     * @returns 是否添加成功
     */
    const addTab = async (routeOrTab: any): Promise<boolean> => {
        try {
            loading.value = true;
            error.value = null;

            const success = tabsStore.addTab(routeOrTab);

            if (!success && toast) {
                toast.add({
                    severity: 'warn',
                    summary: '提示',
                    detail: '无法添加更多标签页，已达到最大数量限制',
                    life: 3000
                });
            }

            return success;
        } catch (err) {
            error.value = err instanceof Error ? err.message : '添加标签页失败';
            if (toast) {
                toast.add({
                    severity: 'error',
                    summary: '错误',
                    detail: error.value,
                    life: 3000
                });
            }
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * 移除标签页
     * @param key - 标签页键
     * @returns 是否移除成功
     */
    const removeTab = async (key: string): Promise<boolean> => {
        try {
            loading.value = true;
            error.value = null;

            const tab = tabsStore.activeTabs.find((t) => t.key === key);
            if (!tab) {
                throw new Error('标签页不存在');
            }

            if (!tab.closable && toast) {
                toast.add({
                    severity: 'warn',
                    summary: '提示',
                    detail: '该标签页不可关闭',
                    life: 3000
                });
                return false;
            }

            const success = tabsStore.removeTab(key);

            // 如果移除的是当前激活标签，跳转到新的激活标签
            if (success && tabsStore.activeTab) {
                const activeTab = tabsStore.activeTab;
                await router.push({
                    path: activeTab.path,
                    ...(activeTab.params && Object.keys(activeTab.params).length > 0 && { params: activeTab.params }),
                    ...(activeTab.query && Object.keys(activeTab.query).length > 0 && { query: activeTab.query })
                });
            }

            return success;
        } catch (err) {
            error.value = err instanceof Error ? err.message : '移除标签页失败';
            if (toast) {
                toast.add({
                    severity: 'error',
                    summary: '错误',
                    detail: error.value,
                    life: 3000
                });
            }
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * 激活标签页
     * @param key - 标签页键
     * @returns 是否激活成功
     */
    const activateTab = async (key: string): Promise<boolean> => {
        try {
            loading.value = true;
            error.value = null;

            const tab = tabsStore.activeTabs.find((t) => t.key === key);
            if (!tab) {
                throw new Error('标签页不存在');
            }

            tabsStore.setActiveTab(key);

            await router.push({
                path: tab.path,
                ...(tab.params && Object.keys(tab.params).length > 0 && { params: tab.params }),
                ...(tab.query && Object.keys(tab.query).length > 0 && { query: tab.query })
            });

            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : '激活标签页失败';
            if (toast) {
                toast.add({
                    severity: 'error',
                    summary: '错误',
                    detail: error.value,
                    life: 3000
                });
            }
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * 关闭其他标签页
     * @param key - 保留的标签页键
     */
    const closeOtherTabs = async (key: string): Promise<void> => {
        if (!confirm) {
            tabsStore.closeOtherTabs(key);
            return;
        }

        confirm.require({
            message: '确定要关闭其他标签页吗？',
            header: '确认操作',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                tabsStore.closeOtherTabs(key);
                const tab = tabsStore.activeTabs.find((t) => t.key === key);
                if (tab) {
                    await router.push({
                        path: tab.path,
                        ...(tab.params && Object.keys(tab.params).length > 0 && { params: tab.params }),
                        ...(tab.query && Object.keys(tab.query).length > 0 && { query: tab.query })
                    });
                }
            }
        });
    };

    /**
     * 关闭所有标签页
     */
    const closeAllTabs = async (): Promise<void> => {
        if (!confirm) {
            tabsStore.closeAllTabs();
            return;
        }

        confirm.require({
            message: '确定要关闭所有标签页吗？（首页除外）',
            header: '确认操作',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                tabsStore.closeAllTabs();
                if (tabsStore.activeTab) {
                    const activeTab = tabsStore.activeTab;
                    await router.push({
                        path: activeTab.path,
                        ...(activeTab.params && Object.keys(activeTab.params).length > 0 && { params: activeTab.params }),
                        ...(activeTab.query && Object.keys(activeTab.query).length > 0 && { query: activeTab.query })
                    });
                }
            }
        });
    };

    /**
     * 关闭左侧标签页
     * @param key - 基准标签页键
     */
    const closeLeftTabs = (key: string): void => {
        tabsStore.closeLeftTabs(key);
    };

    /**
     * 关闭右侧标签页
     * @param key - 基准标签页键
     */
    const closeRightTabs = (key: string): void => {
        tabsStore.closeRightTabs(key);
    };

    /**
     * 刷新标签页
     * @param key - 标签页键
     */
    const refreshTab = async (key: string): Promise<void> => {
        const tab = tabsStore.activeTabs.find((t) => t.key === key);
        if (!tab) return;

        // 设置加载状态
        tabsStore.setTabLoading(key, true);

        try {
            // 如果是当前激活标签，刷新页面
            if (key === activeTabKey.value) {
                window.location.reload();
            } else {
                // 否则只是重置加载状态
                setTimeout(() => {
                    tabsStore.setTabLoading(key, false);
                }, 1000);
            }
        } catch {
            tabsStore.setTabLoading(key, false);
            tabsStore.setTabError(key, true);
        }
    };

    /**
     * 设置标签页加载状态
     * @param key - 标签页键
     * @param loading - 加载状态
     */
    const setTabLoading = (key: string, loading: boolean): void => {
        tabsStore.setTabLoading(key, loading);
    };

    /**
     * 设置标签页错误状态
     * @param key - 标签页键
     * @param error - 错误状态
     */
    const setTabError = (key: string, error: boolean): void => {
        tabsStore.setTabError(key, error);
    };

    /**
     * 获取标签页
     * @param key - 标签页键
     * @returns 标签页对象
     */
    const getTab = (key: string): TabItem | undefined => {
        return tabsStore.activeTabs.find((tab) => tab.key === key);
    };

    /**
     * 检查标签页是否存在
     * @param key - 标签页键
     * @returns 是否存在
     */
    const hasTab = (key: string): boolean => {
        return tabsStore.activeTabs.some((tab) => tab.key === key);
    };

    /**
     * 清理所有标签页
     */
    const clearAllTabs = (): void => {
        tabsStore.resetTabs();
    };

    // 监听路由变化
    if (autoAddOnRouteChange) {
        watch(
            () => route,
            (newRoute) => {
                if (newRoute.meta?.hideInTabs) return;
                addTab(newRoute);
            },
            { immediate: autoAddCurrentRoute, deep: true }
        );
    }

    return {
        // 响应式数据
        tabs,
        activeTab,
        activeTabKey,
        canAddMore,
        hasClosableTabs,
        loading,
        error,

        // 方法
        addTab,
        removeTab,
        activateTab,
        closeOtherTabs,
        closeAllTabs,
        closeLeftTabs,
        closeRightTabs,
        refreshTab,
        setTabLoading,
        setTabError,
        getTab,
        hasTab,
        clearAllTabs
    };
}

/**
 * 标签页持久化组合式函数
 * @param storageKey - 存储键
 * @returns 持久化相关方法
 */
export function useTabsPersistence(storageKey: string = 'app_tabs') {
    const tabsStore = useTabsStore();

    /**
     * 保存标签页到本地存储
     */
    const saveTabs = (): void => {
        try {
            const data = {
                tabs: tabsStore.activeTabs,
                activeTabKey: tabsStore.activeTabKey,
                timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('保存标签页数据失败:', error);
        }
    };

    /**
     * 从本地存储恢复标签页
     */
    const restoreTabs = (): void => {
        try {
            const data = localStorage.getItem(storageKey);
            if (!data) return;

            const parsed = JSON.parse(data);
            if (parsed.tabs && Array.isArray(parsed.tabs)) {
                // 由于 store 中没有 restoreTabs 方法，我们手动恢复数据
                tabsStore.tabs = parsed.tabs;
                if (parsed.activeTabKey) {
                    tabsStore.activeTabKey = parsed.activeTabKey;
                }
            }
        } catch (error) {
            console.error('恢复标签页数据失败:', error);
        }
    };

    /**
     * 清除本地存储的标签页数据
     */
    const clearStoredTabs = (): void => {
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('清除标签页数据失败:', error);
        }
    };

    return {
        saveTabs,
        restoreTabs,
        clearStoredTabs
    };
}

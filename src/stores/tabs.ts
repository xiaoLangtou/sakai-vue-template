import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

/**
 * 标签页数据接口
 */
export interface TabItem {
  /** 唯一标识 */
  key: string;
  /** 标签标题 */
  title: string;
  /** 路由路径 */
  path: string;
  /** 图标 */
  icon?: string;
  /** 是否可关闭 */
  closable: boolean;
  /** 是否为首页 */
  isHome: boolean;
  /** 路由参数 */
  params?: Record<string, any>;
  /** 查询参数 */
  query?: Record<string, any>;
  /** 加载状态 */
  loading?: boolean;
  /** 错误状态 */
  error?: boolean;
}

/**
 * 标签页状态管理
 */
export const useTabsStore = defineStore('tabs', () => {
  // 状态
  const tabs = ref<TabItem[]>([]);
  const activeTabKey = ref<string>('');
  const maxTabs = ref<number>(100);

  // 计算属性
  const activeTabs = computed(() => tabs.value);
  const activeTab = computed(() => tabs.value.find(tab => tab.key === activeTabKey.value));
  const tabsCount = computed(() => tabs.value.length);
  const canAddTab = computed(() => tabs.value.length < maxTabs.value);

  /**
   * 生成标签页唯一key
   * @param route - 路由对象
   * @returns 唯一标识
   */
  const generateTabKey = (route: RouteLocationNormalized): string => {
    const { path, params, query } = route;
    const paramStr = Object.keys(params).length ? JSON.stringify(params) : '';
    const queryStr = Object.keys(query).length ? JSON.stringify(query) : '';
    return `${path}${paramStr}${queryStr}`;
  };

  /**
   * 根据路由创建标签页
   * @param route - 路由对象
   * @returns 标签页对象
   */
  const createTabFromRoute = (route: RouteLocationNormalized): TabItem => {
    const key = generateTabKey(route);
    const title = (route.meta?.title as string) || route.name?.toString() || '未命名页面';
    const icon = route.meta?.icon as string;
    const isHome = route.path === '/' || route.name === 'Dashboard';

    return {
      key,
      title,
      path: route.path,
      icon,
      closable: !isHome,
      isHome,
      params: route.params,
      query: route.query,
      loading: false,
      error: false
    };
  };

  /**
   * 添加标签页
   * @param route - 路由对象
   * @returns 是否添加成功
   */
  const addTab = (route: RouteLocationNormalized): boolean => {
    const key = generateTabKey(route);

    // 检查是否已存在
    const existingTab = tabs.value.find(tab => tab.key === key);
    if (existingTab) {
      activeTabKey.value = key;
      return true;
    }

    // 检查是否超出最大数量
    if (!canAddTab.value) {
      console.warn(`标签页数量已达到最大限制: ${maxTabs.value}`);
      return false;
    }

    // 创建新标签页
    const newTab = createTabFromRoute(route);
    tabs.value.push(newTab);
    activeTabKey.value = key;

    return true;
  };

  /**
   * 移除标签页
   * @param key - 标签页key
   * @returns 是否移除成功
   */
  const removeTab = (key: string): boolean => {
    const index = tabs.value.findIndex(tab => tab.key === key);
    if (index === -1) return false;

    const tab = tabs.value[index];

    // 首页不可关闭
    if (tab.isHome) {
      console.warn('首页标签不可关闭');
      return false;
    }

    // 移除标签页
    tabs.value.splice(index, 1);

    // 如果关闭的是当前激活标签，需要切换到其他标签
    if (activeTabKey.value === key) {
      if (tabs.value.length > 0) {
        // 优先激活右侧标签，如果没有则激活左侧
        const nextIndex = index < tabs.value.length ? index : index - 1;
        activeTabKey.value = tabs.value[nextIndex].key;
      } else {
        activeTabKey.value = '';
      }
    }

    return true;
  };

  /**
   * 激活标签页
   * @param key - 标签页key
   */
  const setActiveTab = (key: string): void => {
    const tab = tabs.value.find(tab => tab.key === key);
    if (tab) {
      activeTabKey.value = key;
    }
  };

  /**
   * 关闭其他标签页
   * @param key - 保留的标签页key
   */
  const closeOtherTabs = (key: string): void => {
    tabs.value = tabs.value.filter(tab => tab.key === key || tab.isHome);
    activeTabKey.value = key;
  };

  /**
   * 关闭所有标签页（除首页）
   */
  const closeAllTabs = (): void => {
    tabs.value = tabs.value.filter(tab => tab.isHome);
    const homeTab = tabs.value.find(tab => tab.isHome);
    if (homeTab) {
      activeTabKey.value = homeTab.key;
    } else {
      activeTabKey.value = '';
    }
  };

  /**
   * 关闭左侧标签页
   * @param key - 基准标签页key
   */
  const closeLeftTabs = (key: string): void => {
    const index = tabs.value.findIndex(tab => tab.key === key);
    if (index === -1) return;

    const leftTabs = tabs.value.slice(0, index);
    const rightTabs = tabs.value.slice(index);

    // 保留首页和右侧标签
    tabs.value = [
      ...leftTabs.filter(tab => tab.isHome),
      ...rightTabs
    ];
  };

  /**
   * 关闭右侧标签页
   * @param key - 基准标签页key
   */
  const closeRightTabs = (key: string): void => {
    const index = tabs.value.findIndex(tab => tab.key === key);
    if (index === -1) return;

    const leftTabs = tabs.value.slice(0, index + 1);
    const rightTabs = tabs.value.slice(index + 1);

    // 保留左侧标签和首页
    tabs.value = [
      ...leftTabs,
      ...rightTabs.filter(tab => tab.isHome)
    ];
  };

  /**
   * 更新标签页状态
   * @param key - 标签页key
   * @param updates - 更新的属性
   */
  const updateTab = (key: string, updates: Partial<TabItem>): void => {
    const tab = tabs.value.find(tab => tab.key === key);
    if (tab) {
      Object.assign(tab, updates);
    }
  };

  /**
   * 设置标签页加载状态
   * @param key - 标签页key
   * @param loading - 加载状态
   */
  const setTabLoading = (key: string, loading: boolean): void => {
    updateTab(key, { loading });
  };

  /**
   * 设置标签页错误状态
   * @param key - 标签页key
   * @param error - 错误状态
   */
  const setTabError = (key: string, error: boolean): void => {
    updateTab(key, { error });
  };

  /**
   * 初始化首页标签
   */
  const initHomeTab = (): void => {
    const homeTab: TabItem = {
      key: 'home',
      title: '首页',
      path: '/',
      icon: 'pi pi-home',
      closable: false,
      isHome: true,
      loading: false,
      error: false
    };

    if (!tabs.value.some(tab => tab.isHome)) {
      tabs.value.unshift(homeTab);
    }

    if (!activeTabKey.value) {
      activeTabKey.value = homeTab.key;
    }
  };

  /**
   * 重置标签页状态
   */
  const resetTabs = (): void => {
    tabs.value = [];
    activeTabKey.value = '';
  };

  return {
    // 状态
    tabs,
    activeTabKey,
    maxTabs,

    // 计算属性
    activeTabs,
    activeTab,
    tabsCount,
    canAddTab,

    // 方法
    generateTabKey,
    createTabFromRoute,
    addTab,
    removeTab,
    setActiveTab,
    closeOtherTabs,
    closeAllTabs,
    closeLeftTabs,
    closeRightTabs,
    updateTab,
    setTabLoading,
    setTabError,
    resetTabs
  };
});

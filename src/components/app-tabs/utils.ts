import type { RouteLocationNormalized } from 'vue-router';
import type { TabItem } from '@/stores/tabs.ts';

/**
 * 生成标签页唯一键
 * @param route - 路由对象
 * @returns 唯一键
 */
export function generateTabKey(route: RouteLocationNormalized): string {
  const { path, params, query } = route;

  // 基础路径
  let key = path;

  // 添加参数
  if (params && Object.keys(params).length > 0) {
    const paramStr = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    key += `?${paramStr}`;
  }

  // 添加查询参数
  if (query && Object.keys(query).length > 0) {
    const queryStr = Object.entries(query)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    key += key.includes('?') ? `&${queryStr}` : `?${queryStr}`;
  }

  return key;
}

/**
 * 从路由创建标签页对象
 * @param route - 路由对象
 * @returns 标签页对象
 */
export function createTabFromRoute(route: RouteLocationNormalized): TabItem {
  const key = generateTabKey(route);
  const title = (route.meta?.title as string) || route.name?.toString() || '未命名页面';
  const icon = route.meta?.icon as string;
  const closable = route.meta?.closable !== false; // 默认可关闭

  const isHome = route.path === '/' || route.path === '/dashboard' || route.path === '/home';

  return {
    key,
    title,
    icon,
    path: route.path,
    params: route.params,
    query: route.query,
    closable,
    loading: false,
    error: false,
    isHome
  };
}

/**
 * 检查标签页是否为首页
 * @param tab - 标签页对象
 * @returns 是否为首页
 */
export function isHomeTab(tab: TabItem): boolean {
  return tab.path === '/' || tab.path === '/dashboard' || tab.path === '/home';
}

/**
 * 获取标签页显示标题
 * @param tab - 标签页对象
 * @param maxLength - 最大长度
 * @returns 显示标题
 */
export function getTabDisplayTitle(tab: TabItem, maxLength: number = 12): string {
  if (tab.title.length <= maxLength) {
    return tab.title;
  }

  return `${tab.title.slice(0, maxLength - 3)}...`;
}

/**
 * 验证标签页数据
 * @param tab - 标签页对象
 * @returns 验证结果
 */
export function validateTab(tab: Partial<TabItem>): tab is TabItem {
  return !!(tab.key && tab.title && tab.path);
}

/**
 * 比较两个标签页是否相同
 * @param tab1 - 标签页1
 * @param tab2 - 标签页2
 * @returns 是否相同
 */
export function isSameTab(tab1: TabItem, tab2: TabItem): boolean {
  return tab1.key === tab2.key;
}

/**
 * 获取标签页在数组中的索引
 * @param tabs - 标签页数组
 * @param targetTab - 目标标签页
 * @returns 索引位置，未找到返回-1
 */
export function getTabIndex(tabs: TabItem[], targetTab: TabItem): number {
  return tabs.findIndex(tab => isSameTab(tab, targetTab));
}

/**
 * 过滤可关闭的标签页
 * @param tabs - 标签页数组
 * @returns 可关闭的标签页数组
 */
export function getClosableTabs(tabs: TabItem[]): TabItem[] {
  return tabs.filter(tab => tab.closable);
}

/**
 * 获取标签页左侧的所有标签
 * @param tabs - 标签页数组
 * @param targetTab - 目标标签页
 * @returns 左侧标签页数组
 */
export function getLeftTabs(tabs: TabItem[], targetTab: TabItem): TabItem[] {
  const index = getTabIndex(tabs, targetTab);
  return index > 0 ? tabs.slice(0, index) : [];
}

/**
 * 获取标签页右侧的所有标签
 * @param tabs - 标签页数组
 * @param targetTab - 目标标签页
 * @returns 右侧标签页数组
 */
export function getRightTabs(tabs: TabItem[], targetTab: TabItem): TabItem[] {
  const index = getTabIndex(tabs, targetTab);
  return index >= 0 && index < tabs.length - 1 ? tabs.slice(index + 1) : [];
}

/**
 * 获取除指定标签外的其他标签
 * @param tabs - 标签页数组
 * @param targetTab - 目标标签页
 * @returns 其他标签页数组
 */
export function getOtherTabs(tabs: TabItem[], targetTab: TabItem): TabItem[] {
  return tabs.filter(tab => !isSameTab(tab, targetTab));
}

/**
 * 序列化标签页数据用于存储
 * @param tabs - 标签页数组
 * @returns 序列化字符串
 */
export function serializeTabs(tabs: TabItem[]): string {
  try {
    return JSON.stringify(tabs);
  } catch (error) {
    console.error('序列化标签页数据失败:', error);
    return '[]';
  }
}

/**
 * 反序列化标签页数据
 * @param data - 序列化字符串
 * @returns 标签页数组
 */
export function deserializeTabs(data: string): TabItem[] {
  try {
    const tabs = JSON.parse(data);
    return Array.isArray(tabs) ? tabs.filter(validateTab) : [];
  } catch (error) {
    console.error('反序列化标签页数据失败:', error);
    return [];
  }
}

/**
 * 清理无效的标签页数据
 * @param tabs - 标签页数组
 * @returns 清理后的标签页数组
 */
export function cleanupTabs(tabs: TabItem[]): TabItem[] {
  return tabs.filter(validateTab);
}

/**
 * 获取标签页的存储键
 * @param userId - 用户ID（可选）
 * @returns 存储键
 */
export function getTabsStorageKey(userId?: string): string {
  return userId ? `app_tabs_${userId}` : 'app_tabs';
}

/**
 * 检查是否超过最大标签数量
 * @param tabs - 当前标签页数组
 * @param maxTabs - 最大标签数量
 * @returns 是否超过限制
 */
export function isExceedMaxTabs(tabs: TabItem[], maxTabs: number): boolean {
  return tabs.length >= maxTabs;
}

/**
 * 获取下一个激活的标签页
 * @param tabs - 标签页数组
 * @param currentTab - 当前标签页
 * @returns 下一个激活的标签页
 */
export function getNextActiveTab(tabs: TabItem[], currentTab: TabItem): TabItem | null {
  if (tabs.length <= 1) return null;

  const currentIndex = getTabIndex(tabs, currentTab);
  if (currentIndex === -1) return tabs[0];

  // 优先选择右侧标签
  if (currentIndex < tabs.length - 1) {
    return tabs[currentIndex + 1];
  }

  // 否则选择左侧标签
  if (currentIndex > 0) {
    return tabs[currentIndex - 1];
  }

  return null;
}

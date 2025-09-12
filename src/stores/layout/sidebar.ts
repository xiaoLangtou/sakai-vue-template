import { ref, watch } from 'vue'

/**
 * 侧边栏模式枚举
 */
export enum SidebarMode {
  RELATIVE = 'relative',
  FIXED = 'fixed'
}

/**
 * 侧边栏状态管理
 */
export function useSidebar(layoutState: any, windowWidth: any) {
  // ==================== 侧边栏状态 ====================

  /** 移动端侧边栏显示状态 */
  const showMobileSidebar = ref<boolean>(false);

  /** 侧边栏完全隐藏状态 */
  const sidebarHidden = ref<boolean>(false);

  /** 侧边栏模式状态 - Fixed 或 Relative */
  const sidebarFixedMode = ref<boolean>(false);

  // ==================== 侧边栏状态变量 ====================

  /** 当前侧边栏模式 */
  const currentSidebarMode = ref<SidebarMode>(SidebarMode.RELATIVE);

  /** 侧边栏是否激活（显示状态） */
  const isSidebarActive = ref<boolean>(true);

  /** 侧边栏是否折叠 */
  const isCollapsed = ref<boolean>(false);

  /**
   * 更新侧边栏状态
   */
  const updateSidebarStates = (): void => {
    // 更新侧边栏模式
    currentSidebarMode.value = sidebarFixedMode.value ? SidebarMode.FIXED : SidebarMode.RELATIVE;

    // 更新侧边栏激活状态
    const width = windowWidth.value;
    if (width < 1024) {
      isSidebarActive.value = showMobileSidebar.value;
      isCollapsed.value = false;
    } else {
      isSidebarActive.value = !sidebarHidden.value;
      isCollapsed.value = layoutState.value.staticMenuDesktopInactive;
    }
  };

  // 监听相关状态变化，更新侧边栏状态
  watch([windowWidth, sidebarFixedMode, showMobileSidebar, sidebarHidden, () => layoutState.value.staticMenuDesktopInactive], () => {
    updateSidebarStates();
  }, { immediate: true });

  // ==================== 侧边栏状态管理方法 ====================

  /**
   * 设置侧边栏隐藏状态
   */
  const setSidebarHidden = (hidden: boolean) => {
    sidebarHidden.value = hidden;
  };

  /**
   * 切换侧边栏隐藏状态（桌面端）
   */
  const toggleSidebarHidden = () => {
    sidebarHidden.value = !sidebarHidden.value;
  };

  /**
   * 切换侧边栏 Fixed 模式
   */
  const toggleSidebarFixedMode = () => {
    sidebarFixedMode.value = !sidebarFixedMode.value;
  };

  /**
   * 设置侧边栏为 Relative 模式
   */
  const setSidebarRelativeMode = () => {
    sidebarFixedMode.value = false;
  };

  /**
   * 设置侧边栏为 Fixed 模式
   */
  const setSidebarFixedMode = () => {
    sidebarFixedMode.value = true;
  };

  /**
   * 切换移动端侧边栏显示状态
   */
  const toggleMobileSidebar = () => {
    showMobileSidebar.value = !showMobileSidebar.value;
  };

  /**
   * 设置移动端侧边栏显示状态
   */
  const setMobileSidebar = (show: boolean) => {
    showMobileSidebar.value = show;
  };

  // ==================== 桌面端菜单状态管理方法 ====================

  /**
   * 切换桌面端菜单折叠状态
   */
  const toggleDesktopMenu = () => {
    layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive;
  };

  /**
   * 设置桌面端菜单展开状态
   */
  const setDesktopMenuExpanded = (expanded: boolean) => {
    layoutState.value.staticMenuDesktopInactive = !expanded;
  };

  return {
    // 基础状态
    showMobileSidebar,
    sidebarHidden,
    sidebarFixedMode,
    currentSidebarMode,
    isSidebarActive,
    isCollapsed,
    
    // 方法
    updateSidebarStates,
    setSidebarHidden,
    toggleSidebarHidden,
    toggleSidebarFixedMode,
    setSidebarRelativeMode,
    setSidebarFixedMode,
    toggleMobileSidebar,
    setMobileSidebar,
    toggleDesktopMenu,
    setDesktopMenuExpanded
  }
}
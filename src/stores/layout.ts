import type { LayoutConfig, LayoutState, MenuItem } from '@/types/layout';
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';

/**
 * 布局状态管理 Store
 */
export const useLayoutStore = defineStore('layout', () => {
  // ==================== 状态定义 ====================

  /** 布局配置 */
  const layoutConfig = ref<LayoutConfig>({
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
    layoutMode: 'sidebar',
    showTab: true,
    tabStyle: 'Fashion',
    isShowIcon: true
  });

  /** 布局状态 */
  const layoutState = ref<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
  });

  /** 窗口宽度 */
  const windowWidth = ref(window.innerWidth);

  /** 移动端侧边栏显示状态 */
  const showMobileSidebar = ref(false);

  // ==================== 计算属性 ====================

  /** 是否为移动端 */
  const isMobile = computed(() => windowWidth.value < 768);

  /** 是否为平板端 */
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1600);

  /** 是否为桌面端 */
  const isDesktop = computed(() => windowWidth.value >= 1600);

  /** 侧边栏是否激活 */
  const isSidebarActive = computed(() => {
    if (isMobile.value || isTablet.value) {
      return showMobileSidebar.value;
    }
    return !layoutState.value.staticMenuDesktopInactive;
  });

  /** 侧边栏是否折叠 */
  const isCollapsed = computed(() => {
    if (isMobile.value || isTablet.value) {
      return !showMobileSidebar.value;
    }
    return layoutState.value.staticMenuDesktopInactive;
  });

  /** 是否为暗色主题 */
  const isDarkTheme = computed(() => layoutConfig.value.darkTheme);

  /** 获取主色调 */
  const getPrimary = computed(() => layoutConfig.value.primary);

  /** 获取表面颜色 */
  const getSurface = computed(() => layoutConfig.value.surface);

  /** 是否显示标签页 */
  const isShowTab = computed({
    get: () => layoutConfig.value.showTab,
    set: (value: boolean) => {
      layoutConfig.value.showTab = value;
    }
  });

  /** 标签页样式 */
  const tabStyle = computed({
    get: () => layoutConfig.value.tabStyle,
    set: (value: 'Fashion' | 'Card' | 'Square') => {
      layoutConfig.value.tabStyle = value;
    }
  });

  /** 是否显示图标 */
  const isShowIcon = computed({
    get: () => layoutConfig.value.isShowIcon,
    set: (value: boolean) => {
      layoutConfig.value.isShowIcon = value;
    }
  });

  // ==================== 方法定义 ====================

  /**
   * 监听窗口大小变化
   */
  const handleResize = () => {
    const prevWidth = windowWidth.value;
    windowWidth.value = window.innerWidth;

    // 检测屏幕大小变化
    const wasMobile = prevWidth < 768;
    const wasTablet = prevWidth >= 768 && prevWidth < 1600;
    const wasDesktop = prevWidth >= 1600;

    // 当从移动端或平板端切换到桌面端时
    if (!wasDesktop && isDesktop.value) {
      // 关闭移动端/平板端侧边栏
      if (showMobileSidebar.value) {
        showMobileSidebar.value = false;
      }
      // 自动展开桌面端侧边栏
      if (layoutState.value.staticMenuDesktopInactive) {
        layoutState.value.staticMenuDesktopInactive = false;
      }
    }
    // 当从桌面端切换到移动端或平板端时
    else if (wasDesktop && (isMobile.value || isTablet.value)) {
      // 关闭移动端/平板端侧边栏
      if (showMobileSidebar.value) {
        showMobileSidebar.value = false;
      }
    }
    // 当在移动端和平板端之间切换时
    else if ((wasMobile && isTablet.value) || (wasTablet && isMobile.value)) {
      // 关闭侧边栏，让用户重新选择
      if (showMobileSidebar.value) {
        showMobileSidebar.value = false;
      }
    }
  };

  /**
   * 初始化布局
   */
  const initLayout = () => {
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    // 确保主题在应用启动时正确应用
    nextTick(() => {
      // 触发主题更新事件，确保配置器能够应用当前的主题设置
      const event = new CustomEvent('layout-config-changed', {
        detail: {
          primary: layoutConfig.value.primary,
          surface: layoutConfig.value.surface
        }
      });
      window.dispatchEvent(event);
    });
  };

  /**
   * 销毁布局监听器
   */
  const destroyLayout = () => {
    window.removeEventListener('resize', handleResize);
  };

  /**
   * 设置激活的菜单项
   * @param item - 菜单项
   */
  const setActiveMenuItem = (item: MenuItem): void => {
    layoutState.value.activeMenuItem = item.value || item;
  };

  /**
   * 执行暗色模式切换
   */
  const executeDarkModeToggle = (): void => {
    layoutConfig.value.darkTheme = !layoutConfig.value.darkTheme;
    document.documentElement.classList.toggle('app-dark');
  };

  /**
   * 切换暗色模式
   * @param event - 鼠标事件（用于动画效果）
   */
  const toggleDarkMode = (event?: MouseEvent): void => {
    // 检查浏览器是否支持 View Transition API
    if (!document.startViewTransition) {
      executeDarkModeToggle();
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 设置CSS变量
    document.documentElement.style.setProperty('--x', x + 'px');
    document.documentElement.style.setProperty('--y', y + 'px');
    document.documentElement.style.setProperty('--r', endRadius + 'px');
    document.startViewTransition(() => executeDarkModeToggle());
  };

  /**
   * 切换菜单
   */
  const toggleMenu = (): void => {
    if (isMobile.value || isTablet.value) {
      showMobileSidebar.value = !showMobileSidebar.value;
    } else {
      layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive;
    }
  };

  /**
   * 关闭移动端侧边栏
   */
  const closeMobileSidebar = (): void => {
    showMobileSidebar.value = false;
  };

  /**
   * 切换侧边栏
   */
  const toggleSidebar = (): void => {
    toggleMenu();
  };

  /**
   * 打开配置抽屉
   */
  const openConfigDrawer = (): void => {
    layoutState.value.configSidebarVisible = true;
  };

  /**
   * 更新布局配置
   * @param config - 部分配置对象
   */
  const updateLayoutConfig = (config: Partial<LayoutConfig>): void => {
    Object.assign(layoutConfig.value, config);
  };

  /**
   * 更新布局状态
   * @param state - 部分状态对象
   */
  const updateLayoutState = (state: Partial<LayoutState>): void => {
    Object.assign(layoutState.value, state);
  };

  /**
   * 重置布局配置为默认值
   */
  const resetLayoutConfig = (): void => {
    layoutConfig.value = {
      preset: 'Aura',
      primary: 'emerald',
      surface: null,
      darkTheme: false,
      menuMode: 'static',
      layoutMode: 'sidebar',
      showTab: true,
      tabStyle: 'Fashion',
      isShowIcon: true
    };
  };

  /**
   * 重置布局状态为默认值
   */
  const resetLayoutState = (): void => {
    layoutState.value = {
      staticMenuDesktopInactive: false,
      overlayMenuActive: false,
      profileSidebarVisible: false,
      configSidebarVisible: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
      activeMenuItem: null
    };
  };

  // ==================== 返回值 ====================

  return {
    // 状态
    layoutConfig,
    layoutState,
    windowWidth,
    showMobileSidebar,

    // 计算属性
    isMobile,
    isTablet,
    isDesktop,
    isSidebarActive,
    isCollapsed,
    isDarkTheme,
    getPrimary,
    getSurface,
    isShowTab,
    tabStyle,
    isShowIcon,

    // 方法
    initLayout,
    destroyLayout,
    handleResize,
    setActiveMenuItem,
    toggleDarkMode,
    toggleMenu,
    closeMobileSidebar,
    toggleSidebar,
    openConfigDrawer,
    updateLayoutConfig,
    updateLayoutState,
    resetLayoutConfig,
    resetLayoutState
  };
}, {
  persist: {
    key: 'layout-store',
    storage: localStorage
  }
});

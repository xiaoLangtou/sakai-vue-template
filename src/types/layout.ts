/**
 * 布局配置类型定义
 */
export interface LayoutConfig {
  /** 主题预设 */
  preset: string;
  /** 主色调 */
  primary: string;
  /** 表面颜色 */
  surface: string | null;
  /** 是否为暗色主题 */
  darkTheme: boolean;
  /** 菜单模式 */
  menuMode: 'static' | 'overlay';
  /** 布局模式 */
  layoutMode: 'sidebar' | 'topbar';
}

/**
 * 布局状态类型定义
 */
export interface LayoutState {
  /** 桌面端静态菜单是否非激活状态 */
  staticMenuDesktopInactive: boolean;
  /** 覆盖菜单是否激活 */
  overlayMenuActive: boolean;
  /** 用户资料侧边栏是否可见 */
  profileSidebarVisible: boolean;
  /** 配置侧边栏是否可见 */
  configSidebarVisible: boolean;
  /** 移动端静态菜单是否激活 */
  staticMenuMobileActive: boolean;
  /** 菜单悬停是否激活 */
  menuHoverActive: boolean;
  /** 当前激活的菜单项 */
  activeMenuItem: any;
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  value?: any;
  [key: string]: any;
}

/**
 * 布局 Composable 返回类型
 */
export interface UseLayoutReturn {
  layoutConfig: LayoutConfig;
  layoutState: LayoutState;
  toggleMenu: () => void;
  isSidebarActive: import('vue').ComputedRef<boolean>;
  isCollapsed: import('vue').ComputedRef<boolean>;
  toggleSidebar: () => void;
  isDarkTheme: import('vue').ComputedRef<boolean>;
  getPrimary: import('vue').ComputedRef<string>;
  getSurface: import('vue').ComputedRef<string | null>;
  setActiveMenuItem: (item: MenuItem) => void;
  toggleDarkMode: () => void;
  // 响应式相关
  isMobile: import('vue').ComputedRef<boolean>;
  isTablet: import('vue').ComputedRef<boolean>;
  isDesktop: import('vue').ComputedRef<boolean>;
  showMobileSidebar: import('vue').Ref<boolean>;
  closeMobileSidebar: () => void;
  windowWidth: import('vue').Ref<number>;
}

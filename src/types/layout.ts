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
    /** 布局模式 */
    layoutMode: 'sidebar' | 'topbar';
    /** 是否显示标签页 */
    showTab: boolean;
    /** 标签页样式 */
    tabStyle: 'Card' | 'Square';
    /** 标签页是否显示图标 */
    isShowIcon: boolean;
    /** 标签页是否持久化*/
    isPersistTab: boolean;
    /** 是否显示头部 */
    isShowHeader: boolean;

    /** 是否启用全局搜索 */
    isEnableSearch: boolean;
    /** 是否启用主题切换 */
    isEnableTheme: boolean;
    /** 是否启用全屏 */
    isEnableFullScreen: boolean;
    /** 是否启用通知 */
    isEnableNotification: boolean;
    /** 是否启用侧边栏切换 */
    isEnableSidebarToggle: boolean;
    /** 是否显示底部 */
    isShowFooter: boolean;
    /** 是否启用版权  */
    isShowCopyright: boolean;
    /** 公司名 */
    companyName: string;
    /** 公司主页 */
    companyHomepage: string;
    /** 日期 */
    date: string;
    /** ICP 备案号*/
    icp: string;
    /** ICP 网站链接*/
    icpLink: string;
    /** 是否显示水印 */
    isShowWatermark: boolean;
    /** 水印文字 */
    watermarkText: string;
    /** 色弱模式 */
    isEnableColorWeak: boolean;
    /** 灰色模式 */
    isEnableGray: boolean;
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
 * 响应式断点类型枚举
 */
export enum BreakpointType {
    /** 移动端 (0-767px) */
    MOBILE = 'mobile',
    /** 平板端 (768-1023px) */
    TABLET = 'tablet',
    /** 桌面端 (1024-1439px) */
    DESKTOP = 'desktop',
    /** 宽屏端 (1440px+) */
    WIDE = 'wide'
}

/**
 * 侧边栏模式类型枚举
 */
export enum SidebarMode {
    /** 相对定位模式 - 默认模式 */
    RELATIVE = 'relative',
    /** 固定定位模式 - 悬停显示 */
    FIXED = 'fixed'
}

/**
 * 布局事件类型定义
 */
export interface LayoutEvents {
    /** 切换侧边栏事件 */
    'toggle-sidebar': [];
    /** 菜单项点击事件 */
    'menu-item-click': [];
    /** 主题切换事件 */
    'theme-change': [isDark: boolean];
    /** 断点变化事件 */
    'breakpoint-change': [breakpoint: BreakpointType];
}

/**
 * 侧边栏组件 Props 类型
 */
export interface SidebarProps {
    /** 是否折叠状态 */
    collapsed?: boolean;
    /** 是否为移动端 */
    isMobile?: boolean;
}

/**
 * 菜单组件 Props 类型
 */
export interface MenuProps {
    /** 是否折叠状态 */
    collapsed?: boolean;
    /** 是否为移动端 */
    isMobile?: boolean;
}

/**
 * 布局存储状态类型
 */
export interface LayoutStoreState {
    /** 布局配置 */
    layoutConfig: LayoutConfig;
    /** 布局状态 */
    layoutState: LayoutState;
    /** 窗口宽度 */
    windowWidth: number;
    /** 移动端侧边栏显示状态 */
    showMobileSidebar: boolean;
    /** 侧边栏完全隐藏状态 */
    sidebarHidden: boolean;
    /** 侧边栏模式状态 */
    sidebarFixedMode: boolean;
}

/**
 * 布局存储计算属性类型
 */
export interface LayoutStoreGetters {
    /** 当前断点类型 */
    currentBreakpoint: BreakpointType;
    /** 是否为移动端 */
    isMobile: boolean;
    /** 是否为平板端 */
    isTablet: boolean;
    /** 是否为桌面端 */
    isDesktop: boolean;
    /** 是否为宽屏端 */
    isWide: boolean;
    /** 当前侧边栏模式 */
    currentSidebarMode: SidebarMode;
    /** 侧边栏是否激活 */
    isSidebarActive: boolean;
    /** 侧边栏是否折叠 */
    isCollapsed: boolean;
    /** 是否为暗色主题 */
    isDarkTheme: boolean;
}

/**
 * 布局存储方法类型
 */
export interface LayoutStoreMethods {
    /** 初始化布局 */
    initLayout(): Promise<void>;
    /** 销毁布局监听器 */
    destroyLayout(): void;
    /** 处理窗口大小变化 */
    handleResize(): void;
    /** 处理断点变化 */
    handleBreakpointChange(prevBreakpoint: BreakpointType, newBreakpoint: BreakpointType): void;
    /** 切换侧边栏隐藏状态 */
    toggleSidebarHidden(): void;
    /** 设置侧边栏隐藏状态 */
    setSidebarHidden(hidden: boolean): void;
    /** 切换侧边栏 Fixed 模式 */
    toggleSidebarFixedMode(): void;
    /** 设置侧边栏为 Relative 模式 */
    setSidebarRelativeMode(): void;
    /** 设置侧边栏为 Fixed 模式 */
    setSidebarFixedMode(): void;
    /** 切换移动端侧边栏 */
    toggleMobileSidebar(): void;
    /** 设置移动端侧边栏状态 */
    setMobileSidebar(show: boolean): void;
    /** 切换桌面端菜单 */
    toggleDesktopMenu(): void;
    /** 设置桌面端菜单展开状态 */
    setDesktopMenuExpanded(expanded: boolean): void;
    /** 打开配置抽屉 */
    openConfigDrawer(): void;
    /** 关闭配置抽屉 */
    closeConfigDrawer(): void;
    /** 切换配置抽屉 */
    toggleConfigDrawer(): void;
    /** 切换暗色主题 */
    toggleDarkMode(event?: MouseEvent): void;
    /** 切换菜单 */
    toggleMenu(): void;
    /** 关闭移动端侧边栏 */
    closeMobileSidebar(): void;
}

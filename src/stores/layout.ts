import { defaultPreferences } from '@/preferences/config.ts';
import type { LayoutConfig, LayoutState } from '@/types/layout';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { BreakpointType, useBreakpoint } from './layout/breakpoint';
import { SidebarMode, useSidebar } from './layout/sidebar';
import { useTheme } from './layout/theme';
import { useConfig } from './layout/config';
import { useLifecycle } from './layout/lifecycle';

// 导出枚举供外部使用
export { BreakpointType, SidebarMode };

/**
 * 布局状态管理 Store
 *
 * 负责管理整个应用的布局状态，包括：
 * - 响应式断点管理
 * - 侧边栏状态管理
 * - 主题配置管理
 * - 移动端适配
 */
export const useLayoutStore = defineStore('layout', () => {
    // ==================== 核心状态定义 ====================

    /** 布局配置 - 主题、颜色、标签页等设置 */
    const layoutConfig = ref<LayoutConfig>(defaultPreferences);

    /** 布局状态 - 菜单激活、抽屉显示等状态 */
    const layoutState = ref<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        activeMenuItem: null
    });

    /** 窗口宽度 - 用于响应式断点判断 */
    const windowWidth = ref<number>(window.innerWidth);

    // ==================== 模块化功能 ====================

    // 断点管理模块
    const breakpointModule = useBreakpoint();

    // 侧边栏管理模块
    const sidebarModule = useSidebar(layoutState, windowWidth);

    // 主题管理模块
    const themeModule = useTheme(layoutConfig);

    // 配置管理模块
    const configModule = useConfig(layoutConfig, layoutState);

    // 生命周期管理模块
    const lifecycleModule = useLifecycle(
        layoutConfig,
        layoutState,
        breakpointModule.currentBreakpoint,
        breakpointModule.handleResize
    );

    // ==================== 其他方法 ====================

    /**
     * 切换菜单
     */
    const toggleMenu = (): void => {
        const width = windowWidth.value;
        if ( width < 1024 ) {
            sidebarModule.showMobileSidebar.value = !sidebarModule.showMobileSidebar.value;
        } else {
            layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive;
        }
    };

    /**
     * 关闭移动端侧边栏
     */
    const closeMobileSidebar = (): void => {
        sidebarModule.showMobileSidebar.value = false;
    };

    /**
     * 智能切换侧边栏显示状态
     * - 点击时完全隐藏/显示侧边栏
     * - Fixed模式且隐藏时，显示时切换为Relative模式
     */
    const smartToggleSidebar = (): void => {
        const isMobileDevice = breakpointModule.isMobile.value || breakpointModule.isTablet.value;

        if ( isMobileDevice ) {
            sidebarModule.toggleMobileSidebar();
            return;
        }

        const isHidden = sidebarModule.sidebarHidden.value;
        const isFixed = sidebarModule.sidebarFixedMode.value;

        if ( !isFixed ) {
            return sidebarModule.setSidebarHidden(!isHidden);
        } else if ( !isHidden ) {
            sidebarModule.setSidebarRelativeMode();
            return sidebarModule.setSidebarHidden(false);
        }
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
        Object.assign(layoutConfig.value, defaultPreferences);
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
        // ==================== 基础状态 ====================
        layoutConfig,
        layoutState,
        windowWidth,
        showMobileSidebar: sidebarModule.showMobileSidebar,
        sidebarHidden: sidebarModule.sidebarHidden,
        sidebarFixedMode: sidebarModule.sidebarFixedMode,

        // ==================== 响应式断点计算属性 ====================
        currentBreakpoint: breakpointModule.currentBreakpoint,
        isMobile: breakpointModule.isMobile,
        isTablet: breakpointModule.isTablet,
        isDesktop: breakpointModule.isDesktop,
        isWide: breakpointModule.isWide,

        // ==================== 侧边栏状态计算属性 ====================
        currentSidebarMode: sidebarModule.currentSidebarMode,
        isSidebarActive: sidebarModule.isSidebarActive,
        isCollapsed: sidebarModule.isCollapsed,

        // ==================== 主题状态计算属性 ====================
        isDarkTheme: themeModule.isDarkTheme,
        getPrimary: themeModule.getPrimary,
        getSurface: themeModule.getSurface,

        // ==================== 标签页和布局配置变量 ====================
        isShowTab: configModule.isShowTab,
        tabStyle: configModule.tabStyle,
        isShowIcon: configModule.isShowIcon,
        isShowHeader: configModule.isShowHeader,
        isShowFooter: configModule.isShowFooter,
        companyName: configModule.companyName,
        companyHomepage: configModule.companyHomepage,
        date: configModule.date,
        icp: configModule.icp,
        icpLink: configModule.icpLink,


        // ==================== 响应式处理方法 ====================
        handleResize: breakpointModule.handleResize,
        handleBreakpointChange: breakpointModule.handleBreakpointChange,

        // ==================== 侧边栏状态管理方法 ====================
        toggleSidebarHidden: sidebarModule.toggleSidebarHidden,
        setSidebarHidden: sidebarModule.setSidebarHidden,
        toggleSidebarFixedMode: sidebarModule.toggleSidebarFixedMode,
        setSidebarRelativeMode: sidebarModule.setSidebarRelativeMode,
        setSidebarFixedMode: sidebarModule.setSidebarFixedMode,
        toggleMobileSidebar: sidebarModule.toggleMobileSidebar,
        setMobileSidebar: sidebarModule.setMobileSidebar,

        // ==================== 桌面端菜单状态管理方法 ====================
        toggleDesktopMenu: sidebarModule.toggleDesktopMenu,
        setDesktopMenuExpanded: sidebarModule.setDesktopMenuExpanded,

        // ==================== 配置抽屉管理方法 ====================
        openConfigDrawer: configModule.openConfigDrawer,
        closeConfigDrawer: configModule.closeConfigDrawer,
        toggleConfigDrawer: configModule.toggleConfigDrawer,

        // ==================== 其他方法 ====================
        initLayout: lifecycleModule.initLayout,
        destroyLayout: lifecycleModule.destroyLayout,
        setActiveMenuItem: lifecycleModule.setActiveMenuItem,
        toggleDarkMode: themeModule.toggleDarkMode,
        toggleMenu,
        closeMobileSidebar,
        smartToggleSidebar,
        setPrimary: themeModule.setPrimary,
        setSurface: themeModule.setSurface,
        updateLayoutConfig,
        updateLayoutState,
        resetLayoutConfig,
        resetLayoutState,
        generateConfigString:configModule.generateConfigString
    };
}, {
    persist: {
        key: 'layout-store',
        storage: localStorage
    }
});

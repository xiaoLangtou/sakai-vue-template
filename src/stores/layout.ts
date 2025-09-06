import type { LayoutConfig, LayoutState, MenuItem } from '@/types/layout';
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { defaultPreferences } from '@/preferences/config.ts';

/**
 * 响应式断点枚举
 */
export enum BreakpointType {
    MOBILE = 'mobile',
    TABLET = 'tablet',
    DESKTOP = 'desktop',
    WIDE = 'wide'
}

/**
 * 侧边栏模式枚举
 */
export enum SidebarMode {
    RELATIVE = 'relative',
    FIXED = 'fixed'
}

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

    // ==================== 响应式状态 ====================

    /** 窗口宽度 - 用于响应式断点判断 */
    const windowWidth = ref<number>(window.innerWidth);

    // ==================== 侧边栏状态 ====================

    /** 移动端侧边栏显示状态 */
    const showMobileSidebar = ref<boolean>(false);

    /** 侧边栏完全隐藏状态 */
    const sidebarHidden = ref<boolean>(false);

    /** 侧边栏模式状态 - Fixed 或 Relative */
    const sidebarFixedMode = ref<boolean>(false);

    // ==================== 响应式断点计算属性 ====================

    /** 当前断点类型 */
    const currentBreakpoint = computed<BreakpointType>(() => {
        const width = windowWidth.value;
        if ( width < 768 ) return BreakpointType.MOBILE;
        if ( width >= 768 && width <= 1023 ) return BreakpointType.TABLET;
        if ( width >= 1024 && width <= 1439 ) return BreakpointType.DESKTOP;
        return BreakpointType.WIDE;
    });

    /** 是否为移动端 */
    const isMobile = computed(() => currentBreakpoint.value === BreakpointType.MOBILE);

    /** 是否为平板端 */
    const isTablet = computed(() => currentBreakpoint.value === BreakpointType.TABLET);

    /** 是否为桌面端 */
    const isDesktop = computed(() => currentBreakpoint.value === BreakpointType.DESKTOP);

    /** 是否为宽屏桌面端 */
    const isWide = computed(() => currentBreakpoint.value === BreakpointType.WIDE);

    // ==================== 侧边栏状态计算属性 ====================

    /** 当前侧边栏模式 */
    const currentSidebarMode = computed<SidebarMode>(() =>
        sidebarFixedMode.value ? SidebarMode.FIXED : SidebarMode.RELATIVE
    );

    /** 侧边栏是否激活（显示状态） */
    const isSidebarActive = computed(() => {
        // 移动端和平板端使用抽屉模式
        if ( isMobile.value || isTablet.value ) {
            return showMobileSidebar.value;
        }
        return !sidebarHidden.value;
    });

    /** 侧边栏是否折叠 */
    const isCollapsed = computed(() => {
        // 移动端和平板端不支持折叠，使用抽屉模式
        if ( isMobile.value || isTablet.value ) {
            return false;
        }
        // 桌面端根据配置判断
        return layoutState.value.staticMenuDesktopInactive;
    });

    // ==================== 主题状态计算属性 ====================

    /** 是否为暗色主题 */
    const isDarkTheme = computed(() => layoutConfig.value.darkTheme);

    /** 获取主色调 */
    const getPrimary = computed(() => layoutConfig.value.primary);

    /** 获取表面颜色 */
    const getSurface = computed(() => layoutConfig.value.surface);

    // ==================== 标签页配置计算属性 ====================

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

    // ==================== 响应式处理方法 ====================

    /**
     * 防抖处理的窗口大小变化监听
     */
    let resizeTimer: NodeJS.Timeout | null = null;

    /**
     * 监听窗口大小变化并处理断点切换（带防抖优化）
     */
    const handleResize = (): void => {
        // 清除之前的定时器
        if ( resizeTimer ) {
            clearTimeout(resizeTimer);
        }

        // 防抖处理，避免频繁触发
        resizeTimer = setTimeout(() => {
            const prevBreakpoint = currentBreakpoint.value;

            // 更新窗口宽度
            windowWidth.value = window.innerWidth;
            const newBreakpoint = currentBreakpoint.value;

            // 如果断点发生变化，处理相应逻辑
            if ( prevBreakpoint !== newBreakpoint ) {
                handleBreakpointChange(prevBreakpoint, newBreakpoint);
            }

            resizeTimer = null;
        }, 150); // 150ms 防抖延迟
    };

    /**
     * 处理断点变化时的状态调整
     */
    const handleBreakpointChange = (
        prevBreakpoint: BreakpointType,
        newBreakpoint: BreakpointType
    ) => {
        const wasMobileOrTablet = prevBreakpoint === BreakpointType.MOBILE ||
            prevBreakpoint === BreakpointType.TABLET;
        const isDesktopOrWide = newBreakpoint === BreakpointType.DESKTOP ||
            newBreakpoint === BreakpointType.WIDE;

        // 从移动端/平板端切换到桌面端/宽屏时
        if ( wasMobileOrTablet && isDesktopOrWide ) {
            // 关闭移动端侧边栏
            if ( showMobileSidebar.value ) {
                showMobileSidebar.value = false;
            }
            // 自动展开桌面端侧边栏
            if ( layoutState.value.staticMenuDesktopInactive ) {
                layoutState.value.staticMenuDesktopInactive = false;
            }
        }
        // 从桌面端/宽屏切换到移动端/平板端时
        else if ( isDesktopOrWide && ( newBreakpoint === BreakpointType.MOBILE || newBreakpoint === BreakpointType.TABLET ) ) {
            // 关闭移动端侧边栏（如果打开）
            if ( showMobileSidebar.value ) {
                showMobileSidebar.value = false;
            }
        }
    };

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

    // ==================== 配置抽屉管理方法 ====================

    /**
     * 打开配置抽屉
     */
    const openConfigDrawer = () => {
        layoutState.value.configSidebarVisible = true;
    };

    /**
     * 关闭配置抽屉
     */
    const closeConfigDrawer = () => {
        layoutState.value.configSidebarVisible = false;
    };

    /**
     * 切换配置抽屉显示状态
     */
    const toggleConfigDrawer = () => {
        layoutState.value.configSidebarVisible = !layoutState.value.configSidebarVisible;
    };

    /**
     * 设置主色调
     */
    const setPrimary = (primary: string) => {
        layoutConfig.value.primary = primary;
    };

    /**
     * 设置表面颜色
     */
    const setSurface = (surface: string) => {
        layoutConfig.value.surface = surface;
    };

    // ==================== 生命周期管理方法 ====================

    /**
     * 初始化布局系统
     */
    const initLayout = async (): Promise<void> => {
        // 添加窗口大小变化监听器（使用 passive 选项优化性能）
        window.addEventListener('resize', handleResize, { passive: true });

        // 初始化窗口尺寸
        windowWidth.value = window.innerWidth;

        // 等待 DOM 更新
        await nextTick();

        // 触发主题配置更新事件
        dispatchLayoutConfigEvent();

        // 添加页面可见性变化监听（优化性能）
        document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    };

    /**
     * 销毁布局监听器和清理资源
     */
    const destroyLayout = (): void => {
        // 移除事件监听器
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);

        // 清理定时器
        if ( resizeTimer ) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
        }
    };

    /**
     * 触发布局配置变更事件
     */
    const dispatchLayoutConfigEvent = (): void => {
        const event = new CustomEvent('layout-config-changed', {
            detail: {
                primary: layoutConfig.value.primary,
                surface: layoutConfig.value.surface,
                darkTheme: layoutConfig.value.darkTheme,
                breakpoint: currentBreakpoint.value
            }
        });
        window.dispatchEvent(event);
    };

    /**
     * 处理页面可见性变化（性能优化）
     */
    const handleVisibilityChange = (): void => {
        if ( document.visibilityState === 'visible' ) {
            // 页面重新可见时，重新检查窗口尺寸
            const currentWidth = window.innerWidth;
            if ( Math.abs(currentWidth - windowWidth.value) > 50 ) {
                handleResize();
            }
        }
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
     * @description 切换暗色模式
     * @param event - 鼠标事件（用于动画效果）
     */
    const toggleDarkMode = (event?: MouseEvent): void => {
        // 检查浏览器是否支持 View Transition API
        if ( !document.startViewTransition ) {
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
        if ( isMobile.value || isTablet.value ) {
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
     * 智能切换侧边栏显示状态
     * - 点击时完全隐藏/显示侧边栏
     * - Fixed模式且隐藏时，显示时切换为Relative模式
     */
    const smartToggleSidebar = (): void => {
        const isMobileDevice = isMobile.value || isTablet.value;

        if ( isMobileDevice ) {
            toggleMobileSidebar();
            return;
        }

        const isHidden = sidebarHidden.value;
        const isFixed = sidebarFixedMode.value;

        if ( !isFixed ) {
            return setSidebarHidden(!isHidden);
        } else if ( !isHidden ) {
            setSidebarRelativeMode();
            return setSidebarHidden(false);
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
        layoutConfig.value = {
            preset: 'Aura',
            primary: 'emerald',
            surface: null,
            darkTheme: false,
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
        // ==================== 基础状态 ====================
        layoutConfig,
        layoutState,
        windowWidth,
        showMobileSidebar,
        sidebarHidden,
        sidebarFixedMode,

        // ==================== 响应式断点计算属性 ====================
        currentBreakpoint,
        isMobile,
        isTablet,
        isDesktop,
        isWide,

        // ==================== 侧边栏状态计算属性 ====================
        currentSidebarMode,
        isSidebarActive,
        isCollapsed,

        // ==================== 主题状态计算属性 ====================
        isDarkTheme,
        getPrimary,
        getSurface,

        // ==================== 标签页配置计算属性 ====================
        isShowTab,
        tabStyle,
        isShowIcon,

        // ==================== 响应式处理方法 ====================
        handleResize,
        handleBreakpointChange,

        // ==================== 侧边栏状态管理方法 ====================
        toggleSidebarHidden,
        setSidebarHidden,
        toggleSidebarFixedMode,
        setSidebarRelativeMode,
        setSidebarFixedMode,
        toggleMobileSidebar,
        setMobileSidebar,

        // ==================== 桌面端菜单状态管理方法 ====================
        toggleDesktopMenu,
        setDesktopMenuExpanded,

        // ==================== 配置抽屉管理方法 ====================
        openConfigDrawer,
        closeConfigDrawer,
        toggleConfigDrawer,

        // ==================== 其他方法 ====================
        initLayout,
        destroyLayout,
        setActiveMenuItem,
        toggleDarkMode,
        toggleMenu,
        closeMobileSidebar,
        smartToggleSidebar,
        setPrimary,
        setSurface,
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

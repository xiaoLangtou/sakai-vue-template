/**
 * 布局尺寸配置文件
 * 与 SCSS 变量保持一致的 TypeScript 常量定义
 * 用于 Vue 组件的脚本部分和动态计算
 */

// ===== 侧边栏尺寸 =====
export const SIDEBAR_SIZES = {
    EXPANDED: 256,   // 16rem - 侧边栏展开宽度
    COLLAPSED: 70   // 4.375rem - 侧边栏折叠宽度
} as const;

// ===== 头部高度 =====
export const HEADER_HEIGHTS = {
    DESKTOP: 64,     // 4rem - 桌面端头部高度
    TABLET: 64,      // 4rem - 平板端头部高度
    MOBILE: 56      // 3.5rem - 移动端头部高度
} as const;

export const MENU_HEIGHTS = {
    DESKTOP: 48,     // 3rem - 桌面端菜单高度
    TABLET: 48,      // 3rem - 平板端菜单高度
    MOBILE: 40      // 2.5rem - 移动端菜单高度
} as const;

// ===== 标签页高度 =====
export const TABS_HEIGHTS = {
    DESKTOP: 40,     // 2.5rem - 桌面端标签页高度
    TABLET: 36,      // 2.25rem - 平板端标签页高度
    MOBILE: 32      // 2rem - 移动端标签页高度
} as const;

// ===== 底部高度 =====
export const FOOTER_HEIGHTS = {
    DESKTOP: 48,     // 3rem - 桌面端底部高度
    TABLET: 40,      // 2.5rem - 平板端底部高度
    MOBILE: 32      // 2rem - 移动端底部高度
} as const;

// ===== 操作按钮高度 =====
export const ACTION_BUTTON_HEIGHTS = {
    DESKTOP: 40,     // 2.5rem - 桌面端操作按钮高度
    TABLET: 36,      // 2.25rem - 平板端操作按钮高度
    MOBILE: 32      // 2rem - 移动端操作按钮高度
} as const;

// ===== 用户头像尺寸 =====
export const AVATAR_SIZES = {
    LARGE: 40,       // 2.5rem - 大尺寸头像
    MEDIUM: 30,      // 2rem - 中等尺寸头像
    SMALL: 24       // 1.5rem - 小尺寸头像
} as const;

// ===== 菜单项高度 =====
export const MENU_ITEM_HEIGHTS = {
    DESKTOP: 44,     // 2.75rem - 桌面端菜单项高度
    TABLET: 40,      // 2.5rem - 平板端菜单项高度
    MOBILE: 36      // 2.25rem - 移动端菜单项高度
} as const;

// ===== 内容区域内边距 =====
export const CONTENT_PADDINGS = {
    DESKTOP: 24,     // 1.5rem - 桌面端内容内边距
    TABLET: 16,      // 1rem - 平板端内容内边距
    MOBILE: 12      // 0.75rem - 移动端内容内边距
} as const;

// ===== 动画过渡时间 =====
export const TRANSITION_DURATIONS = {
    FAST: 200,       // 0.2s - 快速过渡
    NORMAL: 300,     // 0.3s - 正常过渡
    SLOW: 400,       // 0.4s - 慢速过渡
    SIDEBAR: 350    // 0.35s - 侧边栏动画
} as const;

// ===== Z-Index 层级 =====
export const Z_INDEXES = {
    SIDEBAR: 100,
    HEADER: 200,
    DROPDOWN: 300,
    MODAL: 400,
    TOAST: 500
} as const;

// ===== 组合高度计算 =====
/**
 * 计算顶部栏总高度
 * @param breakpoint 断点类型
 * @returns 顶部栏总高度（像素）
 */
export const getTopbarTotalHeight = (breakpoint: 'desktop' | 'tablet' | 'mobile'): number => {
    const headerHeight = HEADER_HEIGHTS[breakpoint.toUpperCase() as keyof typeof HEADER_HEIGHTS];
    const menuHeight = MENU_HEIGHTS[breakpoint.toUpperCase() as keyof typeof MENU_HEIGHTS];
    return headerHeight + menuHeight;
};

/**
 * 计算主内容区域可用高度
 * @param breakpoint 断点类型
 * @param viewportHeight 视口高度（默认使用 window.innerHeight）
 * @returns 主内容区域可用高度（像素）
 */
export const getMainContentHeight = (
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    viewportHeight: number = typeof window !== 'undefined' ? window.innerHeight : 1080
): number => {
    const topbarHeight = getTopbarTotalHeight(breakpoint);
    return viewportHeight - topbarHeight;
};

/**
 * 根据当前窗口宽度获取对应的断点类型
 * @param windowWidth 窗口宽度（默认使用 window.innerWidth）
 * @returns 断点类型
 */
export const getCurrentBreakpoint = (
    windowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1024
): 'desktop' | 'tablet' | 'mobile' => {
    if ( windowWidth < 768 ) return 'mobile';
    if ( windowWidth < 1024 ) return 'tablet';
    return 'desktop';
};

/**
 * 获取当前断点对应的布局尺寸
 * @param windowWidth 窗口宽度
 * @returns 当前断点的布局尺寸配置
 */
export const getCurrentLayoutSizes = (windowWidth?: number) => {
    const breakpoint = getCurrentBreakpoint(windowWidth);
    const upperBreakpoint = breakpoint.toUpperCase() as keyof typeof HEADER_HEIGHTS;

    return {
        breakpoint,
        headerHeight: HEADER_HEIGHTS[upperBreakpoint],
        menuHeight: MENU_HEIGHTS[upperBreakpoint],
        tabsHeight: TABS_HEIGHTS[upperBreakpoint],
        footerHeight: FOOTER_HEIGHTS[upperBreakpoint],
        actionButtonHeight: ACTION_BUTTON_HEIGHTS[upperBreakpoint],
        menuItemHeight: MENU_ITEM_HEIGHTS[upperBreakpoint],
        contentPadding: CONTENT_PADDINGS[upperBreakpoint],
        sidebarWidth: {
            expanded: SIDEBAR_SIZES.EXPANDED,
            collapsed: SIDEBAR_SIZES.COLLAPSED
        },
        topbarTotalHeight: getTopbarTotalHeight(breakpoint),
        mainContentHeight: getMainContentHeight(breakpoint)
    };
};

// ===== 类型定义 =====
export type BreakpointType = 'desktop' | 'tablet' | 'mobile';
export type LayoutSizes = ReturnType<typeof getCurrentLayoutSizes>;

// ===== 默认导出 =====
export default {
    SIDEBAR_SIZES,
    HEADER_HEIGHTS,
    MENU_HEIGHTS,
    TABS_HEIGHTS,
    FOOTER_HEIGHTS,
    ACTION_BUTTON_HEIGHTS,
    AVATAR_SIZES,
    MENU_ITEM_HEIGHTS,
    CONTENT_PADDINGS,
    TRANSITION_DURATIONS,
    Z_INDEXES,
    getTopbarTotalHeight,
    getMainContentHeight,
    getCurrentBreakpoint,
    getCurrentLayoutSizes
};

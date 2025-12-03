/**
 * 布局常量配置
 * 用于替换魔法数字，提高代码可维护性
 */

/**
 * 渐变遮罩位置常量
 */
export const GRADIENT_POSITIONS = {
    /** 仅显示标签页时的位置 */
    TAB_ONLY: 'top-[45px]',
    /** 同时显示标签页和头部时的位置 */
    TAB_AND_HEADER: 'top-[108px]',
    /** 默认位置 */
    DEFAULT: 'top-[60px]'
} as const;

/**
 * 标签页顶部位置常量
 */
export const TABS_TOP_POSITIONS = {
    /** 显示头部时的位置 */
    WITH_HEADER: '64px',
    /** 不显示头部时的位置 */
    WITHOUT_HEADER: '0px'
} as const;

/**
 * 侧边栏宽度常量
 */
export const SIDEBAR_WIDTHS = {
    /** 移动端侧边栏宽度 */
    MOBILE: '264px',
    /** 折叠状态宽度 */
    COLLAPSED: '64px',
    /** 展开状态宽度 */
    EXPANDED: '264px'
} as const;

/**
 * 抽屉内边距常量
 */
export const DRAWER_PADDINGS = {
    /** 内容区域内边距 */
    CONTENT: '0px',
    /** 头部内边距 */
    HEADER: '10px'
} as const;

/**
 * 浮动菜单定位常量
 */
export const FLOATING_MENU = {
    /** 最小边距 */
    MIN_MARGIN: 8,
    /** 右侧偏移 */
    RIGHT_OFFSET: 1,
    /** Z-index 层级 */
    Z_INDEX: 1000
} as const;

/**
 * 防抖延迟常量（毫秒）
 */
export const DEBOUNCE_DELAYS = {
    /** 窗口大小变化防抖延迟 */
    RESIZE: 150,
    /** 侧边栏自动隐藏延迟 */
    SIDEBAR_AUTO_HIDE: 100
} as const;

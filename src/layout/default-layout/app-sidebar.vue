<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout';
import { PanelLeftClose, PanelLeftDashed, Search } from 'lucide-vue-next';
import Divider from 'primevue/divider';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { DEBOUNCE_DELAYS } from '../constants';
import { AppHeaderLogo, AppMenu, AppMenuSearch, AppUserMenu } from '../shared';

// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();

// ==================== 本地状态管理 ====================
/** 控制侧边栏是否自动隐藏 */
const shouldAutoHide = ref<boolean>(false);
/** 隐藏定时器 */
let hideTimer: NodeJS.Timeout | null = null;
/** 控制搜索对话框显示 */
const showSearch = ref<boolean>(false);

// ==================== 事件处理方法 ====================
/** 处理菜单项点击事件 - 移动端关闭侧边栏 */
const handleMenuItemClick = (): void => {
    if (layoutStore.isMobile || layoutStore.isTablet) {
        layoutStore.closeMobileSidebar();
    }
};

/** 打开搜索 */
const openSearch = (): void => {
    showSearch.value = true;
};

/** 关闭搜索 */
const closeSearch = (): void => {
    showSearch.value = false;
};

/** 处理搜索菜单项点击 */
const handleSearchMenuClick = (): void => {
    closeSearch();
    handleMenuItemClick();
};

/** 处理快捷键 */
const handleKeydown = (event: KeyboardEvent): void => {
    // Ctrl+K 或 Cmd+K 打开搜索
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
    }
};

/** 切换 Fixed 模式 */
const toggleFixedMode = (): void => {
    layoutStore.toggleSidebarFixedMode();

    // 切换到 Fixed 模式时，重置自动隐藏状态
    if (layoutStore.sidebarFixedMode) {
        clearAutoHideTimer();
        shouldAutoHide.value = false;
    }
};

/** 清除自动隐藏定时器 */
const clearAutoHideTimer = (): void => {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
};

/** 鼠标进入悬停区域或侧边栏 */
const handleMouseEnter = (): void => {
    if (layoutStore.sidebarFixedMode) {
        clearAutoHideTimer();
        shouldAutoHide.value = false;
    }
};

/** 鼠标离开悬停区域和侧边栏 */
const handleMouseLeave = (): void => {
    if (layoutStore.sidebarFixedMode) {
        clearAutoHideTimer();

        // 延迟隐藏，给用户时间移动鼠标
        hideTimer = setTimeout(() => {
            shouldAutoHide.value = true;
            hideTimer = null;
        }, DEBOUNCE_DELAYS.SIDEBAR_AUTO_HIDE);
    }
};

/** 设置为 Relative 模式 */
const setRelativeMode = (): void => {
    layoutStore.setSidebarRelativeMode();
    shouldAutoHide.value = false;
    clearAutoHideTimer();
};

// ==================== 计算属性 ====================
/** 是否为桌面端（桌面或宽屏） */
const isDesktopOrWide = computed(() => layoutStore.isDesktop || layoutStore.isWide);

/** 是否为移动端（移动或平板） */
const isMobileOrTablet = computed(() => layoutStore.isMobile || layoutStore.isTablet);

/** 侧边栏 class 列表 */
const sidebarClasses = computed(() => ({
    // 设备类型
    'app-sidebar--mobile': isMobileOrTablet.value,
    'app-sidebar--desktop': isDesktopOrWide.value,

    // 模式样式
    'app-sidebar--fixed-mode': isDesktopOrWide.value && layoutStore.sidebarFixedMode,
    'app-sidebar--relative-mode': isDesktopOrWide.value && !layoutStore.sidebarFixedMode,

    // 折叠状态
    'app-sidebar--collapsed': isDesktopOrWide.value && layoutStore.isCollapsed,
    'app-sidebar--expanded': isDesktopOrWide.value && !layoutStore.isCollapsed,

    // Fixed 模式特殊样式
    'app-sidebar--hover-hidden': isDesktopOrWide.value && layoutStore.sidebarFixedMode,
    'sidebar-auto-hide': isDesktopOrWide.value && layoutStore.sidebarFixedMode && (shouldAutoHide.value || layoutStore.sidebarHidden),

    // Relative 模式隐藏样式
    'app-sidebar--hidden': isDesktopOrWide.value && !layoutStore.sidebarFixedMode && layoutStore.sidebarHidden
}));

// ==================== 响应式监听 ====================
/** 监听移动端状态变化 */
watch(
    isMobileOrTablet,
    (isMobile: boolean) => {
        if (isMobile) {
            setRelativeMode();
        }
    },
    { immediate: true }
);

// ==================== 生命周期管理 ====================
/**
 * 组件挂载时添加快捷键监听
 */
onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

/**
 * 组件卸载时清理定时器和监听器
 */
onUnmounted(() => {
    clearAutoHideTimer();
    document.removeEventListener('keydown', handleKeydown);
});

// ==================== 组件暴露 ====================
defineExpose({
    /** 获取当前是否为 Fixed 模式 */
    get isFixedMode(): boolean {
        return layoutStore.sidebarFixedMode;
    },
    /** 设置为 Relative 模式 */
    setRelativeMode
});
</script>

<template>
    <!-- Fixed 模式悬停触发区域 -->
    <div
v-if="isDesktopOrWide && layoutStore.sidebarFixedMode"
        class="layout-sidebar-hover fixed top-0 left-0 w-[6px] h-[100vh] bg-gray-200 z-30"
        @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" />

    <!-- 侧边栏主体 -->
    <aside :class="['app-sidebar', sidebarClasses]" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <!-- 顶部 Logo 区域 -->
        <div
v-if="isDesktopOrWide"
            class="sidebar-header flex items-center justify-center min-h-[64px] w-full relative overflow-hidden">
            <!-- Logo 容器 -->
            <div class="relative z-10 flex items-center justify-center w-full">
                <Transition
enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95" mode="out-in">
                    <!-- 展开状态 -->
                    <div
v-if="!layoutStore.isCollapsed" key="expanded"
                        class="flex items-center justify-between w-full gap-3">
                        <AppHeaderLogo />
                        <!-- Fixed 模式切换按钮 -->
                        <button
type="button"
                            class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-surface-700 cursor-pointer transition-colors duration-200"
                            @click="toggleFixedMode">
                            <PanelLeftClose v-if="!layoutStore.sidebarFixedMode" :size="18" />
                            <PanelLeftDashed v-else :size="18" />
                        </button>
                    </div>

                    <!-- 折叠状态 -->
                    <div v-else key="collapsed" class="flex items-center justify-center">
                        <AppHeaderLogo :collapsed="layoutStore.isCollapsed" />
                    </div>
                </Transition>
            </div>
        </div>

        <!-- 中间导航菜单区域 -->
        <div class="flex-1 relative overflow-hidden flex flex-col">
            <!-- 搜索按钮 -->
            <div v-if="!layoutStore.isCollapsed" class="px-4 pt-3 pb-2">
                <button
type="button"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-surface-800 hover:bg-gray-200 dark:hover:bg-surface-700 rounded-lg transition-colors group"
                    @click="openSearch">
                    <Search :size="16" class="flex-shrink-0" />
                    <span class="flex-1 text-left">搜索菜单...</span>
                    <kbd
                        class="hidden sm:inline-block px-2 py-0.5 text-xs bg-white dark:bg-surface-900 border border-gray-300 dark:border-surface-600 rounded">⌘K</kbd>
                </button>
            </div>

            <!-- 折叠状态的搜索按钮 -->
            <div v-else class="px-2 pt-3 pb-2">
                <button
type="button"
                    class="w-full flex items-center justify-center p-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-surface-800 hover:bg-gray-200 dark:hover:bg-surface-700 rounded-lg transition-colors"
                    @click="openSearch">
                    <Search :size="18" />
                </button>
            </div>

            <!-- 菜单滚动区域 -->
            <div class="menu-scroll-area">
                <div :class="isMobileOrTablet ? 'p-0 h-full' : 'h-full'">
                    <AppMenu
:collapsed="isMobileOrTablet ? false : layoutStore.isCollapsed"
                        :is-mobile="isMobileOrTablet" @menu-item-click="handleMenuItemClick" />
                </div>
            </div>
        </div>

        <!-- 底部用户信息区域 -->
        <Divider type="dashed" />
        <div class="sidebar-footer px-2 py-2 box-border">
            <AppUserMenu />
        </div>
    </aside>

    <!-- 菜单搜索对话框 -->
    <AppMenuSearch v-model:visible="showSearch" @menu-item-click="handleSearchMenuClick" />
</template>

<style lang="scss" scoped>
@use '@/assets/layout/breakpoints' as bp;
@use '@/assets/layout/layout-sizes' as sizes;

/* ==================== 基础样式 ==================== */

.sidebar-header {
    @apply flex items-center justify-between p-4;
}

.app-sidebar {
    @apply h-full flex flex-col;
    @apply bg-white dark:bg-surface-900;
    z-index: sizes.$z-index-sidebar;
    transition: width sizes.$sidebar-transition-duration sizes.$sidebar-transition-timing;
    transform-origin: left center;

    :deep(.p-divider-horizontal) {
        margin: 0;
    }
}

/* 菜单滚动区域 - 自动隐藏滚动条 */
.menu-scroll-area {
    @apply flex-1 overflow-y-auto overflow-x-hidden;

    /* 默认隐藏滚动条 */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;

    /* Webkit 浏览器 */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 3px;
        transition: background 0.3s ease;
    }

    /* 悬停或滚动时显示滚动条 */
    &:hover,
    &:active {
        scrollbar-color: var(--surface-300) transparent;

        &::-webkit-scrollbar-thumb {
            background: var(--surface-300);
        }
    }

    /* 暗色模式 */
    :global(.dark) & {

        &:hover,
        &:active {
            scrollbar-color: var(--surface-600) transparent;

            &::-webkit-scrollbar-thumb {
                background: var(--surface-600);
            }
        }
    }
}

// 移动端样式
.app-sidebar--mobile {
    @apply w-full flex;
    transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.3s ease;
}

// 桌面端样式
.app-sidebar--desktop {
    @apply border-r border-surface-200/60 dark:border-surface-700/60;
    @apply shadow-2xl shadow-surface-900/10 dark:shadow-surface-950/30 lg:shadow-xl lg:shadow-surface-900/5 dark:lg:shadow-surface-950/20;
    @apply flex;
    transition:
        width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.25s ease;
    will-change: width;
}

// 固定模式样式
.app-sidebar--fixed-mode {
    @apply fixed;
}

// 相对模式样式
.app-sidebar--relative-mode {
    @apply fixed lg:relative;
}

// Relative 模式隐藏样式
.app-sidebar--hidden {
    @apply hidden;
}

// 折叠状态样式
.app-sidebar--collapsed {
    width: sizes.$sidebar-width-collapsed;

    .sidebar-header {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}

// 展开状态样式
.app-sidebar--expanded {
    width: sizes.$sidebar-width-expanded;

    .sidebar-header {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
}

// Fixed模式下的侧边栏样式 - 默认显示状态
.app-sidebar--hover-hidden {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
    z-index: 1000;
    will-change: transform, opacity;
    transition:
        opacity 0.3s ease-out,
        transform 0.3s ease-out;
}

// 当鼠标在悬停区域或侧边栏上时保持显示
.layout-sidebar-hover:hover+.app-sidebar--hover-hidden,
.app-sidebar--hover-hidden:hover {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
    z-index: 1000;
}

// 使用JavaScript控制的隐藏状态类
.app-sidebar--hover-hidden.sidebar-auto-hide {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-100%);
    animation: slideOut 0.3s ease-out forwards;
}

@keyframes slideOut {
    0% {
        transform: translateX(0);
        opacity: 1;
    }

    100% {
        transform: translateX(-100%);
        opacity: 0;
    }
}

@keyframes slideIn {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 侧边栏头部动画 */
.sidebar-header {
    transition: all 0.3s ease;
    overflow: hidden;
}

/* 菜单容器动画 */
.app-sidebar .overflow-y-auto {
    transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 性能优化 - 启用硬件加速 */
.app-sidebar,
.sidebar-header {
    backface-visibility: hidden;
    transform: translateZ(0);
}

/* 响应式布局控制 - 与JavaScript断点保持一致 */

@include bp.mobile-only {
    .app-sidebar:not(.app-sidebar--mobile) {
        display: none;
    }
}

@include bp.tablet-only {
    .app-sidebar:not(.app-sidebar--mobile) {
        display: none;
    }
}

@include bp.desktop-up {
    .app-sidebar:not(.app-sidebar--mobile) {
        display: flex;
    }
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {

    .app-sidebar,
    .sidebar-header {
        transition: none;
    }
}
</style>

<script lang="ts" setup>
import { PanelLeftClose, PanelLeftDashed } from 'lucide-vue-next';
import Divider from 'primevue/divider';
import { ref } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { AppHeaderLogo, AppMenu, AppUserMenu } from '../shared';

// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();

// ==================== 本地状态管理 ====================
/** 控制侧边栏是否自动隐藏 */
const shouldAutoHide = ref<boolean>(false);
/** 隐藏定时器 */
let hideTimer: NodeJS.Timeout | null = null;

// ==================== 事件处理方法 ====================
/** 处理菜单项点击事件 - 移动端关闭侧边栏 */
const handleMenuItemClick = (): void => {
    if (layoutStore.isMobile || layoutStore.isTablet) {
        layoutStore.closeMobileSidebar();
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
        }, 100);
    }
};

/** 设置为 Relative 模式 */
const setRelativeMode = (): void => {
    layoutStore.setSidebarRelativeMode();
    shouldAutoHide.value = false;
    clearAutoHideTimer();
};

// ==================== 响应式监听 ====================
/** 监听移动端状态变化 */
watch(() => layoutStore.isMobile || layoutStore.isTablet, (isMobile: boolean) => {
    if (isMobile) {
        setRelativeMode();
    }
}, { immediate: true });

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
        v-if="(layoutStore.isDesktop || layoutStore.isWide) && layoutStore.sidebarFixedMode"
        class="layout-sidebar-hover fixed top-0 left-0 w-[6px] h-[100vh] bg-gray-200 z-30"
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave" />
        
    <!-- 侧边栏主体 -->
    <aside
        :class="[
            'app-sidebar',
            {
                // 设备类型样式
                'app-sidebar--mobile': layoutStore.isMobile || layoutStore.isTablet,
                'app-sidebar--desktop': layoutStore.isDesktop || layoutStore.isWide,
                
                // 模式样式
                'app-sidebar--fixed-mode': (layoutStore.isDesktop || layoutStore.isWide) && layoutStore.sidebarFixedMode,
                'app-sidebar--relative-mode': (layoutStore.isDesktop || layoutStore.isWide) && !layoutStore.sidebarFixedMode,
                
                // 折叠状态样式
                'app-sidebar--collapsed': (layoutStore.isDesktop || layoutStore.isWide) && layoutStore.isCollapsed,
                'app-sidebar--expanded': (layoutStore.isDesktop || layoutStore.isWide) && !layoutStore.isCollapsed,
                
                // Fixed 模式特殊样式
                'app-sidebar--hover-hidden': (layoutStore.isDesktop || layoutStore.isWide) && layoutStore.sidebarFixedMode,
                'sidebar-auto-hide': (layoutStore.isDesktop || layoutStore.isWide) && layoutStore.sidebarFixedMode && (shouldAutoHide || layoutStore.sidebarHidden),
                
                // Relative 模式隐藏样式
                'app-sidebar--hidden': (layoutStore.isDesktop || layoutStore.isWide) && !layoutStore.sidebarFixedMode && layoutStore.sidebarHidden
            }
        ]"
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave">
        <!-- 顶部 Logo 区域 -->
        <div
            v-if="layoutStore.isDesktop || layoutStore.isWide"
            class="sidebar-header flex items-center justify-center min-h-[64px] w-full relative overflow-hidden">
            <!-- Logo 容器 -->
            <div class="relative z-10 flex items-center justify-center w-full">
                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-90" 
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition-all duration-200 ease-in" 
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95" 
                    mode="out-in">
                    <!-- 展开状态 -->
                    <div 
                        v-if="!layoutStore.isCollapsed" 
                        key="expanded" 
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
                    <div 
                        v-else 
                        key="collapsed" 
                        class="flex items-center justify-center">
                        <AppHeaderLogo :collapsed="layoutStore.isCollapsed" />
                    </div>
                </Transition>
            </div>
        </div>

        <!-- 中间导航菜单区域 -->
        <div class="flex-1 relative overflow-hidden">
            <!-- 顶部渐变遮罩 -->
            <div class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10" />

            <!-- 底部渐变遮罩 -->
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface-50 to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10" />

            <!-- 菜单滚动区域 -->
            <div class="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600 scrollbar-track-transparent">
                <div :class="(layoutStore.isMobile || layoutStore.isTablet) ? 'p-0 h-full' : 'pt-3 pb-2 h-full'">
                    <AppMenu
                        :collapsed="(layoutStore.isMobile || layoutStore.isTablet) ? false : layoutStore.isCollapsed" 
                        :is-mobile="layoutStore.isMobile || layoutStore.isTablet"
                        @menu-item-click="handleMenuItemClick" />
                </div>
            </div>
        </div>
        
        <!-- 底部用户信息区域 -->
        <Divider type="dashed" />
        <div class="sidebar-footer px-2 py-2 box-border">
            <AppUserMenu />
        </div>
    </aside>
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

// 移动端样式
.app-sidebar--mobile {
    @apply w-full flex;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}

// 桌面端样式
.app-sidebar--desktop {
    @apply border-r border-surface-200/60 dark:border-surface-700/60;
    @apply shadow-2xl shadow-surface-900/10 dark:shadow-surface-950/30 lg:shadow-xl lg:shadow-surface-900/5 dark:lg:shadow-surface-950/20;
    @apply flex;
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
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
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

// 当鼠标在悬停区域或侧边栏上时保持显示
.layout-sidebar-hover:hover + .app-sidebar--hover-hidden,
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

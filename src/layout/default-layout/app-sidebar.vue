<script lang="ts" setup>

import AppMenu from '../shared/app-menu.vue';
import AppUserMenu from '../shared/app-user-menu.vue';

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    },
    isMobile: {
        type: Boolean,
        default: false
    }
});



const emit = defineEmits(['menu-item-click']);

const handleMenuItemClick = () => {
    emit('menu-item-click');
};


</script>

<template>
    <aside
:class="[
        'sidebar',
        isMobile ? 'mobile-sidebar' : 'desktop-sidebar',
        !isMobile && 'fixed lg:relative',
        'top-0 left-0 h-full',
        'bg-surface-50 dark:bg-surface-900',
        !isMobile && 'border-r border-surface-200/60 dark:border-surface-700/60',
        'sidebar-transition',
        !isMobile && 'z-40',
        !isMobile && (collapsed ? 'w-[80px]' : 'w-[256px]'),
        isMobile && 'w-full',
        'flex flex-col',
        !isMobile && 'shadow-2xl shadow-surface-900/10 dark:shadow-surface-950/30 lg:shadow-xl lg:shadow-surface-900/5 dark:lg:shadow-surface-950/20',
        'bg-white dark:bg-surface-900',
        // 响应式显示控制：移动端模式下显示，桌面端模式下显示，平板端隐藏（使用抽屉）
        isMobile ? 'flex' : 'hidden 2xl:flex'
    ]">
        <!-- 顶部Logo区域 -->
        <div
v-if="!isMobile"
            :class="['sidebar-header', 'flex items-center', collapsed ? 'justify-center px-2' : 'justify-start px-6', 'min-h-[64px] w-full', 'backdrop-blur-sm']">
            <!-- Logo -->
            <Transition
enter-active-class="transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1)"
                leave-active-class="transition-all duration-250 cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                enter-from-class="opacity-0 scale-90 translate-x-4" enter-to-class="opacity-100 scale-100 translate-x-0"
                leave-from-class="opacity-100 scale-100 translate-x-0"
                leave-to-class="opacity-0 scale-95 translate-x-2">
                <div v-if="!collapsed" class="flex items-center gap-4 justify-center w-full">
                    <div class="flex items-center justify-center gap-4">
                        <img src="@/assets/images/logo.svg" alt="logo" class="w-12 h-12" />
                        <div class="flex flex-col">
                            <span
                                class="text-xl font-bold text-surface-900 dark:text-surface-50 truncate tracking-tight">TVA</span>
                            <span
                                class="text-xs text-surface-500 dark:text-surface-400 truncate font-medium">管理后台</span>
                        </div>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center">
                    <img src="@/assets/images/logo.svg" alt="logo" class="w-12 h-12" />
                </div>
            </Transition>
        </div>

        <!-- 中间导航菜单 - 带滚动遮罩 -->
        <div class="flex-1 relative overflow-hidden">
            <!-- 顶部遮罩 -->
            <div
                class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10">
            </div>

            <!-- 底部遮罩 -->
            <div
                class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface-50 to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10">
            </div>

            <!-- 滚动区域 -->
            <div
                class="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600 scrollbar-track-transparent">
                <div :class="isMobile ? 'p-0 h-full' : 'pt-6  pb-2 h-full'">
                    <AppMenu
:collapsed="isMobile ? false : collapsed" :is-mobile="isMobile"
                        @menu-item-click="handleMenuItemClick" />
                </div>
            </div>
        </div>
        <!-- 底部用户信息区域 -->
        <div class="sidebar-footer p-2 box-border">
            <app-user-menu />
        </div>


    </aside>
</template>

<style lang="scss" scoped>


/* 侧边栏折叠动画优化 */
.sidebar {
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: left center;
}

/* 桌面端侧边栏动画优化 */
.desktop-sidebar {
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.25s ease;
    will-change: width;
}

/* 侧边栏头部动画 */
.sidebar-header {
    transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

/* Logo区域动画优化 */
.sidebar-header .flex {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 菜单容器动画 */
.sidebar .overflow-y-auto {
    transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 折叠状态下的特殊效果 */
.desktop-sidebar.w-\[80px\] {
    transform: translateX(0);
}

.desktop-sidebar.w-\[80px\] .sidebar-header {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

/* 展开状态下的特殊效果 */
.desktop-sidebar.w-\[256px\] {
    transform: translateX(0);
}

.desktop-sidebar.w-\[256px\] .sidebar-header {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}

/* 移动端侧边栏动画 */
.mobile-sidebar {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.3s ease;
}

/* 性能优化 - 启用硬件加速 */
.sidebar,
.sidebar-header {
    backface-visibility: hidden;
    transform: translateZ(0);
}

/* 响应式布局控制 - 只对非移动端模式生效 */
@media (max-width: 1599px) {
    .sidebar:not(.mobile-sidebar) {
        display: none !important;
    }
}

@media (min-width: 1600px) {
    .sidebar:not(.mobile-sidebar) {
        display: flex !important;
    }
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {

    .sidebar,
    .sidebar-header,
    .desktop-sidebar,
    .mobile-sidebar {
        transition: none;
    }
}
</style>

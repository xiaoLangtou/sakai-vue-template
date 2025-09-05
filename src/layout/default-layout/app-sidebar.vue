<script lang="ts" setup>

import { PanelLeftClose, PanelLeftDashed } from 'lucide-vue-next';
import { ref, watch } from 'vue';

import { AppHeaderLogo, AppMenu, AppUserMenu } from "../shared";

const props = defineProps({
    collapsed: {
        type: Boolean,
        default: false
    },
    isMobile: {
        type: Boolean,
        default: false
    }
});

// 控制侧边栏是否为fixed模式
const isFixedMode = ref(false);
// 控制侧边栏是否自动隐藏
const shouldAutoHide = ref(false);
// 隐藏定时器
let hideTimer: NodeJS.Timeout | null = null;

const emit = defineEmits(['menu-item-click', 'toggleSidebar']);

const handleMenuItemClick = () => {
    emit('menu-item-click');
};

// 切换fixed模式
const toggleFixedMode = () => {
    isFixedMode.value = !isFixedMode.value;
    // 切换到fixed模式时，重置自动隐藏状态
    if (isFixedMode.value) {
        shouldAutoHide.value = false;
        // 清除可能存在的定时器
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }
};

// 鼠标进入悬停区域或侧边栏
const handleMouseEnter = () => {
    if (isFixedMode.value) {
        // 清除隐藏定时器
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        shouldAutoHide.value = false;
    }
};

// 鼠标离开悬停区域和侧边栏
const handleMouseLeave = () => {
    if (isFixedMode.value) {
        // 清除之前的定时器
        if (hideTimer) {
            clearTimeout(hideTimer);
        }
        // 延迟隐藏，给用户时间移动鼠标
        hideTimer = setTimeout(() => {
            shouldAutoHide.value = true;
            hideTimer = null;
        }, 100);
    }
};

// 监听 collapsed 属性变化
watch(() => props.collapsed, (newValue, oldValue) => {
    // 当 collapsed 发生变化时
    if (newValue !== oldValue) {
        // 如果当前是 fixed 模式，则切换为 relative 模式
        if (isFixedMode.value) {
            isFixedMode.value = false;
            // 重置自动隐藏状态
            shouldAutoHide.value = false;
            // 清除可能存在的定时器
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        }
    }
});


watch(() => props.isMobile, () => {
    if (props.isMobile) {
        isFixedMode.value = false;
        shouldAutoHide.value = false;
    }
}, { immediate: true });

</script>

<template>
    <div
v-if="!isMobile && isFixedMode"
        class="layout-sidebar-hover fixed top-0 left-0 w-[6px] h-[100vh] bg-gray-200 z-30"
        @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"></div>
    <aside
:class="[
        'app-sidebar',
        {
            'app-sidebar--mobile': isMobile,
            'app-sidebar--desktop': !isMobile,
            'app-sidebar--fixed-mode': !isMobile && isFixedMode,
            'app-sidebar--relative-mode': !isMobile && !isFixedMode,
            'app-sidebar--collapsed': !isMobile && collapsed,
            'app-sidebar--expanded': !isMobile && !collapsed,
            'app-sidebar--hover-hidden': !isMobile && isFixedMode,
            'sidebar-auto-hide': !isMobile && isFixedMode && shouldAutoHide
        }
    ]" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <!-- 顶部Logo区域 -->
        <div
v-if="!isMobile"
            :class="['sidebar-header', 'flex items-center justify-center', 'min-h-[64px] w-full', 'relative overflow-hidden']">
            <!-- Logo容器 -->
            <div class="relative z-10 flex items-center justify-center w-full">
                <Transition
enter-active-class="transition-all duration-300 ease-out"
                    leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 scale-90"
                    enter-to-class="opacity-100 scale-100" leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95" mode="out-in">
                    <!-- 展开状态 -->
                    <div v-if="!collapsed" key="expanded" class="flex items-center justify-between w-full gap-3">
                        <AppHeaderLogo />
                        <!-- 按钮 -->
                        <div
class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 cursor-pointer"
                            @click="toggleFixedMode">
                            <PanelLeftClose v-if="!isFixedMode" :size="18" />
                            <PanelLeftDashed v-else :size="18" />
                        </div>
                    </div>

                    <!-- 折叠状态 -->
                    <div v-else key="collapsed" class="flex items-center justify-center">
                        <AppHeaderLogo :collapsed="collapsed" />
                    </div>
                </Transition>
            </div>
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
                <div :class="isMobile ? 'p-0 h-full' : 'pt-3  pb-2 h-full'">
                    <AppMenu
:collapsed="isMobile ? false : collapsed" :is-mobile="isMobile"
                        @menu-item-click="handleMenuItemClick" />
                </div>
            </div>
        </div>
        <!-- 底部用户信息区域 -->
        <Divider type="dashed" />
        <div class="sidebar-footer px-2 py-2 box-border">
            <app-user-menu />
        </div>
    </aside>
</template>

<style scoped lang="scss">
@use '@/assets/layout/breakpoints' as bp;
@use '@/assets/layout/layout-sizes' as sizes;

.sidebar-header {
    @apply flex items-center justify-between p-4;
}

// 基础侧边栏样式
.app-sidebar {
    @apply h-full flex flex-col;
    @apply bg-white dark:bg-surface-900;
    z-index: sizes.$z-index-sidebar;
    transition: width sizes.$sidebar-transition-duration sizes.$sidebar-transition-timing;
    transform-origin: left center;

    .p-divider-horizontal {
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

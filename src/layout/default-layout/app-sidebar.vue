<script lang="ts" setup>
import AppMenu from '../shared/app-menu.vue';

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
    <aside :class="[
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
        !isMobile && 'shadow-2xl shadow-surface-900/10 dark:shadow-surface-950/30 lg:shadow-xl lg:shadow-surface-900/5 dark:lg:shadow-surface-950/20'
    ]">
        <!-- 顶部Logo区域 -->
        <div v-if="!isMobile"
            :class="['sidebar-header', 'flex items-center', collapsed ? 'justify-center px-2' : 'justify-start px-6', 'min-h-[64px]', 'backdrop-blur-sm']">
            <!-- Logo -->
            <Transition enter-active-class="transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1)"
                leave-active-class="transition-all duration-250 cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                enter-from-class="opacity-0 scale-90 translate-x-4" enter-to-class="opacity-100 scale-100 translate-x-0"
                leave-from-class="opacity-100 scale-100 translate-x-0"
                leave-to-class="opacity-0 scale-95 translate-x-2">
                <div v-if="!collapsed" class="flex items-center gap-4 min-w-0">
                    <div class="relative">
                        <div
                            class="w-11 h-11 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-bolt text-white text-xl font-semibold"></i>
                        </div>
                        <div
                            class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-surface-50 dark:border-surface-900">
                        </div>
                    </div>
                    <div class="flex flex-col min-w-0">
                        <span
                            class="text-xl font-bold text-surface-900 dark:text-surface-50 truncate tracking-tight">SAKAI</span>
                        <span class="text-xs text-surface-500 dark:text-surface-400 truncate font-medium">管理后台</span>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center">
                    <div class="relative">
                        <div
                            class="w-9 h-9 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-primary-500/25 ring-1 ring-primary-400/20">
                            <i class="pi pi-bolt text-white text-base font-semibold"></i>
                        </div>
                        <div
                            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-surface-50 dark:border-surface-900">
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- 中间导航菜单 -->
        <div
            class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600 scrollbar-track-transparent">
            <div :class="isMobile ? 'p-0' : 'pt-4 px-3 pb-2'">
                <AppMenu :collapsed="isMobile ? false : collapsed" :is-mobile="isMobile"
                    @menu-item-click="handleMenuItemClick" />
            </div>
        </div>
    </aside>
</template>

<style scoped>
/* 性能优化 */
.sidebar {
    will-change: width;
    transform: translateZ(0);
    contain: layout style paint;
    backface-visibility: hidden;
    position: relative;
}

.sidebar * {
    backface-visibility: hidden;
}

/* 侧边栏过渡动画 - 现代简约设计 */
.sidebar-transition {
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.25s ease;
    will-change: width, transform, box-shadow;
    border-right: 1px solid rgba(148, 163, 184, 0.1);
}

/* 侧边栏悬停效果增强 */
.sidebar:hover {
    box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.08);
    border-right-color: rgba(59, 130, 246, 0.2);
}

.dark .sidebar:hover {
    box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.4), 0 8px 16px -4px rgba(0, 0, 0, 0.2);
    border-right-color: rgba(59, 130, 246, 0.3);
}

/* 折叠状态优化 */
.sidebar[class*="w-\[80px\]"] {
    overflow: visible;
}

.sidebar[class*="w-\[80px\]"] .sidebar-header {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

/* 侧边栏阴影增强 */
.sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    right: -8px;
    bottom: 0;
    width: 8px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.04) 50%, transparent 100%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.sidebar:hover::before {
    opacity: 1;
}

:global(.dark) .sidebar::before {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
}

/* 侧边栏头部样式 - 现代简约设计 */
.sidebar-header {
    position: relative;
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 0 0 20px 20px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(10px);
}

.dark .sidebar-header {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
}

.sidebar-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%);
    border-radius: 1px;
    opacity: 0;
    transition: all 0.35s ease;
    transform: scaleX(0);
}

.sidebar-header:hover::after {
    opacity: 1;
    transform: scaleX(1);
}

/* Logo容器悬停效果 - 现代简约设计 */
.sidebar-header .relative:hover .pi-bolt {
    transform: rotate(12deg) scale(1.1);
    filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3));
}

.sidebar-header .pi-bolt {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1));
}

/* Logo阴影悬停效果 */
.sidebar-header .relative:hover>div:first-child {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
        0 25px 35px -5px rgba(59, 130, 246, 0.4),
        0 15px 20px -5px rgba(59, 130, 246, 0.2),
        0 5px 10px -3px rgba(59, 130, 246, 0.1);
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
}

.sidebar-header .relative>div:first-child {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
}

/* 状态指示器动画 - 现代简约设计 */
.sidebar-header .bg-green-400 {
    animation: pulse-dot 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
}

@keyframes pulse-dot {
    0% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    
    50% {
        opacity: 0.9;
        transform: scale(1.15);
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
    }
    
    100% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
}

/* 滚动条样式 - 现代简约设计 */
.scrollbar-thin {
    scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
    width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: rgba(148, 163, 184, 0.05);
    border-radius: 4px;
    margin: 8px 0;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.6) 100%);
    border-radius: 4px;
    border: 1px solid rgba(59, 130, 246, 0.1);
    transition: all 0.3s ease;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.8) 100%);
    border-color: rgba(59, 130, 246, 0.2);
    transform: scaleY(1.1);
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.7) 100%);
    border-color: rgba(59, 130, 246, 0.2);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.9) 100%);
    border-color: rgba(59, 130, 246, 0.3);
}

/* 响应式优化 */
@media (max-width: 1024px) {

    .sidebar-header .relative:hover .pi-bolt,
    .sidebar-header .relative:hover>div:first-child {
        transform: none;
    }

    .sidebar-header .bg-green-400 {
        animation: none;
    }
}
</style>

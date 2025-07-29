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

        <!-- 中间导航菜单 - 带滚动遮罩 -->
        <div class="flex-1 relative overflow-hidden">
            <!-- 顶部遮罩 -->
            <div class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-surface-50 to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10"></div>

            <!-- 底部遮罩 -->
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface-50 to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10"></div>

            <!-- 滚动区域 -->
            <div class="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600 scrollbar-track-transparent">
                <div :class="isMobile ? 'p-0' : 'pt-6 px-3 pb-2'">
                    <AppMenu :collapsed="isMobile ? false : collapsed" :is-mobile="isMobile"
                        @menu-item-click="handleMenuItemClick" />
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
</style>

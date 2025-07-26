<script setup>
import Button from 'primevue/button';
import AppTopbar from '../shared/app-topbar.vue';
import AppBreadcrumb from './app-breadcrumb.vue';

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

defineEmits(['toggle-sidebar']);
</script>

<template>
    <header class="app-header" :class="{
        'mobile-header': isMobile,
        'desktop-header': !isMobile
    }">
        <div class="header-left">
            <!-- 移动端菜单按钮 -->
            <Button v-if="isMobile" @click="$emit('toggle-sidebar')" icon="pi pi-bars" severity="secondary" text rounded
                class="mobile-menu-toggle" aria-label="切换菜单" />

            <!-- 桌面端折叠按钮 -->
            <Button v-if="!isMobile" @click="$emit('toggle-sidebar')" icon="pi pi-bars" severity="secondary" text
                rounded :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'" />

            <!-- 移动端Logo -->
            <div v-if="isMobile" class="mobile-logo">
                <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <i class="pi pi-bolt text-white text-sm"></i>
                </div>
                <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">SAKAI</span>
            </div>

            <!-- 桌面端面包屑导航 -->
            <AppBreadcrumb v-if="!isMobile" />
        </div>

        <div class="header-right">
            <!-- 顶部工具栏 -->
            <AppTopbar :is-mobile="isMobile" />
        </div>
    </header>
</template>

<style lang="scss" scoped>
.app-header {
    @apply bg-surface-50 dark:bg-surface-900;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;

    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
}

.header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

/* 移动端样式 */
.mobile-header {
    padding: 0 16px;
    height: 56px;
}

.mobile-menu-toggle {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.mobile-menu-toggle:hover {
    background-color: var(--surface-100);
    transform: scale(1.05);
}

.mobile-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
}

.mobile-logo span {
    font-size: 1.125rem;
    font-weight: 600;
    truncate: true;
}

/* 桌面端样式 */
.desktop-header {
    padding: 0 24px;
}

.desktop-collapse-toggle {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    margin-right: 8px;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 8px;
}

.desktop-collapse-toggle:hover {
    background-color: var(--surface-100);
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.desktop-collapse-toggle:active {
    transform: scale(0.95);
}

/* 暗色模式适配 */
:global(.dark) .app-header {
    background-color: var(--surface-900);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

:global(.dark) .mobile-menu-toggle:hover,
:global(.dark) .desktop-collapse-toggle:hover {
    background-color: var(--surface-800);
}

:global(.dark) .desktop-collapse-toggle:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 响应式适配 */
@media (max-width: 640px) {
    .mobile-header {
        padding: 0 12px;
        height: 52px;
    }

    .mobile-logo span {
        font-size: 1rem;
    }

    .mobile-menu-toggle {
        width: 36px;
        height: 36px;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .app-header {
        padding: 0 20px;
    }
}

@media (min-width: 1024px) {
    .desktop-header {
        padding: 0 24px;
    }
}

/* 性能优化 */
.app-header {
    will-change: transform;
    backface-visibility: hidden;
}
</style>

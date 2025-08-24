<script setup>
import { AppTabs } from '@/components/app-tabs';
import Drawer from 'primevue/drawer';
import { provide } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import AppFooter from './app-footer.vue';
import AppHeader from './app-header.vue';
import AppSidebar from './app-sidebar.vue';

const layoutStore = useLayoutStore();
const {
    layoutConfig,
} = storeToRefs(layoutStore);

// 统一的切换处理函数
const handleToggleSidebar = () => {
    if (layoutStore.isMobile || layoutStore.isTablet) {
        // 移动端和平板端：切换抽屉侧边栏
        layoutStore.showMobileSidebar = !layoutStore.showMobileSidebar;
    } else {
        // 桌面端：切换侧边栏折叠状态
        layoutStore.toggleSidebar();
    }
};

// 提供给子组件使用
provide('layout', {
    isCollapsed: layoutStore.isCollapsed,
    toggleSidebar: layoutStore.toggleSidebar,
    layoutConfig: layoutConfig,
    isMobile: layoutConfig.isMobile,
    isTablet: layoutConfig.isTablet,
    isDesktop: layoutConfig.isDesktop,
    showMobileSidebar: layoutStore.showMobileSidebar,
    closeMobileSidebar: layoutStore.closeMobileSidebar
});
</script>

<template>
    <!-- 侧边栏布局模式 -->
    <div class="app-layout" :class="{
        'sidebar-collapsed': layoutStore.isCollapsed,
        'mobile-layout': layoutConfig.isMobile,
        'tablet-layout': layoutConfig.isTablet,
        'desktop-layout': layoutConfig.isDesktop
    }">
        <!-- 桌面端和平板端侧边栏 -->
        <AppSidebar :collapsed="layoutStore.isCollapsed" :is-mobile="layoutStore.isMobile"
            @toggle-sidebar="layoutStore.toggleSidebar" />
        <!-- 移动端和平板端抽屉式侧边栏 -->
        <Drawer v-if="layoutConfig.isMobile || layoutConfig.isTablet" v-model:visible="layoutStore.showMobileSidebar"
            position="left" :style="{ width: '280px', '--p-drawer-content-padding': '0px' }"
            class="mobile-sidebar-drawer" @hide="layoutStore.closeMobileSidebar">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="pi pi-bolt text-white text-sm"></i>
                    </div>
                    <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">SAKAI</span>
                </div>
            </template>
            <div class="mobile-sidebar-content">
                <AppSidebar :collapsed="false" :is-mobile="true" @menu-item-click="layoutStore.closeMobileSidebar" />
            </div>
        </Drawer>

        <!-- 右侧主体区域 -->
        <div class="main-content relative" :class="{
            'mobile-main': layoutConfig.isMobile,
            'tablet-main': layoutConfig.isTablet,
            'desktop-main': layoutConfig.isDesktop
        }">
            <!-- 顶部头部栏 -->
            <AppHeader :collapsed="layoutStore.isCollapsed" :is-mobile="layoutStore.isMobile" @toggle-sidebar="handleToggleSidebar" />

            <!-- 标签页组件 -->
            <AppTabs v-if="layoutConfig.showTab" class="tabs-container" :tab-style="layoutConfig.tabStyle"
                :show-icon="layoutConfig.isShowIcon" />

            <div
                :class="`absolute ${layoutConfig.showTab ? `${layoutConfig.tabStyle == 'Fashion' ? 'top-[112px]' : 'top-[109px]'}` : 'top-[60px]'}  left-0 right-0 h-8 bg-gradient-to-b from-surface-50 to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10`">
            </div>

            <!-- 主要内容区域 -->
            <div class="layout-main-container relative">

                <div class="content-wrapper">
                    <router-view></router-view>
                </div>
            </div>

            <!-- 底部页脚 -->
            <AppFooter v-if="!layoutStore.isMobile" />
        </div>
    </div>
</template>

<style scoped>
.app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: margin-left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: margin-left;
}

.layout-main-container {
    flex: 1;
    overflow-y: auto;
    background-color: var(--surface-ground);
    transition: padding 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.content-wrapper {
    min-height: 100%;
}

/* 移动端布局 */
.mobile-layout {
    flex-direction: row;
    /* 保持水平布局 */
}

.mobile-layout .mobile-main {
    width: 100%;
    margin-left: 0;
    flex: 1;
    /* 占满剩余空间 */
}

/* 平板端布局 */
.tablet-layout .tablet-main {
    margin-left: 0;
}

.tablet-layout.sidebar-collapsed .tablet-main {
    margin-left: 0;
}

/* 桌面端布局 */
.desktop-layout .desktop-main {
    margin-left: 0;
}

.desktop-layout.sidebar-collapsed .desktop-main {
    margin-left: 0;
}

/* 移动端抽屉样式 */
.mobile-sidebar-drawer {
    z-index: 1000;
}

.mobile-sidebar-content {
    height: 100%;
    overflow-y: auto;
}

/* 响应式断点适配 */
@media (max-width: 640px) {
    .content-wrapper {
        padding: 0.75rem;
    }
}

@media (min-width: 768px) and (max-width: 1599px) {
    .content-wrapper {
        padding: 0.75rem;
        margin-left: 0;
    }
}

@media (min-width: 1600px) {
    .content-wrapper {
        padding: 1rem;
    }
}

/* 标签页容器样式 */
.tabs-container {
    position: sticky;
    top: 64px;
    z-index: 2;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
    .tabs-container {
        background: var(--surface-900);
        border-bottom-color: var(--surface-700);
    }
}

/* 性能优化 */
.app-layout {
    will-change: transform;
    transform: translateZ(0);
    contain: layout style paint;
}

.main-content {
    backface-visibility: hidden;
}
</style>

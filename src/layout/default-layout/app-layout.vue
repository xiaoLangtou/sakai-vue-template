<script setup>
import { AppTabs } from '@/components/app-tabs';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import Drawer from 'primevue/drawer';
import { onMounted, onUnmounted } from 'vue';
import AppFooter from './app-footer.vue';
import AppHeader from './app-header.vue';
import AppSidebar from './app-sidebar.vue';
import { AppHeaderLogo } from '../shared';

// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();
const { layoutConfig } = storeToRefs(layoutStore);

// ==================== 生命周期管理 ====================
onMounted(() => {
    layoutStore.initLayout();
});

onUnmounted(() => {
    layoutStore.destroyLayout();
});
</script>

<template>
    <!-- 侧边栏布局模式 -->
    <div
        :class="[
            'app-layout',
            {
                'sidebar-collapsed': layoutStore.isCollapsed,
                [`${layoutStore.currentBreakpoint}-layout`]: true
            }
        ]">

        <!-- 桌面端侧边栏 -->

        <AppSidebar v-if="(layoutStore.isDesktop || layoutStore.isWide) && layoutStore.isSidebarActive" />

        <!-- 移动端/平板端抽屉式侧边栏 -->
        <Drawer
            v-if="layoutStore.isMobile || layoutStore.isTablet"
            v-model:visible="layoutStore.showMobileSidebar"
            :style="{
                width: '264px',
                '--p-drawer-content-padding': '0px',
                '--p-drawer-header-padding': '10px'
            }"
            class="mobile-sidebar-drawer"
            position="left"
            @hide="layoutStore.closeMobileSidebar">
            <template #header>
                <AppHeaderLogo />
            </template>
            <div :class="`${layoutStore.currentBreakpoint}-sidebar-content`">
                <AppSidebar />
            </div>
        </Drawer>

        <!-- 主体内容区域 -->
        <div :class="[
            'main-content',
            'relative',
            `${layoutStore.currentBreakpoint}-main`
        ]">
            <!-- 顶部头部栏 -->
            <AppHeader />

            <!-- 标签页组件 -->
            <AppTabs
                v-if="layoutConfig.showTab"
                :show-icon="layoutConfig.isShowIcon"
                :tab-style="layoutConfig.tabStyle"
                class="tabs-container" />

            <!-- 内容区域渐变遮罩 -->
            <div :class="[
                'absolute left-0 right-0 h-8 pointer-events-none z-10',
                'bg-gradient-to-b from-surface-50 to-surface-100',
                'dark:from-surface-900 dark:to-transparent',
                layoutConfig.showTab ? 'top-[108px]' : 'top-[60px]'
            ]" />

            <!-- 主要内容区域 -->
            <div class="layout-main-container relative">
                <div class="content-wrapper">
                    <router-view />
                </div>
            </div>

            <!-- 底部页脚 -->
            <AppFooter v-if="!layoutStore.isMobile" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/layout/breakpoints' as bp;
@use '@/assets/layout/layout-sizes' as sizes;

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
    @apply min-h-full;
    transition: margin-left sizes.$sidebar-transition-duration ease;
}

/* ==================== 响应式布局样式 ==================== */

/* 移动端布局 */
.mobile-layout {
    flex-direction: row;

    .mobile-main {
        width: 100%;
        margin-left: 0;
        flex: 1;
    }
}

/* 平板端布局 */
.tablet-layout {
    .tablet-main {
        margin-left: 0;
    }

    &.sidebar-collapsed .tablet-main {
        margin-left: 0;
    }
}

/* 桌面端布局 */
.desktop-layout {
    .desktop-main {
        margin-left: 0;
    }

    &.sidebar-collapsed .desktop-main {
        margin-left: 0;
    }
}

/* 宽屏布局 */
.wide-layout {
    .wide-main {
        margin-left: 0;
    }

    &.sidebar-collapsed .wide-main {
        margin-left: 0;
    }
}

/* ==================== 抽屉样式 ==================== */

.mobile-sidebar-drawer {
    z-index: 1000;
}

.mobile-sidebar-content,
.tablet-sidebar-content {
    height: 100%;
    overflow-y: auto;
}

/* ==================== 响应式断点适配 ==================== */

@include bp.mobile-only {
    .content-wrapper {
        padding: sizes.$content-padding-mobile;
    }
}

@include bp.tablet-only {
    .content-wrapper {
        padding: 0.75rem;
        margin-left: 0;
    }
}

@include bp.desktop-up {
    .content-wrapper {
        padding: 1rem;
    }
}

/* ==================== 标签页样式 ==================== */

.tabs-container {
    position: sticky;
    top: 64px;
    z-index: 2;

    @media (prefers-color-scheme: dark) {
        background: var(--surface-900);
        border-bottom-color: var(--surface-700);
    }
}

/* ==================== 性能优化 ==================== */

.app-layout {
    will-change: transform;
    transform: translateZ(0);
    contain: layout style paint;
}

.main-content {
    backface-visibility: hidden;
}
</style>

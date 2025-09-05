<script setup>
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, provide, ref } from 'vue';
import AppHeaderLogo from '../shared/app-header-logo.vue';
import AppTopbar from '../shared/app-topbar.vue';
import AppFooter from './app-footer.vue';
import AppMegaMenu from './app-mega-menu.vue';

const layoutStore = useLayoutStore();
const { layoutConfig, layoutState } = storeToRefs(layoutStore);


import { getCurrentLayoutSizes, HEADER_HEIGHTS, MENU_HEIGHTS } from '@/global/layout-sizes';

// 头部和菜单栏高度 - 使用配置化管理
const headerHeight = ref(HEADER_HEIGHTS.DESKTOP);
const menuHeight = ref(MENU_HEIGHTS.DESKTOP);

// 提供布局配置给子组件
provide('layoutConfig', layoutConfig);
provide('layoutState', layoutState);

// 组件挂载后计算实际高度
onMounted(() => {
    // 根据当前窗口尺寸设置对应的高度
    const updateLayoutSizes = () => {
        const sizes = getCurrentLayoutSizes();
        headerHeight.value = sizes.headerHeight;
        menuHeight.value = sizes.menuHeight;
    };

    updateLayoutSizes();

    // 监听窗口大小变化
    window.addEventListener('resize', updateLayoutSizes);

    // 组件卸载时清理事件监听
    onUnmounted(() => {
        window.removeEventListener('resize', updateLayoutSizes);
    });
});


</script>

<template>
    <div class="app-layout-topbar">
        <!-- 固定顶部区域：Logo和工具栏 -->
        <div
            class="topbar-header fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex items-center justify-between h-16 px-6 max-w-screen-2xl mx-auto">
                <!-- Logo区域 -->
                <app-header-logo />


                <!-- 中间菜单区域 -->
                <div class="flex-1 flex mx-8">
                    <AppMegaMenu />
                </div>

                <!-- 右侧工具栏区域 -->
                <div class="flex items-center flex-shrink-0">
                    <AppTopbar />
                </div>
            </div>
        </div>


        <!-- 可滚动的主内容区域 -->
        <div class="layout-main-container !p-0" :style="{ marginTop: headerHeight + 'px' }">
            <div class="content-wrapper p-6 bg-gray-100 dark:bg-gray-900 h-full">
                <router-view />
            </div>
            <!-- 底部全局Footer -->
            <AppFooter />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/layout/breakpoints' as bp;
@use '@/assets/layout/layout-sizes' as sizes;

/* 固定顶部栏布局样式 */
.app-layout-topbar {
    position: relative;
    width: 100%;
}

/* 固定头部样式 */
.topbar-header {
    height: sizes.$header-height-desktop;
    transition: all 0.3s ease;

    @include bp.tablet-only {
        height: sizes.$header-height-tablet;
    }

    @include bp.mobile-only {
        height: sizes.$header-height-mobile;
    }
}

/* 固定菜单栏样式 */
.topbar-menu {
    height: sizes.$menu-height-desktop;
    transition: all 0.3s ease;

    @include bp.tablet-only {
        height: sizes.$menu-height-tablet;
    }

    @include bp.mobile-only {
        height: sizes.$menu-height-mobile;
    }
}

/* 主内容容器 */
.layout-main-container {
    position: relative;
    width: 100%;
    height: sizes.$main-content-height-desktop;

    @include bp.tablet-only {
        height: sizes.$main-content-height-tablet;
    }

    @include bp.mobile-only {
        height: sizes.$main-content-height-mobile;
    }
}

/* 内容包装器 */
.content-wrapper {
    background-color: var(--surface-ground);
    transition: margin-top 0.3s ease;
}

/* 响应式适配 */
@include bp.mobile-only {
    .topbar-header {
        padding: 0.75rem 1rem;
    }

    .topbar-menu {
        padding: 0.25rem 1rem;
    }
}

/* 平滑滚动 */
html {
    scroll-behavior: smooth;
}

/* 确保固定元素在移动设备上正常工作 */
@supports (-webkit-touch-callout: none) {

    .topbar-header,
    .topbar-menu {
        position: -webkit-sticky;
        position: sticky;
    }
}
</style>

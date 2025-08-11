<script setup>
import { onMounted, provide, ref } from 'vue';
import { useLayout } from '../composables/layout';
import AppFooter from './app-footer.vue';
import AppMegaMenu from './app-mega-menu.vue';
import AppTopbar from '../shared/app-topbar.vue';

const { layoutConfig, layoutState } = useLayout();

// 头部和菜单栏高度
const headerHeight = ref(64); // 4rem = 64px
const menuHeight = ref(64); // 3rem = 48px

// 提供布局配置给子组件
provide('layoutConfig', layoutConfig);
provide('layoutState', layoutState);

// 组件挂载后计算实际高度
onMounted(() => {
    // 可以在这里动态计算实际的头部和菜单栏高度
    const headerEl = document.querySelector('.topbar-header');
    const menuEl = document.querySelector('.topbar-menu');

    if (headerEl) {
        headerHeight.value = headerEl.offsetHeight;
    }
    if (menuEl) {
        menuHeight.value = menuEl.offsetHeight;
    }
});
</script>

<template>
    <div class="app-layout-topbar">
        <!-- 固定顶部区域：Logo和工具栏 -->
        <div
            class="topbar-header fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <!-- Logo区域 -->
            <div class="flex items-center gap-4">
                <img src="@/assets/images/logo.svg" alt="logo" class="w-12 h-12" />
            </div>
            <AppMegaMenu />
            <!-- 工具栏区域 -->
            <AppTopbar />

            <div
                :class="`absolute top-[50px] left-0 right-0 h-8 bg-gradient-to-b from-surface-50 to-transparent dark:from-surface-900 dark:to-transparent pointer-events-none z-10`">
            </div>

        </div>


        <!-- 可滚动的主内容区域 -->
        <div class="layout-main-container" :style="{ marginTop: headerHeight + 'px' }">
            <div class="content-wrapper p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
                <router-view />
            </div>

            <!-- 底部全局Footer -->
            <AppFooter />
        </div>
    </div>
</template>

<style scoped>
/* 固定顶部栏布局样式 */
.app-layout-topbar {
    position: relative;
    width: 100%;
}

/* 固定头部样式 */
.topbar-header {
    height: 4rem;
    transition: all 0.3s ease;
}

/* 固定菜单栏样式 */
.topbar-menu {
    height: 3rem;
    transition: all 0.3s ease;
}

/* 主内容容器 */
.layout-main-container {
    position: relative;
    width: 100%;
}

/* 内容包装器 */
.content-wrapper {
    background-color: var(--surface-ground);
    transition: margin-top 0.3s ease;
}

/* 确保内容区域有足够的最小高度 */
.content-wrapper {
    min-height: calc(100vh - 7rem);
    /* 减去头部和菜单栏的高度 */
}

/* 响应式适配 */
@media (max-width: 768px) {
    .topbar-header {
        padding: 0.75rem 1rem;
        height: 3.5rem;
    }

    .topbar-menu {
        height: 2.5rem;
        padding: 0.25rem 1rem;
    }

    .content-wrapper {
        min-height: calc(100vh - 6rem);
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

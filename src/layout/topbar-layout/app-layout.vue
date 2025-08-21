<script setup>
import { onMounted, provide, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores/layout';
import AppFooter from './app-footer.vue';
import AppMegaMenu from './app-mega-menu.vue';
import AppTopbar from '../shared/app-topbar.vue';

const layoutStore = useLayoutStore();
const { layoutConfig, layoutState } = storeToRefs(layoutStore);

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
        console.log('headerHeight', headerHeight.value);
    }
    if (menuEl) {
        menuHeight.value = menuEl.offsetHeight;
        console.log('headerHeight1222', headerHeight.value);
    }
});
</script>

<template>
    <div class="app-layout-topbar">
        <!-- 固定顶部区域：Logo和工具栏 -->
        <div class="topbar-header fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex items-center justify-between h-16 px-6 max-w-screen-2xl mx-auto">
                <!-- Logo区域 -->
                <div class="flex items-center gap-3 flex-shrink-0">
                    <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                        <img src="@/assets/images/logo.svg" alt="logo" class="w-6 h-6 filter brightness-0 invert" />
                    </div>
                    <div class="hidden sm:block">
                        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Sakai</h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1">Admin Dashboard</p>
                    </div>
                </div>
                
                <!-- 中间菜单区域 -->
                <div class="flex-1 flex justify-center mx-8">
                    <AppMegaMenu />
                </div>
                
                <!-- 右侧工具栏区域 -->
                <div class="flex items-center flex-shrink-0">
                    <AppTopbar />
                </div>
            </div>

            <!-- 装饰性渐变层 -->
            <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50"></div>
        </div>


        <!-- 可滚动的主内容区域 -->
        <div class="layout-main-container !p-0" :style="{ marginTop: headerHeight + 'px' }">
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

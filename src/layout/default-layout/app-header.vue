<script setup lang="ts">
import Button from 'primevue/button';
import { useLayoutStore } from '@/stores/layout';
import AppTopbar from '../shared/app-topbar.vue';
import AppBreadcrumb from './app-breadcrumb.vue';

// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();

// ==================== 事件处理方法 ====================
/** 处理菜单切换事件 - 直接调用 store 方法 */
const handleToggle = (): void => {
    layoutStore.smartToggleSidebar();
};
</script>

<template>
    <header
        :class="[
            'app-header',
            {
                'mobile-header': layoutStore.isMobile,
                'desktop-header': !layoutStore.isMobile
            }
        ]"
    >
        <div class="header-left">
            <!-- 菜单切换按钮 -->
            <Button :aria-label="layoutStore.sidebarHidden ? '显示菜单' : '隐藏菜单'" icon="pi pi-bars" class="mobile-menu-toggle" rounded severity="secondary" text @click="handleToggle" />

            <!-- 桌面端面包屑导航 -->
            <AppBreadcrumb v-if="!layoutStore.isMobile" />
        </div>

        <div class="header-right">
            <!-- 顶部工具栏 -->
            <AppTopbar />
        </div>
    </header>
</template>

<style lang="scss" scoped></style>

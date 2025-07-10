<template>
    <!-- 侧边栏布局模式 -->
    <div v-if="layoutConfig.layoutMode === 'sidebar'" class="app-layout" :class="{ 'sidebar-collapsed': isCollapsed }">
        <!-- 左侧边栏 -->
        <AppSidebar :collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />

        <!-- 右侧主体区域 -->
        <div class="main-content">
            <!-- 顶部头部栏 -->
            <AppHeader :collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />

            <!-- 主要内容区域 -->
            <div class="layout-main-container">
               <router-view></router-view>
            </div>

            <!-- 底部页脚 -->
            <AppFooter />
        </div>
    </div>

    <!-- 顶部栏布局模式 -->
    <div v-else class="app-layout-topbar flex flex-col h-screen">
        <!-- 顶部区域：Logo 和工具栏 -->
        <div class="topbar-header flex items-center justify-between px-6 py-4 bg-surface-0 dark:bg-surface-900 border-b border-surface">
            <!-- Logo 区域 -->
            <div class="flex items-center gap-4">
                <img src="/favicon.ico" alt="Logo" class="w-8 h-8" />
                <span class="text-xl font-semibold text-surface-900 dark:text-surface-0">Sakai Vue</span>
            </div>
            
            <!-- 工具栏区域 -->
            <AppTopbar />
        </div>

        <!-- 菜单栏区域 -->
        <div class="topbar-menu bg-surface-50 dark:bg-surface-800 border-b border-surface px-6 py-2">
            <AppMenu />
        </div>

        <!-- 中部主内容区域 -->
        <div class="flex-1 overflow-hidden">
            <div class="layout-main-container h-full overflow-y-auto">
                <router-view></router-view>
            </div>
        </div>

        <!-- 底部全局 Footer -->
        <AppFooter />
    </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import AppTopbar from './AppTopbar.vue'
import AppMenu from './AppMenu.vue'
import { useLayout } from '../composables/layout'

const { layoutConfig, isCollapsed, toggleSidebar } = useLayout()

// 提供给子组件使用
provide('layout', {
    isCollapsed,
    toggleSidebar,
    layoutConfig
})
</script>

<style scoped>
.app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: margin-left 0.3s ease;
}

.content-wrapper {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f5f5f5;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .app-layout.sidebar-collapsed .main-content {
        margin-left: 0;
    }
}
</style>

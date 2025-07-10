<template>
    <header class="app-header">
        <div class="header-left">
            <!-- 菜单切换按钮 -->
            <button class="sidebar-toggle" @click="$emit('toggle-sidebar')">
                <i class="toggle-icon">☰</i>
            </button>

            <!-- 面包屑导航 -->
            <AppBreadcrumb />
        </div>

        <div class="header-right">
            <!-- 顶部工具栏 -->
            <AppTopbar />
        </div>
    </header>
</template>

<script setup>
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppTopbar from './AppTopbar.vue'

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

defineEmits(['toggle-sidebar'])
</script>

<style scoped>
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 64px;
    background-color: var(--surface-card);
    transition: left var(--layout-section-transition-duration);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.sidebar-toggle:hover {
    background-color: #f5f5f5;
}

.toggle-icon {
    font-size: 18px;
    color: #666;
}

.header-right {
    display: flex;
    align-items: center;
}


</style>

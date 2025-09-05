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

const emit = defineEmits(['toggle-sidebar', 'toggle-mobile-sidebar']);

const handleToggle = () => {
    emit('toggle-sidebar');
}
</script>

<template>
    <header
class="app-header" :class="{
        'mobile-header': isMobile,
        'desktop-header': !isMobile
    }">
        <div class="header-left">
            <!-- 移动端菜单按钮 -->
            <Button
icon="pi pi-bars" severity="secondary" text rounded class="mobile-menu-toggle"
                aria-label="切换菜单" @click="handleToggle" />
            <!-- 桌面端面包屑导航 -->
            <AppBreadcrumb v-if="!isMobile" />
        </div>

        <div class="header-right">
            <!-- 顶部工具栏 -->
            <AppTopbar :is-mobile="isMobile" />
        </div>
    </header>
</template>

<style lang="scss" scoped></style>

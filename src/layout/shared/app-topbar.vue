<script setup lang="ts">
import { ref } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import Drawer from 'primevue/drawer';
import OverlayPanel from 'primevue/overlaypanel';
import { UserProfile } from '@/components';

// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();
const { isDarkTheme } = storeToRefs(layoutStore);
const { toggleDarkMode, openConfigDrawer } = layoutStore;

// ==================== 本地状态管理 ====================
/** 用户资料抽屉显示状态 */
const profileDrawerVisible = ref<boolean>(false);
/** 移动端菜单面板引用 */
const mobileMenuPanel = ref<InstanceType<typeof OverlayPanel>>();

// ==================== 事件处理方法 ====================
/**
 * 打开用户资料抽屉
 */
const openProfileDrawer = (): void => {
    profileDrawerVisible.value = true;
};

/**
 * 切换移动端菜单面板
 */
const toggleMobileMenu = (event: Event): void => {
    mobileMenuPanel.value?.toggle(event);
};
</script>

<template>
    <div :class="[
        'layout-topbar',
        {
            'mobile-topbar': layoutStore.isMobile,
            'desktop-topbar': !layoutStore.isMobile
        }
    ]">
        <div class="layout-topbar-actions">
            <!-- 移动端布局 -->
            <template v-if="layoutStore.isMobile">
                <!-- 主题切换按钮 -->
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>

                <!-- 移动端更多菜单 -->
                <button type="button" class="layout-topbar-action" aria-label="更多选项" @click="toggleMobileMenu">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <!-- 移动端菜单面板 -->
                <OverlayPanel ref="mobileMenuPanel" class="mobile-menu-panel">
                    <div class="mobile-menu-content">
                        <button type="button" class="mobile-menu-item" @click="openProfileDrawer">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button type="button" class="mobile-menu-item">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button>
                        <button type="button" class="mobile-menu-item" @click="openProfileDrawer">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <div class="mobile-menu-divider"></div>
                        <button type="button" class="mobile-menu-item" @click="openConfigDrawer">
                            <i class="pi pi-palette"></i>
                            <span>主题配置</span>
                        </button>
                    </div>
                </OverlayPanel>
            </template>

            <!-- 桌面端布局 -->
            <template v-else>
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                    </button>
                    <button type="button" class="layout-topbar-action layout-topbar-action-highlight" @click="openConfigDrawer">
                        <i class="pi pi-palette"></i>
                    </button>
                </div>

                <button
v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                    class="layout-topbar-menu-button layout-topbar-action">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action" @click="openProfileDrawer">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button>
                        <button type="button" class="layout-topbar-action" @click="openProfileDrawer">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- 用户资料抽屉 -->
    <Drawer
        v-model:visible="profileDrawerVisible" 
        header="Profile" 
        position="right" 
        class="profile-drawer"
        :style="{ width: layoutStore.isMobile ? '100vw' : '50rem' }">
        <UserProfile />
    </Drawer>


</template>

<style lang="scss" scoped>
@use '@/assets/layout/breakpoints' as bp;
@use '@/assets/layout/layout-sizes' as sizes;

.layout-topbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    z-index: sizes.$z-index-header;
}

.layout-topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-config-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-topbar-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: sizes.$action-button-height-desktop;
    height: sizes.$action-button-height-desktop;
    border: none;
    background: transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: all sizes.$sidebar-transition-duration;
    color: var(--text-color);
}

.layout-topbar-action:hover {
    background: var(--surface-hover);
}

.layout-topbar-action-highlight {
    background: var(--primary-color);
    color: var(--primary-color-text);
}

.layout-topbar-action-highlight:hover {
    background: var(--primary-color);
    opacity: 0.8;
}

.layout-topbar-menu-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-topbar-menu-content .layout-topbar-action {
    width: auto;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    gap: 0.5rem;
}

.layout-topbar-menu-content .layout-topbar-action span {
    font-size: 0.875rem;
    font-weight: 500;
}

.layout-rightmenu-button {
    background: linear-gradient(271.89deg, #465268, #7382a1) !important;
    border-radius: 6px 0 0 6px !important;
    border-color: transparent !important;
    border-left: 0 none !important;
    box-shadow: 0 0 10px #0f8bfd40 !important;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #fff !important;
    z-index: 10;
}

/* 移动端样式 */
.mobile-topbar {
    justify-content: flex-end;
}

.mobile-topbar .layout-topbar-actions {
    gap: 0.25rem;
}

.mobile-topbar .layout-topbar-action {
    width: sizes.$action-button-height-mobile;
    height: sizes.$action-button-height-mobile;
}

/* 移动端菜单面板 */
.mobile-menu-panel :deep(.p-overlaypanel-content) {
    padding: 0.5rem;
    min-width: 200px;
}

.mobile-menu-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-color);
    font-size: 0.875rem;
    text-align: left;
    width: 100%;
}

.mobile-menu-item:hover {
    background: var(--surface-hover);
}

.mobile-menu-item i {
    width: 1rem;
    text-align: center;
    color: var(--text-color-secondary);
}

.mobile-menu-divider {
    height: 1px;
    background: var(--surface-border);
    margin: 0.5rem 0;
}

/* 桌面端样式 */
.desktop-topbar {
    justify-content: flex-end;
}

/* 用户资料抽屉样式 */
.profile-drawer :deep(.p-drawer-content) {
    padding: 0;
}

.profile-drawer :deep(.p-drawer-header) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    border-bottom: 1px solid var(--surface-border);
}

.profile-drawer :deep(.p-drawer-header .p-drawer-title) {
    font-size: 1.125rem;
    font-weight: 600;
}

/* 移动端抽屉全屏样式 */
@include bp.mobile-only {
    .profile-drawer :deep(.p-drawer) {
        width: 100vw !important;
        max-width: 100vw !important;
    }

    .profile-drawer :deep(.p-drawer-header) {
        padding: 1rem;
    }

    .mobile-topbar .layout-topbar-action {
        width: sizes.$action-button-height-mobile;
        height: sizes.$action-button-height-mobile;
    }

    .mobile-topbar .layout-topbar-actions {
        gap: 0.125rem;
    }
}

/* 响应式优化 */
@include bp.tablet-only {
    .layout-topbar-action {
        width: sizes.$action-button-height-tablet;
        height: sizes.$action-button-height-tablet;
    }
}

/* 性能优化 */
.layout-topbar {
    will-change: transform;
    backface-visibility: hidden;
}


</style>

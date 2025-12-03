<script lang="ts" setup>
import { useLucideIcon } from '@/composables';
import type { MenuOptions } from '@/services/types/menu';
import useMenuStore from '@/stores/menu';
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
/**
 * 菜单项配置
 * Menubar 组件使用扁平化的菜单结构，支持多级嵌套
 */

const { menuList } = useMenuStore();
const { isLucideIcon, lucideIconName } = useLucideIcon();

const filterTreeMenu = (menuItems: MenuOptions[]): MenuOptions[] => {
    return menuItems
        .filter((item) => !item.meta.isHide)
        .map((item) => ({
            ...item,
            items: item.children ? filterTreeMenu(item.children) : undefined
        }))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

const filteredMenuItems = computed(() => {
    return filterTreeMenu(menuList);
});

const handleClick = (item: MenuItem, hasSubmenu: boolean) => {
    if (hasSubmenu) return;
    if (!item.path && item.meta.iframeUrl) {
        window.open(item.meta.iframeUrl, item.target || '_blank');
        return;
    }

    if (item.path) {
        router.push(item.path);
        return;
    }
};

const activeItemPath = ref('');
watchEffect(() => {
    activeItemPath.value = router.currentRoute.value.path;
});
</script>

<template>
    <div class="menubar-container">
        <Menubar ref="menubar" :model="filteredMenuItems">
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex items-center" :class="{ 'active-route': item.path === activeItemPath && !hasSubmenu }" v-bind="props.action" @click="handleClick(item, hasSubmenu)">
                    <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="16" />
                    <i v-else-if="item.meta.icon" :class="item.meta.icon" />
                    <span>{{ item.meta.title }}</span>
                    <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                    <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
                </a>
            </template>
        </Menubar>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/layout/layout-sizes' as sizes;

/**
 * Menubar 组件样式定制
 * 适配项目主题和设计规范
 */
.menubar-container {
    width: 100%;
    height: 100%;
    background: none;
}

/* 主菜单栏样式 */
.menubar-container :deep(.p-menubar) {
    @apply h-full flex;
    border: none;
    border-radius: 0;
    background: none;
    padding: 0;
}

/* 根级菜单列表 */
.menubar-container :deep(.p-menubar-root-list) {
    background: transparent;
    margin: 0;
    padding: 0;
}

/* 菜单项链接样式 */
.menubar-container :deep(.p-menuitem-link) {
    padding: 0.75rem 1rem;
    color: var(--text-color);
    border-radius: var(--border-radius);
    transition: all 0.2s;
    text-decoration: none;
}

/* 子菜单项样式 */
.menubar-container :deep(.p-submenu-list .p-menuitem-link) {
    padding: 0.5rem 1rem;
    width: 100%;
    font-size: 0.875rem;
}

/* 菜单图标 */
.menubar-container :deep(.p-menuitem-icon) {
    margin-right: 0.5rem;
    font-size: 1rem;
}

/* 子菜单图标 */
.menubar-container :deep(.p-submenu-icon) {
    margin-left: auto;
    font-size: 0.75rem;
}

/* 菜单徽章 */
.menubar-container :deep(.p-menuitem-badge) {
    margin-left: auto;
    background: var(--primary-color);
    color: var(--primary-color-text);
    min-width: sizes.$menu-badge-size;
    height: sizes.$menu-badge-size;
    line-height: 1.5rem;
    text-align: center;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .menubar-container :deep(.p-menubar) {
        padding: 0.5rem;
    }

    .menubar-container :deep(.p-menuitem-link) {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }
}

/* 活跃状态 */
.menubar-container :deep(.p-menuitem.p-menuitem-active > .p-menuitem-link) {
    background: var(--primary-color);
    color: var(--primary-color-text);
}

/* 禁用状态 */
.menubar-container :deep(.p-menuitem.p-disabled .p-menuitem-link) {
    opacity: 0.6;
    cursor: not-allowed;
}

// 当前路由高亮样式增强
.active-route {
    @apply bg-surface-200 text-slate-800 rounded-sm;
    @apply dark:bg-surface-800 dark:text-slate-100;
    position: relative;

    .layout-menuitem-icon {
        color: var(--primary-contrast-color) !important;
    }

    .layout-menuitem-text {
        color: var(--primary-contrast-color) !important;
        font-weight: 600;
    }
}
</style>

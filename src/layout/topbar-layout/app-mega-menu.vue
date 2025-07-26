<script lang="ts" setup>
import Menubar from 'primevue/menubar';
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
/**
 * 菜单项配置
 * Menubar 组件使用扁平化的菜单结构，支持多级嵌套
 */
const model = ref<any[]>([
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/',
                command: () => router.push('/')
            }
        ]
    },
    {
        label: 'UI Components',
        items: [
            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout', command: () => router.push('/uikit/formlayout') },
            { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input', command: () => router.push('/uikit/input') },
            { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon', command: () => router.push('/uikit/button') },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table', command: () => router.push('/uikit/table') },
            { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list', command: () => router.push('/uikit/list') },
            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree', command: () => router.push('/uikit/tree') },
            { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel', command: () => router.push('/uikit/panel') },
            { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay', command: () => router.push('/uikit/overlay') },
            { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media', command: () => router.push('/uikit/media') },
            { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', command: () => router.push('/uikit/menu') },
            { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message', command: () => router.push('/uikit/message') },
            { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file', command: () => router.push('/uikit/file') },
            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts', command: () => router.push('/uikit/charts') },
            { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline', command: () => router.push('/uikit/timeline') },
            { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc', command: () => router.push('/uikit/misc') }
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/landing',
                command: () => router.push('/landing')
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login',
                        command: () => router.push('/auth/login')
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error',
                        command: () => router.push('/auth/error')
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access',
                        command: () => router.push('/auth/access')
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud',
                command: () => router.push('/pages/crud')
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound',
                command: () => router.push('/pages/notfound')
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty',
                command: () => router.push('/pages/empty')
            }
        ]
    },
    {
        label: 'Hierarchy',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            }
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                to: '/documentation',
                command: () => router.push('/documentation')
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank',
                command: () => window.open('https://github.com/primefaces/sakai-vue', '_blank')
            }
        ]
    }
]);
const activeItemPath = ref('');
watchEffect(() => {
    activeItemPath.value = router.currentRoute.value.path;
});
</script>

<template>
    <div class="menubar-container">
        <Menubar :model="model" ref="menubar">
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex items-center" :class="{ 'active-route': item.to === activeItemPath && !hasSubmenu }" v-bind="props.action">
                    <i v-if="item.icon" :class="item.icon"></i>

                    <span>{{ item.label }}</span>
                    <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                    <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
                </a>
            </template>
        </Menubar>
    </div>
</template>

<style lang="scss" scoped>
/**
 * Menubar 组件样式定制
 * 适配项目主题和设计规范
 */
.menubar-container {
    width: 100%;
    height: 100%;
}

/* 主菜单栏样式 */
.menubar-container :deep(.p-menubar) {
    @apply h-full flex justify-center;
    border: none;
    border-radius: 0;
    background: var(--surface-overlay);
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

/* 菜单项悬停效果 */
.menubar-container :deep(.p-menuitem-link:hover) {
    background: var(--highlight-bg);
    color: var(--highlight-text-color);
}

/* 菜单项焦点效果 */
.menubar-container :deep(.p-menuitem-link:focus) {
    box-shadow: var(--focus-ring);
    outline: none;
}

/* 子菜单面板 */
.menubar-container :deep(.p-submenu-list) {
    background: var(--surface-overlay);
    border: 1px solid var(--surface-border);
    box-shadow: var(--overlay-shadow);
    border-radius: var(--border-radius);
    min-width: 12rem;
    padding: 0.5rem 0;
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
    min-width: 1.5rem;
    height: 1.5rem;
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
    background: var(--primary-color) !important;
    color: var(--primary-contrast-color) !important;
    border-radius: var(--content-border-radius);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background: var(--primary-contrast-color);
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--primary-color);
    }

    .layout-menuitem-icon {
        color: var(--primary-contrast-color) !important;
    }

    .layout-menuitem-text {
        color: var(--primary-contrast-color) !important;
        font-weight: 600;
    }
}
</style>
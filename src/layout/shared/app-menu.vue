<script setup lang="ts">
import { computed } from 'vue';
import AppMenuItem from './app-menu-item.vue';
import useMenuStore from '@/stores/menu';
import type { MenuOptions } from '@/services/types/menu';

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

const emit = defineEmits(['menu-item-click']);


const { menuList } = useMenuStore();
/**
 * 递归过滤树形菜单
 * @param menuItems 菜单项数组
 * @returns 过滤后的菜单项数组
 */
const filterTreeMenu = (menuItems: MenuOptions[]): MenuOptions[] => {
    return menuItems
        .filter((item) => !item.meta.isHide)
        .map((item) => ({
            ...item,
            children: item.children ? filterTreeMenu(item.children) : undefined
        }))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

const filteredMenuItems = computed(() => {
    return filterTreeMenu(menuList);
});

const handleMenuItemClick = () => {
    emit('menu-item-click');
};
</script>

<template>
    <nav class="app-menu" :class="{
        'mobile-menu': isMobile,
        'desktop-menu': !isMobile,
        'collapsed-menu': collapsed
    }">
        <div class="menu-content">
            <template v-for="(item, i) in filteredMenuItems" :key="item.id">
                <AppMenuItem :item="item" :index="i" :collapsed="collapsed" :level="0" :is-mobile="isMobile"
                    class="menu-item-wrapper" @menu-item-click="handleMenuItemClick" />
            </template>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
.app-menu {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                gap 0.25s ease;
    box-sizing: border-box;
}

/* 移动端样式 */
.mobile-menu {
    @apply bg-opacity-95 backdrop-blur-md border-none shadow-xl;
    border-radius: 0;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.25s ease;
}



.mobile-menu .menu-content {
    padding: 1.5rem 1rem;
    gap: 0.25rem;
    transition: padding 0.3s ease;
}

/* 桌面端样式 */
.desktop-menu {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}



/* 折叠状态样式 */
.collapsed-menu {
    width: 4rem;
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapsed-menu .menu-content {
    padding: 0.75rem 0.5rem;
    align-items: center;
    gap: 0.25rem;
    transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                align-items 0.25s ease;
}


/* 菜单项包装器 */
.menu-item-wrapper {
    position: relative;
}

/* 响应式适配 */
@media (max-width: 640px) {
    .mobile-menu {
        @apply rounded-t-2xl;
    }

    .mobile-menu .menu-content {
        padding: 2rem 1.25rem 1.5rem;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .desktop-menu .menu-content {
        padding: 0.5rem;
    }
}
/* 性能优化 */
.app-menu,
.menu-content,
.menu-item-wrapper {
    backface-visibility: hidden;
    transform-style: preserve-3d;
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
    .app-menu,
    .menu-content,
    .menu-item-wrapper,
    .mobile-menu,
    .desktop-menu,
    .collapsed-menu {
        transition: none;
        animation: none;
    }
}
</style>

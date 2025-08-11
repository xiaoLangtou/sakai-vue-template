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

</style>

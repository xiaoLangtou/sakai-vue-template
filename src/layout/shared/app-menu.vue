<script setup lang="ts">
import type { MenuOptions } from '@/services/types/menu';
import useMenuStore from '@/stores/menu';
import { computed } from 'vue';
import AppMenuItem from './app-menu-item.vue';

// ==================== Props 定义 ====================
interface Props {
    /** 是否折叠状态 */
    collapsed?: boolean;
    /** 是否为移动端 */
    isMobile?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
    isMobile: false
});

// ==================== 事件定义 ====================
const emit = defineEmits<{
    'menu-item-click': [];
}>();

// ==================== Store 状态管理 ====================
const { menuList } = useMenuStore();

// ==================== 计算属性 ====================
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

/** 过滤后的菜单项 */
const filteredMenuItems = computed(() => {
    return filterTreeMenu(menuList);
});

// ==================== 事件处理方法 ====================
/** 处理菜单项点击事件 */
const handleMenuItemClick = (): void => {
    emit('menu-item-click');
};
</script>

<template>
    <nav :class="[
        'app-menu',
        {
            'mobile-menu': props.isMobile,
            'desktop-menu': !props.isMobile,
            'collapsed-menu': props.collapsed,
            'expanded-menu': !props.collapsed
        }
    ]">
        <div class="menu-content">
            <template v-for="(item, i) in filteredMenuItems" :key="item.id">
                <AppMenuItem
                    :item="item"
                    :index="i"
                    :collapsed="props.collapsed"
                    :level="0"
                    :is-mobile="props.isMobile"
                    class="menu-item-wrapper"
                    @menu-item-click="handleMenuItemClick" />
            </template>
        </div>
    </nav>




</template>

<style lang="scss" scoped></style>

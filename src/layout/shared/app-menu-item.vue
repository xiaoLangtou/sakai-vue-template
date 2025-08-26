<script lang="ts" setup>
import { useLucideIcon } from '@/composables';
import type { MenuItem } from '@/types/layout';
import { ChevronRight } from 'lucide-vue-next';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFloatingMenu } from '../composables/useFloatingMenu';

interface Props {
    item: MenuItem;
    index: number;
    collapsed: boolean;
    level: number;
    isMobile: boolean;
    parentItemKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
    index: 0,
    collapsed: false,
    level: 0,
    isMobile: false,
    parentItemKey: undefined
});

const emit = defineEmits<{
    'menu-item-click': [];
}>();

const router = useRouter();
const floatingMenu = ref<HTMLElement | null>(null);

const menuId = `menu-${props.item.id}-${props.index}`;
const { isActive: showFloating, show: showFloatingMenu, hide: hideFloatingMenu, register } = useFloatingMenu(menuId);

const isExpanded = ref(false);

const hasChildren = computed(() => props.item.children && props.item.children.length > 0);
const isCurrentRoute = computed(() => props.item.path && router.currentRoute.value.path === props.item.path);
const shouldUseFloatingMenu = computed(() => props.collapsed && hasChildren.value);
const sortedChildren = computed(() => {
    if (!props.item.children) return [];
    return [...props.item.children].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
});

const hasActiveChild = (children: MenuItem[]): boolean => {
    return children.some(child => {
        if (child.path === router.currentRoute.value.path) {
            return true;
        }
        if (child.children && child.children.length > 0) {
            return hasActiveChild(child.children);
        }
        return false;
    });
};

/**
 * 检查是否为父菜单高亮（有子菜单激活但自身不是当前路由）
 */
const isParentHighlighted = computed(() => {
    return !isCurrentRoute.value && hasChildren.value && sortedChildren.value.length > 0 && hasActiveChild(sortedChildren.value);
});

onMounted(() => {
    register();

    // 只有当前路由匹配时才展开菜单
    if (hasChildren.value && sortedChildren.value.length > 0 && hasActiveChild(sortedChildren.value)) {
        isExpanded.value = true;
    }
});

watch(
    () => router.currentRoute.value.path,
    () => {
        if (hasChildren.value && sortedChildren.value.length > 0 && hasActiveChild(sortedChildren.value)) {
            isExpanded.value = true;
        }
    }
);

const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
};

const handleClick = async (event: Event) => {
    if (hasChildren.value) {
        if (shouldUseFloatingMenu.value) {
            event.stopPropagation();
            showFloatingMenu();
            await nextTick();
            if (floatingMenu.value && event.currentTarget) {
                positionFloatingMenu(event.currentTarget as Element, floatingMenu.value);
            }
            return;
        }
        toggleExpanded();
        return;
    }

    if (props.item.path) {
        router.push(props.item.path);
        if (props.isMobile) {
            emit('menu-item-click');
        }
        return;
    }

    if (props.item.url) {
        window.open(props.item.url, props.item.target || '_blank');
        if (props.isMobile) {
            emit('menu-item-click');
        }
        return;
    }
};

const handleClickOutside = (event: Event) => {
    if (floatingMenu.value && !floatingMenu.value.contains(event.target as Node)) {
        hideFloatingMenu();
    }
};

watch(showFloating, (newVal) => {
    if (newVal) {
        document.addEventListener('click', handleClickOutside);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }
});

const positionFloatingMenu = (triggerElement: Element, menuContainer: HTMLElement) => {
    if (!triggerElement || !menuContainer) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const menuRect = menuContainer.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = triggerRect.right + 1    ;
    let top = triggerRect.top;

    if (left + menuRect.width > viewportWidth) {
        left = triggerRect.left - menuRect.width - 8;
    }

    if (top + menuRect.height > viewportHeight) {
        top = Math.max(8, viewportHeight - menuRect.height - 8);
    }

    menuContainer.style.position = 'fixed';
    menuContainer.style.left = `${Math.max(8, left)}px`;
    menuContainer.style.top = `${Math.max(8, top)}px`;
    menuContainer.style.zIndex = '1000';
};

const { isLucideIcon, lucideIconName } = useLucideIcon();

const { isOutside } = useMouseInElement(floatingMenu);

watch(isOutside, () => {
    if (isOutside.value) {
        hideFloatingMenu();
    }
});

</script>

<template>
    <div>
        <!-- 折叠状态 -->
        <div v-if="collapsed && hasChildren" class="relative">
            <div class="collapsed-menu-item" :class="{
                'active': isCurrentRoute,
                'parent-highlighted': isParentHighlighted
            }" @click="handleClick">
                <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="16" />
                <i v-else-if="item.meta.icon" :class="item.meta.icon" />
                <span class="menu-item-title">{{ item.meta.title }}</span>
            </div>

            <Teleport to="body">
                <div v-if="showFloating" ref="floatingMenu" class="floating-menu" @click.stop>
                    <div class="floating-menu-content">
                        <AppMenuItem v-for="(child, i) in sortedChildren" :key="child.id" :item="child" :index="i"
                            :collapsed="false" :level="level + 1" :is-mobile="isMobile"
                            @menu-item-click="() => { emit('menu-item-click'); hideFloatingMenu(); }" />
                    </div>
                </div>
            </Teleport>
        </div>

        <!-- 正常状态 -->
        <div v-if="!collapsed" class="relative">
            <div class="menu-item" :class="[
                {
                    'active': isCurrentRoute,
                    'parent-highlighted': isParentHighlighted
                },
                `level-${level}`
            ]" @click="handleClick">

                <div class="menu-item-icon">
                    <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="16" />
                    <i v-else-if="item.meta.icon" :class="item.meta.icon" />
                </div>

                <span class="menu-item-title">{{ item.meta.title }}</span>

                <ChevronRight v-if="hasChildren" :size="16" class="menu-item-arrow"
                    :class="{ 'expanded': isExpanded }" />
            </div>

            <!-- 子菜单 -->
            <div v-if="hasChildren && isExpanded" class="submenu">
                <div class="submenu-container">
                    <AppMenuItem v-for="(child, i) in sortedChildren" :key="child.id" :item="child" :index="i"
                        :collapsed="collapsed" :level="level + 1" :is-mobile="isMobile" class="submenu-item"
                        @menu-item-click="emit('menu-item-click')" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 父菜单高亮样式 - 只高亮图标和标题颜色，不显示背景 */

</style>

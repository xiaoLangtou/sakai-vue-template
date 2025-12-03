<script lang="ts" setup>
import { useLucideIcon } from '@/composables';
import { useFavoritesStore } from '@/stores/favorites';
import type { MenuItem } from '@/types/layout';
import { ChevronRight, ExternalLink, Star } from 'lucide-vue-next';
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFloatingMenu } from '../composables/useFloatingMenu';

interface Props {
    item: MenuItem;
    index?: number;
    collapsed?: boolean;
    level?: number;
    isMobile?: boolean;
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
const favoritesStore = useFavoritesStore();

const menuId = `menu-${props.item.id}-${props.index}`;
const { isActive: showFloating, show: showFloatingMenu, hide: hideFloatingMenu, register } = useFloatingMenu(menuId);

// 注入手风琴模式相关方法
const accordion = inject<boolean>('accordion', false);
const toggleMenuExpand = inject<(itemId: string, currentExpanded: boolean) => boolean>('toggleMenuExpand', () => true);
const expandedMenuId = inject<{ value: string | null }>('expandedMenuId', { value: null });

const isExpanded = ref(false);

// 计算实际展开状态（考虑手风琴模式）
const actualExpanded = computed(() => {
    // 只有顶级菜单才受手风琴模式控制
    if (props.level === 0 && accordion) {
        return expandedMenuId.value === props.item.id;
    }
    // 子菜单或非手风琴模式，使用本地状态
    return isExpanded.value;
});

const hasChildren = computed(() => props.item.children && props.item.children.length > 0);
const isCurrentRoute = computed(() => props.item.path && router.currentRoute.value.path === props.item.path);
const shouldUseFloatingMenu = computed(() => props.collapsed && hasChildren.value);
const sortedChildren = computed(() => {
    if (!props.item.children) return [];
    return [...props.item.children].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
});

/**
 * 判断是否为外链菜单项
 * 条件：没有子菜单且有url属性
 */
const isExternalLink = computed(() => {
    return !hasChildren.value && props.item.url;
});

/**
 * 是否已收藏
 */
const isFavorited = computed(() => favoritesStore.isFavorite(props.item.id));

/**
 * 是否显示收藏按钮（只在有路径的菜单项显示，排除分组菜单和外链）
 */
const showFavoriteButton = computed(() => {
    // 条件：
    // 1. 有路径（排除纯分组菜单）
    // 2. 非折叠状态（折叠时不显示）
    // 3. 不是外部链接
    // 4. 没有子菜单（有子菜单的通常是分组）
    const hasPath = !!props.item.path;
    const notCollapsed = !props.collapsed;
    const notExternal = !isExternalLink.value;
    const noChildren = !hasChildren.value;

    return hasPath && notCollapsed && notExternal && noChildren;
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
    if (props.level === 0 && accordion) {
        // 顶级菜单且启用手风琴模式，使用统一控制
        const currentExpanded = expandedMenuId.value === props.item.id;
        toggleMenuExpand(props.item.id, currentExpanded);
    } else {
        // 子菜单或非手风琴模式，独立控制
        isExpanded.value = !isExpanded.value;
    }
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
        await router.push(props.item.path);
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

const handleToggleFavorite = (event: Event) => {
    event.stopPropagation();

    // 将 MenuItem 转换为 MenuOptions 格式
    const menuOption = {
        id: props.item.id,
        path: props.item.path || '',
        name: props.item.meta.title,
        meta: props.item.meta,
        params: props.item.params,
        query: props.item.query
    } as any; // 使用 any 来避免类型检查问题

    const result = favoritesStore.toggleFavorite(menuOption);

    // 可以添加提示消息
    if (result) {
        console.log(`已收藏: ${props.item.meta.title}`);
    } else {
        console.log(`已取消收藏: ${props.item.meta.title}`);
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
    let left = triggerRect.right + 1;
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

// 计算缩进样式
const indentStyle = computed(() => {
    if (props.collapsed) return {};
    const basePadding = 1;
    const levelPadding = 1.25;
    return {
        paddingLeft: `${basePadding + (props.level * levelPadding)}rem`
    };
});

const { isOutside } = useMouseInElement(floatingMenu);

watch(isOutside, () => {
    if (isOutside.value) {
        hideFloatingMenu();
    }
});

</script>

<template>
    <div class="menu-item-wrapper">
        <!-- 折叠状态 -->
        <div v-if="collapsed" class="collapsed-wrapper">
            <template v-if="hasChildren">
                <div class="collapsed-item" :class="{
                    'collapsed-item--active': isCurrentRoute || isParentHighlighted
                }" @click="handleClick">
                    <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="20" />
                    <i v-else-if="item.meta.icon" :class="item.meta.icon" class="text-xl" />
                </div>

                <Teleport to="body">
                    <div v-if="showFloating" ref="floatingMenu" class="floating-menu" @click.stop>
                        <div class="floating-menu-inner">
                            <div class="floating-menu-header">
                                {{ item.meta.title }}
                            </div>
                            <div class="floating-menu-content">
                                <AppMenuItem v-for="(child, i) in sortedChildren" :key="child.id" :collapsed="false"
                                    :index="i" :is-mobile="isMobile" :item="child" :level="0"
                                    @menu-item-click="() => { emit('menu-item-click'); hideFloatingMenu(); }" />
                            </div>
                        </div>
                    </div>
                </Teleport>
            </template>
            <template v-else>
                <div class="collapsed-item" :class="{
                    'collapsed-item--active': isCurrentRoute
                }" :title="item.meta.title" @click="handleClick">
                    <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="20" />
                    <i v-else-if="item.meta.icon" :class="item.meta.icon" class="text-xl" />
                </div>
            </template>
        </div>

        <!-- 正常状态 -->
        <div v-else class="expanded-wrapper">
            <div class="menu-item" :class="{
                'menu-item--active': isCurrentRoute && !hasChildren,
                'menu-item--parent-active': isParentHighlighted
            }" :style="indentStyle" @click="handleClick">
                <div class="menu-item-icon">
                    <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="20" />
                    <i v-else-if="item.meta.icon" :class="item.meta.icon" class="text-lg" />
                </div>

                <span class="menu-item-label">{{ item.meta.title }}</span>

                <ExternalLink v-if="isExternalLink" :size="14" class="menu-item-badge" />

                <!-- 收藏按钮 -->
                <button v-if="showFavoriteButton" class="menu-item-favorite"
                    :aria-label="isFavorited ? `取消收藏 ${item.meta.title}` : `收藏 ${item.meta.title}`"
                    @click="handleToggleFavorite">
                    <Star :size="14" :fill="isFavorited ? 'currentColor' : 'none'"
                        :class="{ 'text-yellow-500': isFavorited }" />
                </button>

                <ChevronRight v-if="hasChildren" :size="16" class="menu-item-arrow"
                    :class="{ 'menu-item-arrow--expanded': actualExpanded }" />
            </div>

            <!-- 子菜单 -->
            <Transition name="submenu">
                <div v-show="hasChildren && actualExpanded" class="submenu">
                    <AppMenuItem v-for="(child, i) in sortedChildren" :key="child.id" :collapsed="collapsed" :index="i"
                        :is-mobile="isMobile" :item="child" :level="level + 1"
                        @menu-item-click="emit('menu-item-click')" />
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.menu-item-wrapper {
    width: 100%;
    user-select: none;
}

// 折叠状态
.collapsed-wrapper {
    display: flex;
    justify-content: center;
    padding: 0.25rem 0.5rem;
}

.collapsed-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.5rem;
    color: var(--text-color-secondary);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 0.5rem;
        border: 2px solid transparent;
        transition: border-color 0.25s ease;
    }

    &:hover {
        background-color: var(--surface-hover);
        color: var(--text-color);
        transform: scale(1.05);

        &::after {
            border-color: var(--surface-border);
        }
    }

    &--active {
        background-color: var(--primary-color);
        color: var(--primary-contrast-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        &::after {
            border-color: var(--primary-color);
        }

        &:hover {
            background-color: var(--primary-color);
            opacity: 0.9;
            transform: scale(1.08);
        }
    }
}

// 展开状态
.expanded-wrapper {
    position: relative;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    margin: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    color: var(--text-color);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 0;
        background-color: var(--primary-color);
        border-radius: 0 2px 2px 0;
        transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover:not(&--active):not(&--parent-active) {
        background-color: var(--surface-hover);
        transform: translateX(4px);
    }

    &--active {
        background-color: var(--primary-color);
        color: var(--primary-contrast-color) !important;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &::before {
            height: 60%;
        }

        .menu-item-icon,
        .menu-item-arrow,
        .menu-item-badge {
            color: var(--primary-contrast-color) !important;
        }

        &:hover {
            background-color: var(--primary-color) !important;
            color: var(--primary-contrast-color) !important;
            opacity: 0.95;
            transform: translateX(4px) scale(1.01);
        }
    }

    &--parent-active {
        color: var(--primary-color) !important;
        font-weight: 600;
        background-color: rgba(var(--primary-color-rgb, 59, 130, 246), 0.08);

        &::before {
            height: 40%;
        }

        &:hover {
            background-color: rgba(var(--primary-color-rgb, 59, 130, 246), 0.12);
            transform: translateX(4px);
        }

        .menu-item-icon {
            color: var(--primary-color) !important;
        }

        .menu-item-label {
            color: var(--primary-color) !important;
        }
    }
}

.menu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-color-secondary);
    transition: color 0.2s ease;

    .menu-item:hover:not(.menu-item--active):not(.menu-item--parent-active) & {
        color: var(--text-color);
    }

    .menu-item--active & {
        color: var(--primary-contrast-color);
    }

    .menu-item--parent-active & {
        color: var(--primary-color);
    }
}

.menu-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.menu-item-badge {
    flex-shrink: 0;
    color: var(--text-color-secondary);
    opacity: 0.6;
    transition: opacity 0.2s ease;

    .menu-item:hover & {
        opacity: 1;
    }
}

.menu-item-favorite {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0.25rem;
    opacity: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-color-secondary);

    .menu-item:hover & {
        opacity: 1;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        transform: scale(1.1);
    }

    .menu-item--active & {
        color: var(--primary-contrast-color);

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
}

.menu-item-arrow {
    flex-shrink: 0;
    color: var(--text-color-secondary);
    transition: all 0.2s ease;

    &--expanded {
        transform: rotate(90deg);
        color: var(--text-color);
    }
}

// 子菜单
.submenu {
    overflow: hidden;
}

.submenu-enter-active {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.submenu-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.submenu-enter-from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-0.5rem);
}

.submenu-enter-to,
.submenu-leave-from {
    opacity: 1;
    transform: translateY(0);
}


// 浮动菜单
.floating-menu {
    position: fixed;
    z-index: 9999;
    animation: floatIn 0.15s ease-out;
}

.floating-menu-inner {
    min-width: 12rem;
    padding: 0.5rem;
    background-color: var(--surface-overlay);
    border: 1px solid var(--surface-border);
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.floating-menu-header {
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--surface-border);
}

.floating-menu-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

@keyframes floatIn {
    from {
        opacity: 0;
        transform: translateY(-0.5rem) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>

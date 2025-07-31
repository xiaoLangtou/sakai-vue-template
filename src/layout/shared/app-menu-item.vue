<script lang="ts" setup>
import type { MenuItem } from '@/types/layout';
import * as icons from "lucide-vue-next";
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

    console.log(triggerRect.right)
    let left = triggerRect.right + 23;
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

const isLucideIcon = (icon: string) => {
    return icon.startsWith("Lucide-");
}

const lucideIconName = (icon: string) => {
    const iconName = icon.replace("Lucide-", "") ?? "";
    if (!iconName) return null;
    return (icons as any)[iconName] || null;
}
</script>

<template>
    <div>
        <!-- 折叠状态 -->
        <div v-if="collapsed && hasChildren" class="relative">
            <div class="collapsed-menu-item" :class="{ 'active': isCurrentRoute }" @click="handleClick">
                <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="20" />
                <i v-else-if="item.meta.icon" :class="item.meta.icon" />
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
                { 'active': isCurrentRoute },
                `level-${level}`
            ]" @click="handleClick">

                <div class="menu-item-icon">
                    <component :is="lucideIconName(item.meta.icon)" v-if="isLucideIcon(item.meta.icon)" :size="18" />
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
/* 基础菜单项样式 */
.menu-item {
    font-size: 14px;
    @apply flex items-center px-3 py-2.5 mx-0 my-0.5 rounded-xl cursor-pointer text-slate-600 dark:text-slate-400 font-medium;
    position: relative;
    backdrop-filter: blur(8px);
    box-sizing: border-box;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover {
    @apply bg-slate-100 bg-opacity-80 text-slate-800 shadow-sm;
    /* 移除translateX避免抖动 */
}

.menu-item.active {
    @apply bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg;
    font-weight: 600;
}

.menu-item.active::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    @apply bg-primary-500 rounded-full;
}



/* 图标样式 */
.menu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-item-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover .menu-item-icon {
    /* 移除scale避免抖动 */
}

.menu-item.active .menu-item-icon {
    /* 移除scale避免抖动 */
    filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2));
}

/* 标题样式 */
.menu-item-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    letter-spacing: 0.01em;
}

/* 箭头样式 */
.menu-item-arrow {
    flex-shrink: 0;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.7;
}

.menu-item:hover .menu-item-arrow {
    opacity: 1;
}

.menu-item-arrow.expanded {
    transform: rotate(90deg);
    opacity: 1;
}

/* 层级缩进 */
.menu-item.level-1 {
    padding-left: 2.5rem;
    font-size: 13px;

}

.menu-item.level-2 {
    padding-left: 3.5rem;
    font-size: 12px;

}

.menu-item.level-3 {
    padding-left: 4.5rem;
    font-size: 12px;

}


/* 子菜单 */
.submenu {
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    position: relative;
    overflow: hidden;
}

.submenu-container {
    position: relative;
    padding-left: 1rem;
    margin-left: 0.75rem;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-8px);
        max-height: 0;
    }
    to {
        opacity: 1;
        transform: translateY(0);
        max-height: 500px;
    }
}

/* 垂直连线 */
.submenu-container::before {
    content: '';
    position: absolute;
    left: 0.75rem;
    top: -0.25rem;
    bottom: 0.5rem;
    width: 2px;
    @apply bg-gradient-to-b from-primary-500/30 to-primary-500/10;
    border-radius: 1px;
}





/* 折叠状态菜单项 */
.collapsed-menu-item {
    @apply flex items-center justify-center w-11 h-11 mx-auto my-1 rounded-xl cursor-pointer text-slate-500;
    position: relative;
    backdrop-filter: blur(8px);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapsed-menu-item:hover {
    @apply bg-slate-100 bg-opacity-80 text-slate-700 shadow-md;
    /* 移除scale避免抖动 */
}

.collapsed-menu-item.active {
    @apply bg-gradient-to-br from-primary-500 to-primary-600 text-primary-50 shadow-lg;
    font-weight: 600;
}

.collapsed-menu-item.active::after {
    content: '';
    position: absolute;
    right: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    @apply bg-primary-400 rounded-full;
}



/* 悬浮菜单 */
.floating-menu {
    @apply fixed z-50 min-w-52 bg-white bg-opacity-95 backdrop-blur-md border border-slate-200 border-opacity-60 rounded-2xl shadow-2xl;
    animation: fadeInScale 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-8px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.floating-menu-content {
    padding: 0.75rem;
}

/* 移动端优化 */
@media (max-width: 768px) {
    .menu-item {
        padding: 0.875rem 1rem;
        font-size: 15px;
        @apply rounded-2xl;
    }

    .menu-item-icon {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.875rem;
    }

    .collapsed-menu-item {
        @apply w-12 h-12;
    }
}
</style>

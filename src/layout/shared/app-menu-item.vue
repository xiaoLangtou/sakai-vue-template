<script lang="ts" setup>
import * as icons from "lucide-vue-next";
import { ChevronRight } from 'lucide-vue-next';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFloatingMenu } from '../composables/useFloatingMenu';
import type { MenuItem } from '@/types/layout';

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
            <div class="collapsed-menu-item"
                :class="{ 'active': isCurrentRoute }"
                @click="handleClick">
                <component v-if="isLucideIcon(item.meta.icon)"
                    :is="lucideIconName(item.meta.icon)"
                    :size="20" />
                <i v-else-if="item.meta.icon" :class="item.meta.icon" />
            </div>

            <Teleport to="body">
                <div v-if="showFloating"
                    ref="floatingMenu"
                    class="floating-menu"
                    @click.stop>
                    <div class="floating-menu-content">
                        <AppMenuItem
                        v-for="(child, i) in sortedChildren"
                        :key="child.id"
                        :item="child"
                        :index="i"
                        :collapsed="false"
                        :level="level + 1"
                        :is-mobile="isMobile"
                        @menu-item-click="() => { emit('menu-item-click'); hideFloatingMenu(); }" />
                    </div>
                </div>
            </Teleport>
        </div>

        <!-- 正常状态 -->
        <div v-if="!collapsed" class="relative">
            <div class="menu-item"
                :class="[
                    { 'active': isCurrentRoute },
                    `level-${level}`
                ]"
                @click="handleClick">

                <div class="menu-item-icon">
                    <component v-if="isLucideIcon(item.meta.icon)"
                        :is="lucideIconName(item.meta.icon)"
                        :size="18" />
                    <i v-else-if="item.meta.icon" :class="item.meta.icon" />
                </div>

                <span class="menu-item-title">{{ item.meta.title }}</span>

                <ChevronRight v-if="hasChildren"
                    :size="16"
                    class="menu-item-arrow"
                    :class="{ 'expanded': isExpanded }" />
            </div>

            <!-- 子菜单 -->
            <div v-if="hasChildren && isExpanded" class="submenu">
                <div class="submenu-container">
                    <AppMenuItem
                        v-for="(child, i) in sortedChildren"
                        :key="child.id"
                        :item="child"
                        :index="i"
                        :collapsed="collapsed"
                        :level="level + 1"
                        :is-mobile="isMobile"
                        class="submenu-item"
                        @menu-item-click="emit('menu-item-click')" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 基础菜单项样式 */
.menu-item {
    @apply flex items-center px-4 py-3 mx-0 my-0.5 rounded-lg cursor-pointer text-slate-500 text-sm font-medium transition-all duration-150;
}

.menu-item:hover {
    @apply bg-slate-50 text-slate-700;
}

.menu-item.active {
    @apply bg-primary-500 text-white;
}

.dark .menu-item {
    @apply text-slate-400;
}

.dark .menu-item:hover {
    @apply bg-slate-800 text-slate-200;
}

.dark .menu-item.active {
    @apply bg-primary-500 text-white;
}

/* 图标样式 */
.menu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

/* 标题样式 */
.menu-item-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 箭头样式 */
.menu-item-arrow {
    flex-shrink: 0;
    transition: transform 0.15s ease;
}

.menu-item-arrow.expanded {
    transform: rotate(90deg);
}

/* 层级缩进 */
.menu-item.level-1 {
    padding-left: 1rem;
}

.menu-item.level-2 {
    padding-left: 1rem;
}

.menu-item.level-3 {
    padding-left: 1cap;
}

/* 子菜单 */
.submenu {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    position: relative;
}

.submenu-container {
    position: relative;
    padding-left: 1.5rem;
    margin-left: 0.5rem;
}

/* 垂直连线 */
.submenu-container::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 0rem;
    bottom: 0rem;
    width: 1px;
    background:rgba(148, 163, 184, 0.3);
    border-radius: 0.5px;
}

.dark .submenu-container::before {
    background: rgba(148, 163, 184, 0.3);
}



/* 折叠状态菜单项 */
.collapsed-menu-item {
    @apply flex items-center justify-center w-10 h-10 mx-auto my-1 rounded-lg cursor-pointer text-slate-500 transition-all duration-150;
}

.collapsed-menu-item:hover {
    @apply bg-slate-50 text-slate-700;
}

.collapsed-menu-item.active {
    @apply bg-primary-500 text-white;
}

.dark .collapsed-menu-item {
    @apply text-slate-400;
}

.dark .collapsed-menu-item:hover {
    @apply bg-slate-800 text-slate-200;
}

.dark .collapsed-menu-item.active {
    @apply bg-primary-500 text-white;
}

/* 悬浮菜单 */
.floating-menu {
    @apply fixed z-50 min-w-48 bg-white border border-slate-200 rounded-lg shadow-lg;
}

.dark .floating-menu {
    @apply bg-slate-800 border-slate-600 shadow-xl;
}

.floating-menu-content {
    padding: 0.5rem;
}

/* 移动端优化 */
@media (max-width: 768px) {
    .menu-item {
        padding: 1rem;
        font-size: 1rem;
    }

    .menu-item-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 1rem;
    }
}
</style>

<script setup>
import Badge from 'primevue/badge';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    },
    collapsed: {
        type: Boolean,
        default: false
    },
    level: {
        type: Number,
        default: 0
    }
});

const router = useRouter();
const expanded = ref(false);
const floatingMenu = ref(null);
const childFloatingMenus = ref({});

const hasChildren = computed(() => props.item.items && props.item.items.length > 0);
const isGroupLabel = computed(() => props.level === 0 && hasChildren.value);
const isCurrentRoute = computed(() => props.item.to && router.currentRoute.value.path === props.item.to);

// 判断是否需要使用悬浮菜单 (折叠状态下且层级大于等于2)
const shouldUseFloatingMenu = computed(() => props.collapsed && props.level >= 2 && hasChildren.value);

const toggleExpanded = () => {
    if (hasChildren.value && !props.collapsed) {
        expanded.value = !expanded.value;
    }
};

const handleClick = (event) => {
    if (props.item.to) {
        router.push(props.item.to);
        return;
    }

    if (props.item.url) {
        window.open(props.item.url, props.item.target || '_blank');
        return;
    }

    // 如果是折叠状态且层级大于等于2且有子菜单，显示悬浮菜单
    if (shouldUseFloatingMenu.value) {
        showFloatingMenu(event);
    } else if (!props.collapsed && hasChildren.value) {
        // 展开状态下正常切换展开收起
        toggleExpanded();
    }
};

// 处理折叠状态下的子菜单点击
const handleCollapsedChildClick = (child, event, index) => {
    if (child.to) {
        router.push(child.to);
    } else if (child.url) {
        window.open(child.url, child.target || '_blank');
    } else if (child.items && child.items.length > 0) {
        // 如果子菜单还有子项，显示悬浮菜单
        showFloatingMenuForChild(child, event, index);
    }
};

// 显示悬浮菜单
const showFloatingMenu = async (event) => {
    if (floatingMenu.value) {
        // 阻止默认的定位行为
        floatingMenu.value.overlayVisible = true;
        floatingMenu.value.target = event.currentTarget;
        await nextTick();
        positionFloatingMenu(event.currentTarget, floatingMenu.value.container);
    }
};

// 为子菜单项显示悬浮菜单
const showFloatingMenuForChild = async (child, event, index) => {
    const menuRef = childFloatingMenus.value[`child-${index}`];
    if (menuRef) {
        // 阻止默认的定位行为
        menuRef.overlayVisible = true;
        menuRef.target = event.currentTarget;
        await nextTick();
        positionFloatingMenu(event.currentTarget, menuRef.container);
    }
};

// 自定义定位函数
const positionFloatingMenu = (triggerElement, menuContainer) => {
    if (!triggerElement || !menuContainer) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const menuRect = menuContainer.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 默认定位在右侧
    let left = triggerRect.right + 8;
    let top = triggerRect.top;

    // 如果右侧空间不足，定位在左侧
    if (left + menuRect.width > viewportWidth) {
        left = triggerRect.left - menuRect.width - 8;
    }

    // 如果下方空间不足，向上调整
    if (top + menuRect.height > viewportHeight) {
        top = Math.max(8, viewportHeight - menuRect.height - 8);
    }

    // 应用定位
    menuContainer.style.position = 'fixed';
    menuContainer.style.left = `${Math.max(8, left)}px`;
    menuContainer.style.top = `${Math.max(8, top)}px`;
    menuContainer.style.zIndex = '9999';
};

// 转换菜单项为 PrimeVue Menu 格式
const convertToMenuItems = (items) => {
    return items.map((item) => ({
        label: item.label,
        icon: item.icon,
        command: () => {
            if (item.to) {
                router.push(item.to);
            } else if (item.url) {
                window.open(item.url, item.target || '_blank');
            }
        },
        items: item.items ? convertToMenuItems(item.items) : undefined
    }));
};

const floatingMenuItems = computed(() => {
    return shouldUseFloatingMenu.value ? convertToMenuItems(props.item.items) : [];
});

const itemClasses = computed(() => [
    'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer relative',
    'transition-all duration-300 ease-out',
    'hover:bg-surface-100 dark:hover:bg-surface-800 hover:shadow-sm',
    'active:bg-surface-200 dark:active:bg-surface-700 active:scale-[0.98]',
    'group',
    {
        'justify-center': props.collapsed,
        // 使用新的选中样式
        'active-route': isCurrentRoute.value
    }
]);

const iconClasses = computed(() => [
    'text-base flex-shrink-0 transition-colors duration-300 layout-menuitem-icon',
    props.collapsed ? 'mx-auto' : '',
    !isCurrentRoute.value ? 'text-surface-600 dark:text-surface-300' : ''
]);

// 递归获取子菜单项 - 折叠状态下的特殊处理
const getCollapsedChildItems = (items) => {
    const result = [];
    if (!items) return result;

    items.forEach((item) => {
        // 添加所有有路由或链接的项
        if (item.to || item.url) {
            result.push(item);
        }
        // 添加有子菜单的项（用于显示悬浮菜单）
        if (item.items && item.items.length > 0) {
            result.push({
                ...item,
                hasSubMenu: true
            });
        }
    });
    return result;
};

const flattenedChildren = computed(() => {
    if (!hasChildren.value) return [];

    if (props.collapsed) {
        return getCollapsedChildItems(props.item.items);
    } else {
        // 展开状态下不需要扁平化
        return [];
    }
});

// 检查当前路由是否在子菜单中
const isChildRouteActive = (child) => {
    return child.to && router.currentRoute.value.path === child.to;
};

// 检查子菜单是否还有子项
const hasSubChildren = (child) => {
    return child.items && child.items.length > 0;
};

// 设置子菜单的 ref
const setChildMenuRef = (el, index) => {
    if (el) {
        childFloatingMenus.value[`child-${index}`] = el;
    }
};
</script>

<template>
    <div>
        <!-- 组标题 (只在未折叠时显示) -->
        <div v-if="isGroupLabel && !collapsed"
            class="px-3 py-2 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">
            {{ item.label }}
        </div>

        <!-- 折叠状态下的父菜单项 (有子菜单时) -->
        <div v-else-if="isGroupLabel && collapsed" class="relative">
            <!-- 父菜单图标 -->
            <div :class="itemClasses" v-tooltip.right="{
                value: item.label,
                showDelay: 300,
                hideDelay: 100
            }">
                <i v-if="item.icon" :class="[item.icon, iconClasses]"></i>
                <i v-else :class="['pi pi-folder', iconClasses]"></i>
            </div>

            <!-- 折叠状态下的子菜单项 -->
            <div class="mt-1 space-y-1">
                <div v-for="(child, i) in flattenedChildren" :key="i" :class="[
                    'flex items-center justify-center px-3 py-2 rounded-lg cursor-pointer relative',
                    'transition-all duration-300 ease-out',
                    'hover:bg-surface-100 dark:hover:bg-surface-800 hover:shadow-sm',
                    'active:bg-surface-200 dark:active:bg-surface-700 active:scale-[0.95]',
                    {
                        // 使用新的选中样式
                        'active-route': isChildRouteActive(child)
                    }
                ]" @click="(e) => handleCollapsedChildClick(child, e, i)" v-tooltip.right="{
                        value: child.label,
                        showDelay: 300,
                        hideDelay: 100
                    }">
                    <i v-if="child.icon"
                        :class="[
                            child.icon, 
                            'text-sm transition-colors duration-300 layout-menuitem-icon', 
                            !isChildRouteActive(child) ? 'text-surface-600 dark:text-surface-300' : ''
                        ]"></i>
                    <i v-else :class="[
                        hasSubChildren(child) ? 'pi pi-folder' : 'pi pi-circle-fill',
                        hasSubChildren(child) ? 'text-sm' : 'text-xs',
                        'transition-colors duration-300 layout-menuitem-icon',
                        !isChildRouteActive(child) ? 'text-surface-600 dark:text-surface-300' : ''
                    ]"></i>

                    <!-- 有子菜单的指示器 -->
                    <div v-if="hasSubChildren(child)"
                        class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>

                    <!-- 子菜单的悬浮菜单 -->
                    <Menu v-if="hasSubChildren(child)" :ref="(el) => setChildMenuRef(el, i)"
                        :model="convertToMenuItems(child.items)" :popup="true" class="floating-submenu" />
                </div>
            </div>
        </div>

        <!-- 普通菜单项 (无子菜单或非组标题) -->
        <div v-else-if="!isGroupLabel" :class="itemClasses" @click="handleClick" v-tooltip.right="collapsed
                ? {
                    value: item.label,
                    showDelay: 300,
                    hideDelay: 100
                }
                : null
            ">
            <!-- 图标 -->
            <i v-if="item.icon" :class="[item.icon, iconClasses]"></i>

            <!-- 标签文本 -->
            <Transition enter-active-class="transition-all duration-200"
                leave-active-class="transition-all duration-200" enter-from-class="opacity-0 translate-x-2"
                enter-to-class="opacity-100 translate-x-0" leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 translate-x-2">
                <span v-show="!collapsed" :class="[
                    'flex-1 text-sm font-medium truncate transition-all duration-300 layout-menuitem-text',
                    !isCurrentRoute ? 'text-surface-700 dark:text-surface-200' : ''
                ]">
                    {{ item.label }}
                </span>
            </Transition>

            <!-- 徽章 -->
            <Transition enter-active-class="transition-all duration-200"
                leave-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <Badge v-if="item.badge && !collapsed" :value="item.badge" severity="info" size="small" />
            </Transition>

            <!-- 展开箭头 (只在展开状态显示) -->
            <Transition enter-active-class="transition-all duration-200"
                leave-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <i v-if="hasChildren && !collapsed"
                    :class="['pi pi-chevron-down', 'text-xs text-surface-400 dark:text-surface-500', 'transition-transform duration-200', { 'rotate-180': expanded }]" />
            </Transition>

            <!-- 折叠状态下的悬浮菜单指示器 -->
            <div v-if="shouldUseFloatingMenu" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>

        <!-- 悬浮菜单 (用于折叠状态下层级大于等于2的子菜单) -->
        <MegaMenu :model="floatingMenuItems" orientation="vertical" v-if="shouldUseFloatingMenu" ref="floatingMenu" />
        <!-- <Menu
            v-if="shouldUseFloatingMenu"
            ref="floatingMenu"
            :model="floatingMenuItems"
            :popup="true"
            class="floating-submenu"
        /> -->

        <!-- 普通子菜单 (展开状态下正常显示所有层级) -->
        <Transition enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96" leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0">
            <div v-show="hasChildren && (expanded || level === 0) && !collapsed" class="overflow-hidden">
                <div class="ml-4 mt-1 space-y-1">
                    <AppMenuItem v-for="(child, i) in item.items" :key="i" :item="child" :index="i"
                        :collapsed="collapsed" :level="level + 1" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.floating-submenu {
    z-index: 1050;
}

/* 当前路由高亮样式增强 */
.active-route {
    background: var(--primary-color) !important;
    color: var(--primary-contrast-color) !important;
    border-radius: var(--content-border-radius);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    position: relative;
}

.active-route::after {
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

.active-route .layout-menuitem-icon {
    color: var(--primary-contrast-color) !important;
}

.active-route .layout-menuitem-text {
    color: var(--primary-contrast-color) !important;
    font-weight: 600;
}

/* 可选：自定义悬浮菜单样式 */
:deep(.p-menu) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    background: var(--surface-card);
    min-width: 200px;
}

:deep(.p-menu .p-menuitem-link) {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

:deep(.p-menu .p-menuitem-link:hover) {
    background: var(--surface-hover);
}

:deep(.p-menu .p-menuitem-icon) {
    font-size: 0.875rem;
}

:deep(.p-menu .p-menuitem-text) {
    font-size: 0.875rem;
    font-weight: 500;
}

/* 暗色模式下的调整 */
@media (prefers-color-scheme: dark) {
    .group.bg-gradient-to-r::after {
        background: linear-gradient(45deg, transparent, var(--primary-800), transparent);
    }
}
</style>

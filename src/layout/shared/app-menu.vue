<script setup lang="ts">
import { computed } from 'vue';
import AppMenuItem from './app-menu-item.vue';
import useMenuStore from '@/stores/menu';

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
const filteredMenuItems = computed(() => {
    return menuList
        .filter((item) => !item.meta.isHide)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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
}

.dark .app-menu {
    @apply bg-slate-900 border-r-slate-700;
}

.menu-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

/* 移动端样式 */
.mobile-menu {
    @apply p-0 bg-white border-none shadow-md;
}

.dark .mobile-menu {
    @apply bg-slate-900 shadow-lg;
}

.mobile-menu .menu-content {
    padding: 1.5rem 1rem;
    gap: 0.5rem;
}

/* 桌面端样式 */
.desktop-menu {
    padding: 0;
}

/* 折叠状态样式 */
.collapsed-menu {
    @apply p-0;
}

.dark .collapsed-menu {
    @apply bg-slate-900;
}

.collapsed-menu .menu-content {
    padding: 1rem 0.5rem;
    align-items: center;
    gap: 0.5rem;
}

/* 优化的滚动条样式 */
.app-menu::-webkit-scrollbar {
    @apply w-1.5;
}

.app-menu::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.app-menu::-webkit-scrollbar-thumb {
    @apply bg-slate-300/60 rounded-full;
    transition: background-color 0.2s ease;
}

.app-menu::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-400/80;
}

.dark .app-menu::-webkit-scrollbar-thumb {
    @apply bg-slate-600/60;
}

.dark .app-menu::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-500/80;
}

/* 隐藏滚动条角落 */
.app-menu::-webkit-scrollbar-corner {
    @apply bg-transparent;
}

/* 响应式适配 */
@media (max-width: 640px) {
    .mobile-menu .menu-content {}
}

@media (min-width: 768px) and (max-width: 1023px) {
    .desktop-menu .menu-content {}
}
</style>

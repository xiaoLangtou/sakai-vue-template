<script lang="ts" setup>
import { useLucideIcon } from '@/composables';
import { useFavoritesStore } from '@/stores/favorites';
import { Star } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// ==================== Props ====================
interface Props {
    /** 是否折叠状态 */
    collapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
    collapsed: false
});

const emit = defineEmits<{
    'menu-item-click': [];
}>();

// ==================== 状态管理 ====================
const router = useRouter();
const favoritesStore = useFavoritesStore();
const { isLucideIcon, lucideIconName } = useLucideIcon();

// ==================== 计算属性 ====================
/** 是否有收藏 */
const hasFavorites = computed(() => favoritesStore.count > 0);

/** 当前路由路径 */
const currentPath = computed(() => router.currentRoute.value.path);

/** 检查菜单是否为当前激活路由 */
const isActiveRoute = (path: string): boolean => {
    return currentPath.value === path;
};

// ==================== 事件处理 ====================
/**
 * 处理菜单项点击
 */
const handleMenuClick = (item: any) => {
    router.push({
        path: item.path,
        ...(item.params && Object.keys(item.params).length > 0 && { params: item.params }),
        ...(item.query && Object.keys(item.query).length > 0 && { query: item.query })
    });
    emit('menu-item-click');
};

/**
 * 取消收藏
 */
const handleRemoveFavorite = (event: Event, menuId: number) => {
    event.stopPropagation();
    favoritesStore.removeFavorite(menuId);
};
</script>

<template>
    <div v-if="hasFavorites" class="favorites-menu">
        <!-- 折叠状态 -->
        <template v-if="collapsed">
            <div class="favorites-collapsed">
                <div class="favorites-icon">
                    <Star :size="20" :fill="'currentColor'" class="text-yellow-500" />
                </div>
            </div>
        </template>

        <!-- 展开状态 -->
        <template v-else>
            <!-- 分组标题 -->
            <div class="favorites-header">
                <Star :size="16" :fill="'currentColor'" class="text-yellow-500 flex-shrink-0" />
                <span class="favorites-title">常用功能</span>
                <span class="favorites-count">{{ favoritesStore.count }}</span>
            </div>

            <!-- 收藏列表 -->
            <div class="favorites-list">
                <div
v-for="item in favoritesStore.favoriteMenus" :key="item.id" :class="[
                    'favorite-item',
                    {
                        'favorite-item--active': isActiveRoute(item.path)
                    }
                ]" @click="handleMenuClick(item)">
                    <!-- 图标 -->
                    <div class="favorite-item-icon">
                        <component :is="lucideIconName(item.icon)" v-if="isLucideIcon(item.icon)" :size="18" />
                        <i v-else-if="item.icon" :class="item.icon" class="text-base" />
                    </div>

                    <!-- 标题 -->
                    <span class="favorite-item-label">{{ item.title }}</span>

                    <!-- 取消收藏按钮 -->
                    <button
class="favorite-item-remove" :aria-label="`取消收藏 ${item.title}`"
                        @click="handleRemoveFavorite($event, item.id)">
                        <Star :size="14" :fill="'currentColor'" class="text-yellow-500" />
                    </button>
                </div>
            </div>

            <!-- 分隔线 -->
            <div class="favorites-divider"></div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.favorites-menu {
    width: 100%;
}

// 折叠状态
.favorites-collapsed {
    display: flex;
    justify-content: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--surface-border);

    .favorites-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        background-color: var(--surface-100);
        transition: all 0.2s ease;

        &:hover {
            background-color: var(--surface-200);
            transform: scale(1.05);
        }
    }
}

// 展开状态
.favorites-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;

    .favorites-title {
        flex: 1;
    }

    .favorites-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.25rem;
        height: 1.25rem;
        padding: 0 0.375rem;
        font-size: 0.625rem;
        font-weight: 600;
        color: var(--primary-contrast-color);
        background-color: var(--primary-color);
        border-radius: 0.625rem;
    }
}

.favorites-list {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0 0.5rem;
}

.favorite-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 1rem;
    color: var(--text-color);
    background-color: transparent;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;

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
        transition: height 0.2s ease;
    }

    &:hover {
        background-color: var(--surface-hover);
        transform: translateX(4px);

        .favorite-item-remove {
            opacity: 1;
        }
    }

    &--active {
        background-color: var(--primary-color);
        color: var(--primary-contrast-color) !important;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &::before {
            height: 60%;
        }

        .favorite-item-icon,
        .favorite-item-remove {
            color: var(--primary-contrast-color) !important;
        }

        &:hover {
            background-color: var(--primary-color) !important;
            opacity: 0.95;
        }

        .favorite-item-remove {
            opacity: 1;
        }
    }
}

.favorite-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-color-secondary);
    transition: color 0.2s ease;

    .favorite-item:hover:not(.favorite-item--active) & {
        color: var(--text-color);
    }

    .favorite-item--active & {
        color: var(--primary-contrast-color);
    }
}

.favorite-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.favorite-item-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0.25rem;
    opacity: 0;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        transform: scale(1.1);
    }

    .favorite-item--active & {
        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
}

.favorites-divider {
    height: 1px;
    margin: 0.75rem 0;
    background: linear-gradient(90deg,
            transparent,
            var(--surface-border) 20%,
            var(--surface-border) 80%,
            transparent);
}
</style>

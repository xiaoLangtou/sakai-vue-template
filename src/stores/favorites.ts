import type { MenuOptions } from '@/services/types/menu';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * 收藏菜单项的简化数据结构
 */
export interface FavoriteMenuItem {
    /** 菜单 ID */
    id: number;
    /** 菜单标题 */
    title: string;
    /** 菜单路径 */
    path: string;
    /** 菜单图标 */
    icon?: string;
    /** 路由参数 */
    params?: Record<string, any>;
    /** 路由查询参数 */
    query?: Record<string, any>;
    /** 收藏时间戳 */
    timestamp: number;
}

/**
 * 收藏菜单 Store
 */
export const useFavoritesStore = defineStore(
    'favorites',
    () => {
        // ==================== 状态 ====================
        /** 收藏的菜单项列表 */
        const favoriteMenus = ref<FavoriteMenuItem[]>([]);

        /** 最大收藏数量 */
        const MAX_FAVORITES = 10;

        // ==================== 计算属性 ====================
        /**
         * 收藏的菜单 ID 集合（用于快速查找）
         */
        const favoriteIds = computed(() => new Set(favoriteMenus.value.map((item) => item.id)));

        /**
         * 是否已达到最大收藏数量
         */
        const isFull = computed(() => favoriteMenus.value.length >= MAX_FAVORITES);

        /**
         * 收藏数量
         */
        const count = computed(() => favoriteMenus.value.length);

        // ==================== 方法 ====================
        /**
         * 检查菜单是否已收藏
         * @param menuId 菜单 ID
         */
        const isFavorite = (menuId: number): boolean => {
            return favoriteIds.value.has(menuId);
        };

        /**
         * 添加收藏
         * @param menu 菜单项
         * @returns 是否添加成功
         */
        const addFavorite = (menu: MenuOptions): boolean => {
            // 检查是否已收藏
            if (isFavorite(menu.id)) {
                console.warn(`菜单 "${menu.meta.title}" 已在收藏中`);
                return false;
            }

            // 检查是否已达到最大数量
            if (isFull.value) {
                console.warn(`收藏数量已达上限 (${MAX_FAVORITES})`);
                return false;
            }

            // 检查菜单是否有路径
            if (!menu.path) {
                console.warn(`菜单 "${menu.meta.title}" 没有路径，无法收藏`);
                return false;
            }

            // 添加到收藏列表
            const favoriteItem: FavoriteMenuItem = {
                id: menu.id,
                title: menu.meta.title,
                path: menu.path,
                icon: menu.meta.icon,
                params: menu.params,
                query: menu.query,
                timestamp: Date.now()
            };

            favoriteMenus.value.unshift(favoriteItem);
            return true;
        };

        /**
         * 移除收藏
         * @param menuId 菜单 ID
         * @returns 是否移除成功
         */
        const removeFavorite = (menuId: number): boolean => {
            const index = favoriteMenus.value.findIndex((item) => item.id === menuId);
            if (index === -1) {
                return false;
            }

            favoriteMenus.value.splice(index, 1);
            return true;
        };

        /**
         * 切换收藏状态
         * @param menu 菜单项
         * @returns 切换后的状态（true: 已收藏, false: 未收藏）
         */
        const toggleFavorite = (menu: MenuOptions): boolean => {
            if (isFavorite(menu.id)) {
                removeFavorite(menu.id);
                return false;
            } else {
                addFavorite(menu);
                return true;
            }
        };

        /**
         * 清空所有收藏
         */
        const clearFavorites = (): void => {
            favoriteMenus.value = [];
        };

        /**
         * 调整收藏顺序
         * @param fromIndex 原位置
         * @param toIndex 目标位置
         */
        const reorderFavorite = (fromIndex: number, toIndex: number): void => {
            if (fromIndex < 0 || fromIndex >= favoriteMenus.value.length || toIndex < 0 || toIndex >= favoriteMenus.value.length) {
                return;
            }

            const [item] = favoriteMenus.value.splice(fromIndex, 1);
            favoriteMenus.value.splice(toIndex, 0, item);
        };

        /**
         * 批量添加收藏（用于初始化或导入）
         * @param menus 菜单项列表
         */
        const batchAddFavorites = (menus: FavoriteMenuItem[]): void => {
            favoriteMenus.value = menus.slice(0, MAX_FAVORITES);
        };

        return {
            // 状态
            favoriteMenus,
            MAX_FAVORITES,

            // 计算属性
            favoriteIds,
            isFull,
            count,

            // 方法
            isFavorite,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            clearFavorites,
            reorderFavorite,
            batchAddFavorites
        };
    },
    {
        // 持久化配置
        persist: {
            key: 'app-favorites',
            storage: localStorage
        }
    }
);

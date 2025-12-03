import { ref } from 'vue';

/**
 * 全局悬浮菜单状态管理
 * 确保同一时间只有一个悬浮菜单显示
 */
const activeFloatingMenuId = ref<string | null>(null);
const floatingMenuInstances = ref<Map<string, { hide: () => void }>>(new Map());

export function useFloatingMenu(menuId: string) {
    const isActive = ref(false);

    /**
     * 显示当前悬浮菜单
     */
    const show = () => {
        // 如果有其他菜单正在显示，先隐藏它
        if (activeFloatingMenuId.value && activeFloatingMenuId.value !== menuId) {
            const activeInstance = floatingMenuInstances.value.get(activeFloatingMenuId.value);
            if (activeInstance) {
                activeInstance.hide();
            }
        }

        // 设置当前菜单为活跃状态
        activeFloatingMenuId.value = menuId;
        isActive.value = true;
    };

    /**
     * 隐藏当前悬浮菜单
     */
    const hide = () => {
        if (activeFloatingMenuId.value === menuId) {
            activeFloatingMenuId.value = null;
        }
        isActive.value = false;
    };

    /**
     * 注册菜单实例
     */
    const register = () => {
        floatingMenuInstances.value.set(menuId, { hide });
    };

    /**
     * 注销菜单实例
     */
    const unregister = () => {
        floatingMenuInstances.value.delete(menuId);
        if (activeFloatingMenuId.value === menuId) {
            activeFloatingMenuId.value = null;
        }
    };

    /**
     * 隐藏所有悬浮菜单
     */
    const hideAll = () => {
        floatingMenuInstances.value.forEach((instance) => {
            instance.hide();
        });
        activeFloatingMenuId.value = null;
    };

    return {
        isActive,
        show,
        hide,
        register,
        unregister,
        hideAll
    };
}

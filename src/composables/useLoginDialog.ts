import { ref } from 'vue';

/**
 * 全局登录弹窗状态管理
 */
const isLoginDialogVisible = ref(false);

/**
 * 登录弹窗管理 Hook
 */
export function useLoginDialog() {
    /**
     * 显示登录弹窗
     */
    const showLoginDialog = () => {
        isLoginDialogVisible.value = true;
    };

    /**
     * 隐藏登录弹窗
     */
    const hideLoginDialog = () => {
        isLoginDialogVisible.value = false;
    };

    /**
     * 切换登录弹窗显示状态
     */
    const toggleLoginDialog = () => {
        isLoginDialogVisible.value = !isLoginDialogVisible.value;
    };

    return {
        isLoginDialogVisible,
        showLoginDialog,
        hideLoginDialog,
        toggleLoginDialog
    };
}

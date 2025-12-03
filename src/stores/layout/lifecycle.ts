import { nextTick } from 'vue';
import type { MenuItem } from '@/types/layout';

/**
 * 生命周期管理
 */
export function useLifecycle(layoutConfig: any, layoutState: any, currentBreakpoint: any, handleResize: () => void) {
    // 定时器引用
    let resizeTimer: NodeJS.Timeout | null = null;
    /**
     * 初始化布局系统
     */
    const initLayout = async (): Promise<void> => {
        // 添加窗口大小变化监听器（使用 passive 选项优化性能）
        window.addEventListener('resize', handleResize, { passive: true });

        // 初始化窗口尺寸
        // window.innerWidth 在 handleResize 中处理

        // 等待 DOM 更新
        await nextTick();

        // 触发主题配置更新事件
        dispatchLayoutConfigEvent();

        // 添加页面可见性变化监听（优化性能）
        document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    };

    /**
     * 销毁布局监听器和清理资源
     */
    const destroyLayout = (): void => {
        // 移除事件监听器
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);

        // 清理定时器
        if (resizeTimer) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
        }
    };

    /**
     * 触发布局配置变更事件
     */
    const dispatchLayoutConfigEvent = (): void => {
        const event = new CustomEvent('layout-config-changed', {
            detail: {
                primary: layoutConfig.value.primary,
                surface: layoutConfig.value.surface,
                darkTheme: layoutConfig.value.darkTheme,
                breakpoint: currentBreakpoint.value
            }
        });
        window.dispatchEvent(event);
    };

    /**
     * 处理页面可见性变化（性能优化）
     */
    const handleVisibilityChange = (): void => {
        if (document.visibilityState === 'visible') {
            // 页面重新可见时，重新检查窗口尺寸
            const currentWidth = window.innerWidth;
            if (Math.abs(currentWidth - window.innerWidth) > 50) {
                handleResize();
            }
        }
    };

    /**
     * 设置激活的菜单项
     * @param item - 菜单项
     */
    const setActiveMenuItem = (item: MenuItem): void => {
        layoutState.value.activeMenuItem = item.value || item;
    };

    return {
        // 方法
        initLayout,
        destroyLayout,
        dispatchLayoutConfigEvent,
        handleVisibilityChange,
        setActiveMenuItem
    };
}

import { ref, watch } from 'vue'

/**
 * 主题状态管理
 */
export function useTheme(layoutConfig: any) {
  // ==================== 主题状态变量 ====================

  /** 是否为暗色主题 */
  const isDarkTheme = ref<boolean>(false);

  /** 获取主色调 */
  const getPrimary = ref<string>('emerald');

  /** 获取表面颜色 */
  const getSurface = ref<string | null>(null);

  /**
   * 更新主题状态
   */
  const updateThemeStates = (): void => {
    isDarkTheme.value = layoutConfig.value.darkTheme;
    getPrimary.value = layoutConfig.value.primary;
    getSurface.value = layoutConfig.value.surface;
  };

  // 监听布局配置变化，更新主题状态
  watch(() => [layoutConfig.value.darkTheme, layoutConfig.value.primary, layoutConfig.value.surface], () => {
    updateThemeStates();
  }, { immediate: true, deep: true });

  /**
   * 设置主色调
   */
  const setPrimary = (primary: string) => {
    layoutConfig.value.primary = primary;
  };

  /**
   * 设置表面颜色
   */
  const setSurface = (surface: string) => {
    layoutConfig.value.surface = surface;
  };

  /**
   * 执行暗色模式切换
   */
  const executeDarkModeToggle = (): void => {
    layoutConfig.value.darkTheme = !layoutConfig.value.darkTheme;
    document.documentElement.classList.toggle('app-dark');
  };

  /**
   * @description 切换暗色模式
   * @param event - 鼠标事件（用于动画效果）
   */
  const toggleDarkMode = (event?: MouseEvent): void => {
    // 检查浏览器是否支持 View Transition API
    if (!document.startViewTransition) {
      executeDarkModeToggle();
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 设置CSS变量
    document.documentElement.style.setProperty('--x', x + 'px');
    document.documentElement.style.setProperty('--y', y + 'px');
    document.documentElement.style.setProperty('--r', endRadius + 'px');
    document.startViewTransition(() => executeDarkModeToggle());
  };

  return {
    // 基础状态
    isDarkTheme,
    getPrimary,
    getSurface,
    
    // 方法
    updateThemeStates,
    setPrimary,
    setSurface,
    executeDarkModeToggle,
    toggleDarkMode
  }
}
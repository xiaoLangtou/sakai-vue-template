import { onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { toastEventBus, type ToastEvent } from '../services/core/toast';

/**
 * 全局 Toast 组合式函数
 * 在 Vue 组件中使用，监听 Toast 事件并显示消息
 */
export function useGlobalToast() {
  const toast = useToast();
  let unsubscribe: (() => void) | null = null;

  /**
   * 处理 Toast 事件
   */
  const handleToastEvent = (event: ToastEvent) => {
    toast.add({
      severity: event.severity,
      summary: event.summary,
      detail: event.detail,
      life: event.life ?? 3000,
      group: event.group,
      closable: event.closable ?? true,
      styleClass: event.styleClass,
    });
  };

  // 组件挂载时开始监听
  onMounted(() => {
    if (!unsubscribe) {
      unsubscribe = toastEventBus.on(handleToastEvent);
    }
  });

  // 组件卸载时停止监听
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });

  return {
    toast, // 暴露原始的 toast 实例，用于高级用法
  };
}
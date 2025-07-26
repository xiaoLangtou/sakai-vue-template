import { ref } from 'vue';

/**
 * 防抖Hook
 * @param delay 延迟时间，默认300ms
 */
export function useDebounce(delay: number = 300) {
  const timer = ref<NodeJS.Timeout | null>(null);

  /**
   * 防抖函数
   * @param fn 要执行的函数
   * @param customDelay 自定义延迟时间
   */
  const debounce = (fn: Function, customDelay?: number) => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    
    timer.value = setTimeout(() => {
      fn();
      timer.value = null;
    }, customDelay || delay);
  };

  /**
   * 取消防抖
   */
  const cancel = () => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
  };

  /**
   * 立即执行
   * @param fn 要执行的函数
   */
  const immediate = (fn: Function) => {
    cancel();
    fn();
  };

  return {
    debounce,
    cancel,
    immediate
  };
}
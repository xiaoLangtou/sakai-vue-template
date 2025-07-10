import { ref, onMounted, onUnmounted } from 'vue'

export function useLayout() {
  const isCollapsed = ref(false)
  const isMobile = ref(false)

  // 检查是否为移动设备
  function checkMobile() {
    isMobile.value = window.innerWidth <= 768
    if (isMobile.value) {
      isCollapsed.value = true
    }
  }

  // 切换侧边栏
  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
  }

  // 监听窗口大小变化
  function handleResize() {
    checkMobile()
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    isCollapsed,
    isMobile,
    toggleSidebar
  }
}

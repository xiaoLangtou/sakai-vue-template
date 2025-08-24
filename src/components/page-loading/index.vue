<template>
    <Transition name="fade">
        <div
v-if="pageLoadingStore.isLoading"
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <div class="flex flex-col items-center space-y-4">
                <!-- 加载动画 -->
                <div class="relative">
                    <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
                    <div class="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-primary/30"></div>
                </div>

                <!-- 加载文本 -->
                <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ pageLoadingStore.loadingText }}
                </p>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { usePageLoadingStore } from '@/stores';

/** 页面加载状态管理 */
const pageLoadingStore = usePageLoadingStore();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

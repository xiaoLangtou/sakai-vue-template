<template>
    <div class="page-container">
        <!-- 头部区域 -->
        <div v-if="$slots.header" class="page-header">
            <slot name="header"></slot>
        </div>

        <!-- 主内容区域 -->
        <div class="page-content" :class="contentClasses">
            <slot></slot>
        </div>

        <!-- 底部区域（可选） -->
        <div v-if="$slots.footer" class="page-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * 页面容器组件
 * 提供统一的页面布局结构，包含头部、内容和底部区域
 */
defineOptions({
    name: 'PageContainer'
});

interface PageContainerProps {
    /** 内容区域内边距 */
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<PageContainerProps>(), {
    padding: 'md'
});

/**
 * 计算内容区域的 class
 */
const contentClasses = computed(() => {
    const paddingMap = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8'
    };
    return paddingMap[props.padding];
});
</script>

<style lang="scss" scoped>
.page-container {
    @apply flex flex-col w-full min-h-full gap-4 pb-4;
}

.page-header {
    @apply flex-shrink-0;
}

.page-content {
    @apply flex-1 bg-white rounded-lg shadow-sm overflow-auto;

    // 自定义滚动条
    &::-webkit-scrollbar {
        @apply w-1.5 h-1.5;
    }

    &::-webkit-scrollbar-track {
        @apply bg-transparent;
    }

    &::-webkit-scrollbar-thumb {
        @apply bg-gray-300 rounded-full hover:bg-gray-400;
    }
}

.page-footer {
    @apply flex-shrink-0;
}

// 响应式优化
@media (max-width: 768px) {
    .page-container {
        @apply gap-3 pb-3;
    }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
    .page-content {
        @apply bg-gray-800 shadow-md;

        &::-webkit-scrollbar-thumb {
            @apply bg-gray-600 hover:bg-gray-500;
        }
    }
}
</style>

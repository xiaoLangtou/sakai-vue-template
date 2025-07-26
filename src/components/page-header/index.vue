<template>
  <header class="bg-white">
    <!-- 面包屑区域 -->
    <div v-if="$slots.breadcrumb" class="mb-2">
      <slot name="breadcrumb" />
    </div>

    <!-- 主要内容区域 -->
    <div class="flex items-center justify-between">
      <!-- 左侧：返回按钮 + 标题 + 描述 -->
      <div class="flex items-center space-x-3">
        <!-- 返回按钮 -->
        <Button
          v-if="showBackButton"
          :icon="backIcon"
          severity="secondary"
          text
          rounded
          @click="handleBack"
          class="p-2 hover:bg-gray-100 transition-colors"
          :aria-label="backAriaLabel"
        />

        <!-- 自定义图标插槽 -->
        <div v-if="$slots.icon" class="flex items-center">
          <slot name="icon" />
        </div>

        <Divider layout="vertical" v-if="showBackButton" />

        <!-- 标题和描述 -->
        <div class="flex flex-col">
          <div class="flex items-center space-x-2">
            <h1
              class="text-xl font-semibold text-gray-900 truncate mb-0"
              :class="titleClass"
            >
              <slot name="title">{{ title }}</slot>
            </h1>

            <!-- 状态标签 -->
            <slot name="status" />
          </div>

          <p
            v-if="description || $slots.description"
            class="text-sm text-gray-600 mt-1"
            :class="descriptionClass"
          >
            <slot name="description">{{ description }}</slot>
          </p>
        </div>
      </div>

      <!-- 右侧：操作按钮 -->
      <div v-if="$slots.actions" class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- 扩展内容区域 -->
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

// 定义接口
interface PageHeaderProps {
  title?: string
  description?: string
  showBackButton?: boolean
  backIcon?: string
  backAriaLabel?: string
  titleClass?: string
  descriptionClass?: string
}

interface PageHeaderEmits {
  back: []
}

// Props
const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: '',
  description: '',
  showBackButton: true,
  backIcon: 'pi pi-arrow-left',
  backAriaLabel: '返回',
  titleClass: '',
  descriptionClass: ''
})

// Emits
const emit = defineEmits<PageHeaderEmits>()

// 处理返回事件
const handleBack = () => {
  emit('back')
}
</script>

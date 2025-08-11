<script setup lang="ts">
import { ref } from 'vue';
import { GlobalSearch } from '@/components';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { PageContainer } from '@/components';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'page' | 'menu' | 'user' | 'document' | 'setting';
  path?: string;
  icon?: string;
  category?: string;
}

const showSearch = ref(false);
const searchLog = ref<string[]>([]);
const selectedResults = ref<SearchResult[]>([]);

/**
 * 处理搜索事件
 */
const handleSearch = (query: string) => {
  const timestamp = new Date().toLocaleTimeString();
  searchLog.value.unshift(`[${timestamp}] 搜索: "${query}"`);
  
  // 限制日志数量
  if (searchLog.value.length > 10) {
    searchLog.value = searchLog.value.slice(0, 10);
  }
};

/**
 * 处理选择结果事件
 */
const handleSelect = (result: SearchResult) => {
  const timestamp = new Date().toLocaleTimeString();
  searchLog.value.unshift(`[${timestamp}] 选择: "${result.title}" (${result.type})`);
  selectedResults.value.unshift(result);
  
  // 限制结果数量
  if (selectedResults.value.length > 5) {
    selectedResults.value = selectedResults.value.slice(0, 5);
  }
  
  // 限制日志数量
  if (searchLog.value.length > 10) {
    searchLog.value = searchLog.value.slice(0, 10);
  }
};

/**
 * 清空日志
 */
const clearLog = () => {
  searchLog.value = [];
  selectedResults.value = [];
};

/**
 * 监听快捷键
 */
const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    showSearch.value = true;
  }
};

// 添加键盘事件监听
document.addEventListener('keydown', handleKeydown);

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <PageContainer>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            全局搜索组件演示
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            演示 GlobalSearch 组件的功能和使用方法
          </p>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 功能演示区域 -->
      <div class="space-y-6">
        <!-- 基础使用 -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-search text-primary"></i>
              基础使用
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <p class="text-surface-600 dark:text-surface-400 text-sm">
                点击按钮打开全局搜索弹窗，体验搜索功能。
              </p>
              
              <div class="flex gap-3">
                <Button 
                  label="打开搜索" 
                  icon="pi pi-search" 
                  @click="showSearch = true"
                />
                <Button 
                  label="清空日志" 
                  icon="pi pi-trash" 
                  severity="secondary" 
                  outlined
                  @click="clearLog"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- 快捷键说明 -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-keyboard text-primary"></i>
              快捷键支持
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span class="text-sm font-medium">打开搜索</span>
                <div class="flex gap-1">
                  <kbd class="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded">Ctrl</kbd>
                  <span class="text-surface-400">+</span>
                  <kbd class="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded">K</kbd>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span class="text-sm font-medium">选择结果</span>
                <div class="flex gap-1">
                  <kbd class="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded">↑</kbd>
                  <kbd class="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded">↓</kbd>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span class="text-sm font-medium">确认选择</span>
                <kbd class="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded">Enter</kbd>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span class="text-sm font-medium">关闭弹窗</span>
                <kbd class="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded">Esc</kbd>
              </div>
            </div>
          </template>
        </Card>

        <!-- 功能特性 -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-star text-primary"></i>
              功能特性
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">智能模糊搜索</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">搜索历史记录</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">热门搜索建议</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">分类图标标识</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">键盘导航支持</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">防抖搜索优化</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">响应式设计</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-sm">深色模式适配</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- 日志和结果区域 -->
      <div class="space-y-6">
        <!-- 搜索日志 -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-list text-primary"></i>
              搜索日志
            </div>
          </template>
          <template #content>
            <div class="space-y-2">
              <div v-if="searchLog.length === 0" class="text-center py-8 text-surface-500">
                <i class="pi pi-info-circle text-2xl mb-2"></i>
                <p class="text-sm">暂无搜索记录</p>
              </div>
              
              <div 
                v-for="(log, index) in searchLog" 
                :key="index"
                class="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg text-sm font-mono"
              >
                {{ log }}
              </div>
            </div>
          </template>
        </Card>

        <!-- 选择结果 -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-bookmark text-primary"></i>
              最近选择
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div v-if="selectedResults.length === 0" class="text-center py-8 text-surface-500">
                <i class="pi pi-bookmark text-2xl mb-2"></i>
                <p class="text-sm">暂无选择记录</p>
              </div>
              
              <div 
                v-for="result in selectedResults" 
                :key="result.id"
                class="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg"
              >
                <div class="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <i class="pi pi-file text-primary text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">{{ result.title }}</div>
                  <div class="text-xs text-surface-500 truncate">{{ result.description }}</div>
                </div>
                <Tag 
                  :value="result.type" 
                  size="small" 
                  severity="info"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- 使用说明 -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-question-circle text-primary"></i>
              使用说明
            </div>
          </template>
          <template #content>
            <div class="space-y-3 text-sm text-surface-600 dark:text-surface-400">
              <p>1. 点击"打开搜索"按钮或使用 <kbd class="px-1 py-0.5 bg-surface-200 dark:bg-surface-700 rounded text-xs">Ctrl+K</kbd> 快捷键打开搜索弹窗</p>
              <p>2. 在搜索框中输入关键词，系统会自动进行模糊搜索</p>
              <p>3. 使用方向键选择搜索结果，按回车键确认选择</p>
              <p>4. 搜索历史会自动保存，方便快速重复搜索</p>
              <p>5. 支持按分类筛选搜索结果，提升搜索效率</p>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 全局搜索组件 -->
    <GlobalSearch 
      v-model:visible="showSearch"
      placeholder="搜索页面、菜单、用户、设置..."
      :max-history="15"
      @search="handleSearch"
      @select="handleSelect"
    />
  </PageContainer>
</template>

<style lang="scss" scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}
</style>
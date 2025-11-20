<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounce } from '@/composables/useDebounce.ts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ScrollPanel from 'primevue/scrollpanel';

import { Search, FileText, Users, Settings, Hash } from 'lucide-vue-next';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'page' | 'menu' | 'user' | 'document' | 'setting';
  path?: string;
  icon?: string;
  category?: string;
}

interface SearchCategory {
  key: string;
  label: string;
  icon: any;
  color: string;
}

interface Props {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 搜索占位符 */
  placeholder?: string;
  /** 最大搜索历史数量 */
  maxHistory?: number;
}

interface Emits {
  /** 更新显示状态 */
  (e: 'update:visible', value: boolean): void;
  /** 搜索事件 */
  (e: 'search', query: string): void;
  /** 选择结果事件 */
  (e: 'select', result: SearchResult): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type a command or search...',
  maxHistory: 10
});

const emit = defineEmits<Emits>();
const router = useRouter();

// 响应式数据
const searchQuery = ref('');
const searchResults = ref<SearchResult[]>([]);
const searchHistory = ref<string[]>([]);
const loading = ref(false);
const selectedIndex = ref(-1);
const inputRef = ref<HTMLInputElement>();

// 防抖搜索
const { debounce } = useDebounce(300);

// 搜索分类配置
const searchCategories: SearchCategory[] = [
  { key: 'page', label: '页面', icon: FileText, color: 'info' },
  { key: 'menu', label: '菜单', icon: Hash, color: 'success' },
  { key: 'user', label: '用户', icon: Users, color: 'warning' },
  { key: 'setting', label: '设置', icon: Settings, color: 'danger' }
];

// 计算属性
const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0);
const hasResults = computed(() => searchResults.value.length > 0);


// 模拟搜索数据
const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: '用户管理',
    description: '管理系统用户信息',
    type: 'page',
    path: '/admin/user',
    category: '系统管理'
  },
  {
    id: '2',
    title: '角色管理',
    description: '配置用户角色和权限',
    type: 'page',
    path: '/admin/role',
    category: '系统管理'
  },
  {
    id: '3',
    title: '菜单管理',
    description: '配置系统菜单结构',
    type: 'menu',
    path: '/admin/menu',
    category: '系统管理'
  },
  {
    id: '4',
    title: '数据字典',
    description: '管理系统字典数据',
    type: 'setting',
    path: '/system/dict',
    category: '系统设置'
  },
  {
    id: '5',
    title: '个人资料',
    description: '查看和编辑个人信息',
    type: 'user',
    path: '/profile',
    category: '个人中心'
  }
];

/**
 * 获取分类配置
 */
const getCategoryConfig = (type: string) => {
  return searchCategories.find(cat => cat.key === type) || searchCategories[0];
};

/**
 * 获取分类图标组件
 */
const getCategoryIcon = (type: string) => {
  const config = getCategoryConfig(type);
  return config.icon;
};

/**
 * 执行搜索
 */
const performSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  loading.value = true;
  selectedIndex.value = -1;

  try {
    // 模拟API搜索
    await new Promise(resolve => setTimeout(resolve, 200));

    const results = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.value = results;
    emit('search', query);
  } catch (error) {
    console.error('搜索失败:', error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * 处理搜索输入
 */
const handleSearchInput = () => {
  debounce(() => performSearch(searchQuery.value));
};

/**
 * 选择搜索结果
 */
const selectResult = (result: SearchResult) => {
  // 添加到搜索历史
  addToHistory(result.title);

  // 导航到目标页面
  if (result.path) {
    router.push(result.path);
  }

  emit('select', result);
  closeDialog();
};





/**
 * 添加到搜索历史
 */
const addToHistory = (query: string) => {
  if (!query.trim()) return;

  // 移除重复项
  const filtered = searchHistory.value.filter(item => item !== query);
  // 添加到开头
  filtered.unshift(query);
  // 限制数量
  searchHistory.value = filtered.slice(0, props.maxHistory);

  // 保存到本地存储
  localStorage.setItem('global-search-history', JSON.stringify(searchHistory.value));
};



/**
 * 选择菜单项
 */
const selectMenuItem = (item: { title: string; path: string; icon: string }) => {
  console.log('Selected menu item:', item);
  // 这里可以添加路由跳转逻辑
  // router.push(item.path)
  closeDialog();
};

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  emit('update:visible', false);
};

/**
 * 重置搜索状态
 */
const resetSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  selectedIndex.value = -1;
  loading.value = false;
};

/**
 * 处理键盘事件
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.visible) return;

  const resultCount = searchResults.value.length;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = selectedIndex.value < resultCount - 1 ? selectedIndex.value + 1 : 0;
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : resultCount - 1;
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0 && searchResults.value[selectedIndex.value]) {
        selectResult(searchResults.value[selectedIndex.value]);
      } else if (searchQuery.value.trim()) {
        addToHistory(searchQuery.value);
      }
      break;
    case 'Escape':
      event.preventDefault();
      closeDialog();
      break;
  }
};

// 监听弹窗显示状态
watch(
  () => props.visible,
  async (newVisible) => {
    if (newVisible) {
      // 弹窗打开时聚焦输入框
      await nextTick();
      inputRef.value?.focus();
    } else {
      // 弹窗关闭时重置状态
      resetSearch();
    }
  }
);

// 组件挂载时加载搜索历史
onMounted(() => {
  try {
    const saved = localStorage.getItem('global-search-history');
    if (saved) {
      searchHistory.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error);
  }

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="undefined"
    :style="{ width: '640px', maxWidth: '90vw' }"
    :closable="false"
    :draggable="false"
    class="global-search-dialog"
    @hide="closeDialog"
  >
    <div class="global-search-container">
      <!-- 搜索框 -->
      <div class="search-input-section">
        <div class="search-input-wrapper">
          <Search class="search-icon" :size="18" />
          <InputText
            ref="inputRef"
            v-model="searchQuery"
            :placeholder="placeholder"
            class="search-input"
            @input="handleSearchInput"
            @keydown.enter.prevent
          />
          <div class="search-shortcuts">
            <kbd v-if="!hasSearchQuery" class="shortcut-key">⌘K</kbd>
            <Button
              v-if="hasSearchQuery"
              icon="pi pi-times"
              class="clear-btn"
              text
              rounded
              size="small"
              @click="resetSearch"
            />
          </div>
        </div>
      </div>

      <!-- 搜索内容区域 -->
      <div class="search-content">
        <ScrollPanel class="search-scroll" style="width: 100%; height: 400px">
          <!-- 搜索结果 -->
          <div v-if="hasSearchQuery" class="search-results">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-section">
              <div class="flex items-center justify-center py-8">
                <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
                <span class="ml-2 text-surface-600">搜索中...</span>
              </div>
            </div>

            <!-- 搜索结果列表 -->
            <div v-else-if="hasResults" class="results-list">
              <div
                v-for="(result, index) in searchResults"
                :key="result.id"
                class="result-item"
                :class="{ 'selected': index === selectedIndex }"
                @click="selectResult(result)"
                @mouseenter="selectedIndex = index"
              >
                <div class="result-icon">
                  <component :is="getCategoryIcon(result.type)" :size="16" />
                </div>
                <div class="result-content">
                  <div class="result-title">{{ result.title }}</div>
                  <div v-if="result.description" class="result-description">
                    {{ result.description }}
                  </div>
                </div>
                <div class="result-meta">
                  <span class="result-category">{{ result.category }}</span>
                  <kbd class="result-shortcut">↵</kbd>
                </div>
              </div>
            </div>

            <!-- 无结果 -->
            <div v-else class="no-results">
              <div class="flex flex-col items-center justify-center py-8">
                <Search class="text-surface-400 mb-3" :size="48" />
                <div class="text-surface-600 text-lg font-medium mb-2">未找到相关结果</div>
                <div class="text-surface-500 text-sm">尝试使用其他关键词搜索</div>
              </div>
            </div>
          </div>

          <!-- 默认内容（分组菜单） -->
          <div v-else class="default-content">
            <!-- Go to 分组 -->
            <div class="menu-section">
              <div class="section-title">Go to</div>
              <div class="menu-list">
                <div class="menu-item" @click="selectMenuItem({ title: 'Home', path: '/dashboard', icon: 'pi pi-home' })">
                  <i class="pi pi-home menu-icon"></i>
                  <span class="menu-text">Home</span>
                </div>
                <div class="menu-item" @click="selectMenuItem({ title: 'Inbox', path: '/inbox', icon: 'pi pi-inbox' })">
                  <i class="pi pi-inbox menu-icon"></i>
                  <span class="menu-text">Inbox</span>
                </div>
                <div class="menu-item" @click="selectMenuItem({ title: 'Customers', path: '/customers', icon: 'pi pi-users' })">
                  <i class="pi pi-users menu-icon"></i>
                  <span class="menu-text">Customers</span>
                </div>
                <div class="menu-item" @click="selectMenuItem({ title: 'Settings', path: '/settings', icon: 'pi pi-cog' })">
                  <i class="pi pi-cog menu-icon"></i>
                  <span class="menu-text">Settings</span>
                  <i class="pi pi-chevron-right menu-arrow"></i>
                </div>
                <div class="menu-item" @click="selectMenuItem({ title: 'Feedback', path: '/feedback', icon: 'pi pi-comment' })">
                  <i class="pi pi-comment menu-icon"></i>
                  <span class="menu-text">Feedback</span>
                </div>
                <div class="menu-item" @click="selectMenuItem({ title: 'Help & Support', path: '/help', icon: 'pi pi-question-circle' })">
                  <i class="pi pi-question-circle menu-icon"></i>
                  <span class="menu-text">Help & Support</span>
                </div>
              </div>
            </div>

            <!-- Code 分组 -->
            <div class="menu-section">
              <div class="section-title">Code</div>
              <div class="menu-list">
                <div class="menu-item" @click="selectMenuItem({ title: 'View page source', path: '/source', icon: 'pi pi-github' })">
                  <i class="pi pi-github menu-icon"></i>
                  <span class="menu-text">View page source</span>
                </div>
              </div>
            </div>

            <!-- Theme 分组 -->
            <div class="menu-section">
              <div class="section-title">Theme</div>
              <div class="menu-list">
                <div class="menu-item" @click="selectMenuItem({ title: 'System', path: '/theme/system', icon: 'pi pi-desktop' })">
                  <i class="pi pi-desktop menu-icon"></i>
                  <span class="menu-text">System</span>
                </div>
                <div class="menu-item" @click="selectMenuItem({ title: 'Light', path: '/theme/light', icon: 'pi pi-sun' })">
                  <i class="pi pi-sun menu-icon"></i>
                  <span class="menu-text">Light</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </div>

      <!-- 底部提示 -->
      <div v-if="hasResults || hasSearchQuery" class="search-footer">
        <div class="keyboard-hints">
          <span class="hint-item">
            <kbd>↑↓</kbd> 导航
          </span>
          <span class="hint-item">
            <kbd>↵</kbd> 选择
          </span>
          <span class="hint-item">
            <kbd>esc</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.global-search-dialog {
  :deep(.p-dialog) {
    border-radius: 8px;
    box-shadow: 0 16px 70px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--p-surface-border);
  }

  :deep(.p-dialog-content) {
    padding: 0;
    border-radius: 8px;
    background: var(--p-surface-0);
  }
}

.global-search-container {
  display: flex;
  flex-direction: column;
  height: 480px;
  background: var(--p-surface-0);
}

.search-input-section {
  padding: 12px;
  border-bottom: 1px solid var(--p-surface-border);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--p-surface-500);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding-left: 40px !important;
  padding-right: 80px !important;
  border: none !important;
  background: var(--p-surface-50) !important;
  border-radius: 6px;
  font-size: 14px;
  height: 40px;

  &:focus {
    background: var(--p-surface-0) !important;
    box-shadow: 0 0 0 1px var(--p-primary-color) !important;
  }

  &::placeholder {
    color: var(--p-surface-500);
    font-size: 14px;
  }
}

.search-shortcuts {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.shortcut-key {
  padding: 2px 6px;
  background: var(--p-surface-100);
  border: 1px solid var(--p-surface-200);
  border-radius: 3px;
  font-size: 11px;
  color: var(--p-surface-600);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
}

.clear-btn {
  z-index: 1;
}

.search-content {
  flex: 1;
  overflow: hidden;
}

.search-scroll {
  :deep(.p-scrollpanel-content) {
    padding: 0;
  }
}

.search-results {
  padding: 4px 0;
}

.results-list {
  padding: 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-left: 2px solid transparent;

  &:hover {
    background-color: var(--p-surface-50);
  }

  &.selected {
    background-color: var(--p-primary-50);
    border-left-color: var(--p-primary-color);
  }
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: var(--p-surface-100);
  color: var(--p-surface-600);
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 500;
  color: var(--p-surface-900);
  margin-bottom: 2px;
  font-size: 14px;
  line-height: 1.3;
}

.result-description {
  font-size: 12px;
  color: var(--p-surface-500);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.result-category {
  font-size: 11px;
  color: var(--p-surface-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-shortcut {
  padding: 2px 4px;
  background: var(--p-surface-100);
  border: 1px solid var(--p-surface-200);
  border-radius: 3px;
  font-size: 10px;
  color: var(--p-surface-500);
  font-family: monospace;
  opacity: 0;
  transition: opacity 0.15s ease;

  .result-item.selected & {
    opacity: 1;
  }
}

.default-content {
  padding: 8px;
}

.menu-section {
  margin-bottom: 16px;
}

.menu-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--p-surface-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px 4px 12px;
  margin-bottom: 4px;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  position: relative;
}

.menu-item:hover {
  background-color: var(--p-surface-50);
}

.menu-icon {
  width: 16px;
  height: 16px;
  color: var(--p-surface-500);
  margin-right: 12px;
  flex-shrink: 0;
}

.menu-text {
  font-size: 14px;
  color: var(--p-surface-700);
  flex: 1;
}

.menu-arrow {
  width: 12px;
  height: 12px;
  color: var(--p-surface-400);
  margin-left: auto;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.clear-history-btn {
  color: var(--p-surface-400);
  font-size: 12px;
  padding: 4px 8px;

  &:hover {
    color: var(--p-surface-600);
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--p-surface-50);
  }
}

.history-icon {
  color: var(--p-surface-400);
  flex-shrink: 0;
}

.history-text {
  color: var(--p-surface-700);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.hot-tag {
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  padding: 4px 8px;

  &:hover {
    background-color: var(--p-surface-100);
    transform: translateY(-1px);
  }
}

.search-footer {
  padding: 8px 16px;
  border-top: 1px solid var(--p-surface-border);
  background-color: var(--p-surface-25);
}

.keyboard-hints {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--p-surface-500);

  kbd {
    padding: 1px 4px;
    background-color: var(--p-surface-100);
    border: 1px solid var(--p-surface-200);
    border-radius: 3px;
    font-size: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
    color: var(--p-surface-600);
    min-width: 16px;
    text-align: center;
  }
}

.loading-section,
.no-results {
  padding: 32px 16px;
  text-align: center;
}

.no-results {
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .mb-3 {
    margin-bottom: 0.75rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .font-medium {
    font-weight: 500;
  }
}


</style>

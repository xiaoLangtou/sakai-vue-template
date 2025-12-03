# 工具组件使用文档

本文档包含项目中实用工具组件的详细使用说明，包括标签页管理、页面加载、搜索状态等组件。

## 目录

- [AppTabs 应用标签页组件](#apptabs-应用标签页组件)
- [PageLoading 页面加载组件](#pageloading-页面加载组件)
- [SearchStatus 搜索状态组件](#searchstatus-搜索状态组件)
- [最佳实践](#最佳实践)

---

## AppTabs 应用标签页组件

### 组件描述

`AppTabs` 是一个功能完整的标签页管理组件，支持多种样式、右键菜单、滚动导航、拖拽排序等功能。适用于多页面应用的标签页管理。

### 基础使用

```vue
<template>
    <AppTabs :show-icon="true" :show-close="true" tab-style="Square" :enable-context-menu="true" />
</template>

<script setup>
import { AppTabs } from '@/components';
</script>
```

### 高级使用

```vue
<template>
    <div class="app-layout">
        <!-- 自定义样式的标签页 -->
        <AppTabs :show-icon="showTabIcons" :show-close="allowCloseTab" :tab-style="currentTabStyle" :enable-context-menu="enableRightClick" class="custom-tabs" />

        <!-- 标签页样式切换器 -->
        <div class="tab-style-switcher">
            <label>标签页样式：</label>
            <SelectButton v-model="currentTabStyle" :options="tabStyleOptions" option-label="label" option-value="value" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { AppTabs } from '@/components';
import SelectButton from 'primevue/selectbutton';

const showTabIcons = ref(true);
const allowCloseTab = ref(true);
const enableRightClick = ref(true);
const currentTabStyle = ref('Square');

const tabStyleOptions = ref([
    { label: '卡片', value: 'Card' },
    { label: '时尚', value: 'Fashion' },
    { label: '方形', value: 'Square' }
]);
</script>

<style scoped>
.custom-tabs {
    /* 自定义标签页样式 */
    border-bottom: 1px solid var(--surface-border);
}

.tab-style-switcher {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
```

### 与路由集成使用

```vue
<template>
    <div class="app-container">
        <!-- 标签页导航 -->
        <AppTabs class="app-tabs" />

        <!-- 页面内容 -->
        <div class="page-content">
            <router-view v-slot="{ Component }">
                <transition name="page-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { AppTabs } from '@/components'
import { useTabsStore } from '@/stores/tabs'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabsStore = useTabsStore()

// 监听路由变化，自动添加标签页
router.afterEach((to) => {
  if (to.meta.title) {
    tabsStore.addTab({
      key: to.path,
      title: to.meta.title as string,
      path: to.path,
      icon: to.meta.icon as string,
      closable: to.meta.closable !== false
    })
  }
})
</script>

<style scoped>
.app-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-tabs {
    flex-shrink: 0;
}

.page-content {
    flex: 1;
    overflow: hidden;
}

.page-fade-enter-active,
.page-fade-leave-active {
    transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
    opacity: 0;
}
</style>
```

### Attributes (Props)

| 参数              | 说明             | 类型    | 可选值                  | 默认值 |
| ----------------- | ---------------- | ------- | ----------------------- | ------ |
| showIcon          | 是否显示图标     | boolean | —                       | true   |
| showClose         | 是否显示关闭按钮 | boolean | —                       | true   |
| tabStyle          | 标签页样式       | string  | Card / Fashion / Square | Square |
| enableContextMenu | 是否启用右键菜单 | boolean | —                       | true   |
| class             | 自定义样式类名   | string  | —                       | ''     |

### 右键菜单功能

- **重新加载**: 刷新当前标签页内容
- **新窗口打开**: 在新窗口中打开当前页面
- **关闭当前标签页**: 关闭选中的标签页
- **关闭其他标签页**: 关闭除当前标签页外的所有标签页
- **关闭左侧标签页**: 关闭当前标签页左侧的所有标签页
- **关闭右侧标签页**: 关闭当前标签页右侧的所有标签页

### 标签页样式说明

#### Card 卡片样式

- 圆角边框设计
- 卡片阴影效果
- 适合现代化界面

#### Fashion 时尚样式

- 渐变背景效果
- 动态过渡动画
- 适合创意类应用

#### Square 方形样式

- 简洁方形设计
- 清晰边界分割
- 适合商务类应用

---

## PageLoading 页面加载组件

### 组件描述

`PageLoading` 是一个全屏页面加载指示器组件，提供优雅的加载动画和状态管理。支持自定义加载文本和动画效果。

### 基础使用

```vue
<template>
    <div>
        <!-- 页面内容 -->
        <div class="page-content">
            <h1>页面内容</h1>
            <Button label="开始加载" @click="startLoading" />
        </div>

        <!-- 页面加载组件 -->
        <PageLoading />
    </div>
</template>

<script setup>
import { PageLoading } from '@/components';
import { usePageLoadingStore } from '@/stores';

const pageLoadingStore = usePageLoadingStore();

const startLoading = () => {
    pageLoadingStore.showLoading('正在加载数据...');

    // 模拟异步操作
    setTimeout(() => {
        pageLoadingStore.hideLoading();
    }, 3000);
};
</script>
```

### 高级使用

```vue
<template>
    <div>
        <!-- 多种加载场景 -->
        <div class="loading-controls">
            <Button label="加载用户数据" @click="loadUserData" />
            <Button label="保存表单" @click="saveForm" />
            <Button label="上传文件" @click="uploadFile" />
        </div>

        <PageLoading />
    </div>
</template>

<script setup>
import { PageLoading } from '@/components';
import { usePageLoadingStore } from '@/stores';
import { useToast } from 'primevue/usetoast';

const pageLoadingStore = usePageLoadingStore();
const toast = useToast();

const loadUserData = async () => {
    try {
        pageLoadingStore.showLoading('正在加载用户数据...');

        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast.add({
            severity: 'success',
            summary: '成功',
            detail: '用户数据加载完成'
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '加载失败，请重试'
        });
    } finally {
        pageLoadingStore.hideLoading();
    }
};

const saveForm = async () => {
    try {
        pageLoadingStore.showLoading('正在保存数据...');

        // 模拟保存操作
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.add({
            severity: 'success',
            summary: '保存成功',
            detail: '数据已成功保存'
        });
    } finally {
        pageLoadingStore.hideLoading();
    }
};

const uploadFile = async () => {
    try {
        pageLoadingStore.showLoading('正在上传文件...');

        // 模拟文件上传
        await new Promise((resolve) => setTimeout(resolve, 3000));

        toast.add({
            severity: 'success',
            summary: '上传完成',
            detail: '文件上传成功'
        });
    } finally {
        pageLoadingStore.hideLoading();
    }
};
</script>
```

### 与路由守卫集成

```typescript
// router/index.ts
import { usePageLoadingStore } from '@/stores';

router.beforeEach((to, from, next) => {
    const pageLoadingStore = usePageLoadingStore();

    // 显示页面加载
    pageLoadingStore.showLoading('正在加载页面...');

    next();
});

router.afterEach(() => {
    const pageLoadingStore = usePageLoadingStore();

    // 页面加载完成后隐藏加载
    setTimeout(() => {
        pageLoadingStore.hideLoading();
    }, 500);
});
```

### Store 使用方法

```typescript
// stores/pageLoading.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePageLoadingStore = defineStore('pageLoading', () => {
    const isLoading = ref(false);
    const loadingText = ref('加载中...');

    const showLoading = (text = '加载中...') => {
        loadingText.value = text;
        isLoading.value = true;
    };

    const hideLoading = () => {
        isLoading.value = false;
    };

    return {
        isLoading,
        loadingText,
        showLoading,
        hideLoading
    };
});
```

### 自定义加载动画

```vue
<template>
    <Transition name="fade">
        <div v-if="pageLoadingStore.isLoading" class="custom-loading">
            <div class="loading-content">
                <!-- 自定义加载动画 -->
                <div class="custom-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>

                <!-- 加载文本 -->
                <p class="loading-text">
                    {{ pageLoadingStore.loadingText }}
                </p>

                <!-- 进度条（可选） -->
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.custom-loading {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
}

.loading-content {
    text-align: center;
}

.custom-spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
    animation-delay: 0.3s;
    border-top-color: var(--primary-color-text);
}

.spinner-ring:nth-child(3) {
    animation-delay: 0.6s;
    border-top-color: var(--surface-500);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.progress-bar {
    width: 200px;
    height: 4px;
    background: var(--surface-200);
    border-radius: 2px;
    overflow: hidden;
    margin: 1rem auto 0;
}

.progress-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 2px;
    animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
    0% {
        width: 0%;
        margin-left: 0%;
    }
    50% {
        width: 75%;
        margin-left: 25%;
    }
    100% {
        width: 0%;
        margin-left: 100%;
    }
}
</style>
```

---

## SearchStatus 搜索状态组件

### 组件描述

`SearchStatus` 是一个搜索状态显示组件，用于展示当前的搜索条件、结果统计和筛选标签。支持条件移除和清空操作。

### 基础使用

```vue
<template>
    <div>
        <!-- 搜索组件 -->
        <ListSearch v-model="searchParams" :filter-configs="filterConfigs" @search="handleSearch" />

        <!-- 搜索状态显示 -->
        <SearchStatus :params="searchParams" :total="searchResults.total" :filter-labels="filterLabels" @clear="handleClearAll" @remove-filter="handleRemoveFilter" />

        <!-- 搜索结果 -->
        <div class="search-results">
            <p>找到 {{ searchResults.total }} 条结果</p>
            <!-- 结果列表 -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { SearchStatus, ListSearch } from '@/components';

const searchParams = ref({
    keyword: '',
    filters: {},
    pagination: { page: 1, size: 20 },
    sort: { field: '', order: 'asc' }
});

const searchResults = ref({
    data: [],
    total: 0
});

const filterLabels = ref({
    status: '状态',
    category: '分类',
    dateRange: '日期范围',
    department: '部门'
});

const filterConfigs = ref([
    {
        key: 'status',
        label: '状态',
        type: 'select',
        options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' }
        ]
    },
    {
        key: 'category',
        label: '分类',
        type: 'select',
        options: [
            { label: '技术', value: 'tech' },
            { label: '产品', value: 'product' }
        ]
    }
]);

const handleSearch = (params) => {
    console.log('执行搜索:', params);
    // 执行搜索逻辑
    searchResults.value = {
        data: [],
        total: 156
    };
};

const handleClearAll = () => {
    searchParams.value = {
        keyword: '',
        filters: {},
        pagination: { page: 1, size: 20 },
        sort: { field: '', order: 'asc' }
    };
    handleSearch(searchParams.value);
};

const handleRemoveFilter = (key) => {
    if (key === 'keyword') {
        searchParams.value.keyword = '';
    } else {
        delete searchParams.value.filters[key];
    }
    handleSearch(searchParams.value);
};
</script>
```

### 高级使用

```vue
<template>
    <div class="search-container">
        <!-- 搜索区域 -->
        <div class="search-section">
            <ListSearch v-model="searchParams" :filter-configs="filterConfigs" @search="handleSearch" />
        </div>

        <!-- 搜索状态和操作 -->
        <div class="status-section">
            <SearchStatus :params="searchParams" :total="searchResults.total" :show-pagination="true" :filter-labels="filterLabels" @clear="handleClearAll" @remove-filter="handleRemoveFilter" />

            <!-- 额外的操作按钮 -->
            <div class="status-actions">
                <Button label="导出结果" icon="pi pi-download" size="small" outlined @click="exportResults" />
                <Button label="保存搜索" icon="pi pi-bookmark" size="small" outlined @click="saveSearch" />
            </div>
        </div>

        <!-- 结果区域 -->
        <div class="results-section">
            <ConfigurableTable :data="searchResults.data" :columns="tableColumns" :loading="loading" :pagination="pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { SearchStatus, ListSearch, ConfigurableTable } from '@/components';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading = ref(false);

// 分页信息
const pagination = computed(() => ({
    page: searchParams.value.pagination.page,
    size: searchParams.value.pagination.size,
    total: searchResults.value.total
}));

const exportResults = () => {
    toast.add({
        severity: 'info',
        summary: '导出中',
        detail: '正在准备导出文件...'
    });

    // 导出逻辑
    setTimeout(() => {
        toast.add({
            severity: 'success',
            summary: '导出完成',
            detail: '文件已下载到本地'
        });
    }, 2000);
};

const saveSearch = () => {
    // 保存搜索条件逻辑
    toast.add({
        severity: 'success',
        summary: '保存成功',
        detail: '搜索条件已保存'
    });
};

const handlePageChange = (event) => {
    searchParams.value.pagination.page = event.page + 1;
    searchParams.value.pagination.size = event.rows;
    handleSearch(searchParams.value);
};
</script>

<style scoped>
.search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.status-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
}

.status-actions {
    display: flex;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .status-section {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
    }

    .status-actions {
        justify-content: center;
    }
}
</style>
```

### Attributes (Props)

| 参数           | 说明             | 类型                   | 可选值 | 默认值 |
| -------------- | ---------------- | ---------------------- | ------ | ------ |
| params         | 搜索参数对象     | SearchParams           | —      | —      |
| total          | 结果总数         | number                 | —      | 0      |
| showPagination | 是否显示分页信息 | boolean                | —      | true   |
| filterLabels   | 筛选条件标签映射 | Record<string, string> | —      | {}     |

### Events

| 事件名        | 说明                   | 回调参数      |
| ------------- | ---------------------- | ------------- |
| clear         | 清空所有搜索条件时触发 | —             |
| remove-filter | 移除单个筛选条件时触发 | (key: string) |

### 功能特性

- **条件展示**: 以标签形式展示当前搜索条件
- **结果统计**: 显示搜索结果总数和格式化
- **条件移除**: 支持单独移除某个筛选条件
- **全部清空**: 一键清空所有搜索条件
- **响应式设计**: 适配不同屏幕尺寸
- **动画效果**: 平滑的显示/隐藏动画

---

## 最佳实践

### 1. AppTabs 最佳实践

```typescript
// 标签页配置建议
const tabConfig = {
    // 限制最大标签页数量
    maxTabs: 10,

    // 默认标签页样式
    defaultStyle: 'Square',

    // 是否允许关闭首页标签
    allowCloseHome: false,

    // 标签页持久化
    persistTabs: true
};

// 路由元信息配置
const routes = [
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {
            title: '仪表盘',
            icon: 'pi pi-chart-line',
            closable: false, // 不可关闭
            keepAlive: true // 保持活跃
        }
    }
];
```

### 2. PageLoading 最佳实践

```typescript
// 加载状态管理
class LoadingManager {
    private loadingCount = 0;
    private store = usePageLoadingStore();

    show(text?: string) {
        this.loadingCount++;
        if (this.loadingCount === 1) {
            this.store.showLoading(text);
        }
    }

    hide() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        if (this.loadingCount === 0) {
            this.store.hideLoading();
        }
    }
}

// HTTP 拦截器集成
axios.interceptors.request.use((config) => {
    loadingManager.show('请求中...');
    return config;
});

axios.interceptors.response.use(
    (response) => {
        loadingManager.hide();
        return response;
    },
    (error) => {
        loadingManager.hide();
        return Promise.reject(error);
    }
);
```

### 3. SearchStatus 最佳实践

```vue
<script setup>
// 搜索状态持久化
import { useLocalStorage } from '@vueuse/core';

const searchParams = useLocalStorage('search-params', {
    keyword: '',
    filters: {},
    pagination: { page: 1, size: 20 }
});

// 搜索防抖
import { useDebounce } from '@/composables/useDebounce';

const { debounce } = useDebounce(300);

const debouncedSearch = debounce((params) => {
    performSearch(params);
});

// 搜索历史记录
const searchHistory = useLocalStorage('search-history', []);

const addToHistory = (params) => {
    if (params.keyword) {
        const history = searchHistory.value;
        const index = history.indexOf(params.keyword);

        if (index > -1) {
            history.splice(index, 1);
        }

        history.unshift(params.keyword);

        // 限制历史记录数量
        if (history.length > 10) {
            history.splice(10);
        }
    }
};
</script>
```

### 4. 组件组合使用

```vue
<template>
    <div class="app-layout">
        <!-- 标签页导航 -->
        <AppTabs class="app-tabs" />

        <!-- 页面内容区域 -->
        <div class="page-content">
            <PageContainer>
                <template #header>
                    <PageHeader :title="currentPageTitle" :description="currentPageDescription" />
                </template>

                <!-- 搜索区域 -->
                <ListSearch v-model="searchParams" :filter-configs="filterConfigs" @search="handleSearch" />

                <!-- 搜索状态 -->
                <SearchStatus :params="searchParams" :total="searchResults.total" @clear="handleClearSearch" @remove-filter="handleRemoveFilter" />

                <!-- 数据表格 -->
                <ConfigurableTable :data="searchResults.data" :columns="tableColumns" :loading="loading" />
            </PageContainer>
        </div>

        <!-- 全局加载 -->
        <PageLoading />
    </div>
</template>

<script setup>
// 完整的页面组合逻辑
import { AppTabs, PageContainer, PageHeader, ListSearch, SearchStatus, ConfigurableTable, PageLoading } from '@/components';

// 页面状态管理
const loading = ref(false);
const searchParams = ref({
    keyword: '',
    filters: {},
    pagination: { page: 1, size: 20 }
});
const searchResults = ref({ data: [], total: 0 });

// 页面信息
const currentPageTitle = computed(() => route.meta.title || '页面');
const currentPageDescription = computed(() => route.meta.description || '');

// 搜索处理
const handleSearch = async (params) => {
    loading.value = true;
    try {
        const results = await searchAPI(params);
        searchResults.value = results;
    } finally {
        loading.value = false;
    }
};
</script>
```

### 5. 性能优化建议

```typescript
// 1. 标签页懒加载
const TabComponent = defineAsyncComponent(() => import('./TabComponent.vue'));

// 2. 搜索结果虚拟滚动
const virtualScrollOptions = {
    itemSize: 50,
    buffer: 10
};

// 3. 加载状态防抖
const debouncedLoading = debounce((show: boolean, text?: string) => {
    if (show) {
        pageLoadingStore.showLoading(text);
    } else {
        pageLoadingStore.hideLoading();
    }
}, 100);

// 4. 内存清理
onUnmounted(() => {
    // 清理定时器
    clearTimeout(loadingTimer);

    // 清理事件监听
    window.removeEventListener('beforeunload', handleBeforeUnload);
});
```

这些工具组件为应用提供了完整的用户交互体验，通过合理的组合使用可以构建出功能丰富、用户友好的现代化应用界面。

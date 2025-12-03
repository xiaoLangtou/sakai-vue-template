# ListSearch 搜索组件

基于 Vue3、PrimeVue 和 TypeScript 的高可用、低耦合列表搜索解决方案。

## 特性

- 🚀 **高性能**: 内置防抖机制，优化搜索性能
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🔧 **高度可配置**: 支持多种筛选类型和自定义配置
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🎨 **美观界面**: 基于 PrimeVue 组件库的现代化 UI
- 🔄 **状态管理**: 完整的搜索状态管理和持久化
- 🧩 **低耦合**: 组件化设计，易于集成和扩展

## 组件结构

```
src/components/search/
├── components/
│   ├── ListSearch.vue      # 主搜索组件
│   ├── FilterItem.vue      # 筛选项组件
│   └── SearchStatus.vue    # 搜索状态显示组件
├── composables/
│   ├── useSearch.ts        # 搜索逻辑组合函数
│   └── useDebounce.ts      # 防抖工具函数
├── types/
│   └── search.ts           # 类型定义
├── utils/
│   └── searchHelpers.ts    # 搜索辅助工具
└── index.ts                # 统一导出
```

## 快速开始

### 1. 导入组件

```typescript
import { ListSearch } from '@/components/search';
import type { FilterConfig, SearchParams } from '@/components/search';
```

### 2. 定义筛选配置

```typescript
const filterConfigs: FilterConfig[] = [
    {
        key: 'status',
        label: '状态',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' }
        ]
    },
    {
        key: 'dateRange',
        label: '创建时间',
        type: 'daterange'
    },
    {
        key: 'category',
        label: '分类',
        type: 'multiselect',
        options: [
            { label: '技术', value: 'tech' },
            { label: '产品', value: 'product' },
            { label: '设计', value: 'design' }
        ]
    }
];
```

### 3. 使用组件

```vue
<template>
    <div>
        <ListSearch v-model:search-params="searchParams" :filter-configs="filterConfigs" :loading="loading" :total="total" placeholder="请输入搜索关键词" @search="handleSearch" @reset="handleReset" />

        <!-- 你的数据展示组件 -->
        <DataTable :value="data" :loading="loading">
            <!-- 表格列定义 -->
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ListSearch } from '@/components/search';
import type { FilterConfig, SearchParams } from '@/components/search';

const searchParams = ref<SearchParams>({
    keyword: '',
    filters: {},
    pagination: { page: 1, size: 10 },
    sorting: { field: '', order: 'asc' }
});

const loading = ref(false);
const total = ref(0);
const data = ref([]);

const handleSearch = async (params: SearchParams) => {
    loading.value = true;
    try {
        // 调用你的 API
        const result = await searchAPI(params);
        data.value = result.data;
        total.value = result.total;
    } finally {
        loading.value = false;
    }
};

const handleReset = () => {
    // 重置逻辑
    data.value = [];
    total.value = 0;
};
</script>
```

## API 文档

### ListSearch Props

| 属性          | 类型           | 默认值             | 说明                |
| ------------- | -------------- | ------------------ | ------------------- |
| searchParams  | SearchParams   | -                  | 搜索参数（v-model） |
| filterConfigs | FilterConfig[] | []                 | 筛选配置            |
| loading       | boolean        | false              | 加载状态            |
| total         | number         | 0                  | 总结果数            |
| placeholder   | string         | '请输入搜索关键词' | 搜索框占位符        |
| showAdvanced  | boolean        | true               | 是否显示高级筛选    |
| showStatus    | boolean        | true               | 是否显示搜索状态    |
| debounceMs    | number         | 300                | 防抖延迟时间        |

### ListSearch Events

| 事件          | 参数                        | 说明         |
| ------------- | --------------------------- | ------------ |
| search        | SearchParams                | 搜索事件     |
| reset         | -                           | 重置事件     |
| filter-change | { key: string, value: any } | 筛选变化事件 |

### FilterConfig 类型

```typescript
interface FilterConfig {
    key: string; // 筛选字段键
    label: string; // 显示标签
    type: FilterType; // 筛选类型
    options?: SelectOption[]; // 选项（select/multiselect 类型需要）
    placeholder?: string; // 占位符
    required?: boolean; // 是否必填
    rules?: ValidationRule[]; // 验证规则
    props?: Record<string, any>; // 额外属性
}
```

### 支持的筛选类型

- `text`: 文本输入
- `number`: 数字输入
- `select`: 单选下拉
- `multiselect`: 多选下拉
- `date`: 日期选择
- `daterange`: 日期范围
- `switch`: 开关
- `slider`: 滑块

## 高级用法

### 使用 useSearch 组合函数

```typescript
import { useSearch } from '@/components/search';

const { searchParams, loading, error, executeSearch, updateKeyword, updateFilter, updatePagination, updateSorting, reset } = useSearch({
    searchFunction: async (params) => {
        const response = await api.search(params);
        return {
            data: response.data,
            total: response.total
        };
    },
    debounceMs: 500,
    autoSearch: true
});
```

### 自定义验证规则

```typescript
const filterConfigs: FilterConfig[] = [
    {
        key: 'email',
        label: '邮箱',
        type: 'text',
        required: true,
        rules: [
            {
                validator: (value: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                },
                message: '请输入有效的邮箱地址'
            }
        ]
    }
];
```

## 示例

查看完整示例：`/pages/search-example`

## 注意事项

1. 确保项目中已安装并配置 PrimeVue
2. 组件依赖 Vue 3.0+ 和 TypeScript
3. 建议在使用前阅读 PrimeVue 相关组件文档
4. 搜索参数会自动进行防抖处理，避免频繁请求

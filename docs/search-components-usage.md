# 搜索组件使用文档

本文档详细介绍了项目中搜索相关组件的使用方法，包括 `ListSearch`、`FilterItem` 组件以及 `useSearch` 组合式函数。

## 目录

- [ListSearch 组件](#listsearch-组件)
- [FilterItem 组件](#filteritem-组件)
- [useSearch 组合式函数](#usesearch-组合式函数)
- [类型定义](#类型定义)
- [最佳实践](#最佳实践)

---

## ListSearch 组件

### 组件名称

`ListSearch` - 列表搜索组件

### 组件描述

提供完整的搜索功能，包括关键词搜索、高级筛选、表单验证等。支持多种筛选类型，具有响应式设计和动画效果。

### 基础使用示例

```vue
<template>
  <ListSearch
    v-model="searchParams"
    :filter-configs="filterConfigs"
    :loading="loading"
    placeholder="请输入搜索关键词"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SearchParams, FilterConfig } from '@/types/search';

const loading = ref(false);
const searchParams = ref<SearchParams>({
  keyword: '',
  filters: {},
  pagination: { page: 1, size: 20 }
});

const filterConfigs: FilterConfig[] = [
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
    key: 'createTime',
    label: '创建时间',
    type: 'dateRange',
    placeholder: '选择时间范围'
  }
];

const handleSearch = (params: SearchParams) => {
  console.log('搜索参数:', params);
  // 执行搜索逻辑
};

const handleReset = () => {
  console.log('重置搜索');
};
</script>
```

### 高级使用示例

```vue
<template>
  <ListSearch
    v-model="searchParams"
    :filter-configs="filterConfigs"
    :filter-columns="{ xs: 12, sm: 6, md: 4, lg: 3 }"
    :loading="loading"
    :auto-search="true"
    :debounce-delay="500"
    :show-validation-errors="true"
    placeholder="搜索用户、角色或权限"
    @search="handleSearch"
    @filter-change="handleFilterChange"
    @keyword-change="handleKeywordChange"
  >
    <template #actions>
      <Button label="导出" icon="pi pi-download" @click="handleExport" />
    </template>
  </ListSearch>
</template>

<script setup lang="ts">
const filterConfigs: FilterConfig[] = [
  {
    key: 'role',
    label: '角色',
    type: 'multiSelect',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '用户', value: 'user' },
      { label: '访客', value: 'guest' }
    ],
    required: true
  },
  {
    key: 'age',
    label: '年龄',
    type: 'number',
    placeholder: '请输入年龄',
    rules: [
      (value: number) => value >= 0 || '年龄不能为负数',
      (value: number) => value <= 120 || '年龄不能超过120岁'
    ]
  }
];
</script>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| modelValue | 搜索参数对象 | `SearchParams` | - | `{ keyword: '', filters: {}, pagination: { page: 1, size: 20 } }` |
| filterConfigs | 筛选配置数组 | `FilterConfig[]` | - | `[]` |
| placeholder | 搜索框占位符 | `string` | - | `'请输入搜索关键词'` |
| loading | 加载状态 | `boolean` | - | `false` |
| autoSearch | 是否自动搜索 | `boolean` | - | `false` |
| debounceDelay | 防抖延迟时间(ms) | `number` | - | `300` |
| immediate | 是否立即触发筛选 | `boolean` | - | `false` |
| showValidationErrors | 是否显示验证错误 | `boolean` | - | `false` |
| filterColumns | 筛选项列数配置 | `object` | - | `{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| search | 执行搜索时触发 | `(params: SearchParams)` |
| reset | 重置搜索时触发 | `()` |
| filter-change | 筛选条件变更时触发 | `(key: string, value: FilterValue)` |
| keyword-change | 关键词变更时触发 | `(keyword: string)` |
| update:modelValue | 搜索参数更新时触发 | `(params: SearchParams)` |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| actions | 自定义操作按钮 | - |

### Methods

通过 `ref` 可以调用以下方法：

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| search | 执行搜索 | - | `void` |
| reset | 重置搜索 | - | `void` |
| validate | 验证表单 | - | `boolean` |
| getSearchParams | 获取当前搜索参数 | - | `SearchParams` |
| setSearchParams | 设置搜索参数 | `(params: Partial<SearchParams>)` | `void` |
| toggleAdvanced | 切换高级筛选 | - | `void` |

---

## FilterItem 组件

### 组件名称

`FilterItem` - 筛选项组件

### 组件描述

单个筛选项组件，支持多种输入类型，包含验证功能。通常作为 `ListSearch` 组件的子组件使用。

### 使用示例

```vue
<template>
  <FilterItem
    :config="filterConfig"
    :value="filterValue"
    :show-error="true"
    @update="handleUpdate"
    @validate="handleValidate"
  />
</template>

<script setup lang="ts">
import type { FilterConfig, FilterValue } from '@/types/search';

const filterConfig: FilterConfig = {
  key: 'status',
  label: '状态',
  type: 'select',
  options: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ],
  required: true,
  tooltip: '选择数据状态'
};

const filterValue = ref('active');

const handleUpdate = (key: string, value: FilterValue) => {
  filterValue.value = value;
};

const handleValidate = (key: string, valid: boolean) => {
  console.log(`${key} 验证结果:`, valid);
};
</script>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| config | 筛选配置对象 | `FilterConfig` | - | - |
| value | 当前值 | `FilterValue` | - | - |
| showError | 是否显示错误 | `boolean` | - | `false` |
| immediate | 是否立即触发 | `boolean` | - | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update | 值更新时触发 | `(key: string, value: FilterValue)` |
| validate | 验证时触发 | `(key: string, valid: boolean)` |

### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| validate | 验证当前值 | - | `boolean` |
| clearError | 清除错误状态 | - | `void` |

---

## useSearch 组合式函数

### 函数名称

`useSearch` - 搜索组合式函数

### 函数描述

提供完整的搜索状态管理和操作方法，包括搜索参数管理、执行搜索、分页、排序等功能。

### 使用示例

```typescript
import { useSearch } from '@/composables/useSearch';
import type { SearchParams, SearchResult } from '@/types/search';

// 定义搜索函数
const searchUsers = async (params: SearchParams): Promise<SearchResult> => {
  const response = await api.get('/users', { params });
  return response.data;
};

// 使用搜索功能
const {
  searchParams,
  loading,
  total,
  data,
  error,
  handleSearch,
  resetSearch,
  updateKeyword,
  updateFilter,
  updatePagination
} = useSearch(searchUsers, {
  keyword: '',
  filters: { status: 'active' },
  pagination: { page: 1, size: 10 }
});

// 执行搜索
const search = async () => {
  try {
    await handleSearch();
    console.log('搜索结果:', data.value);
  } catch (err) {
    console.error('搜索失败:', err);
  }
};

// 更新筛选条件
const changeStatus = (status: string) => {
  updateFilter('status', status);
  handleSearch();
};

// 分页
const changePage = (page: number) => {
  updatePagination(page);
  handleSearch();
};
```

### 参数

| 参数 | 说明 | 类型 | 必填 |
|------|------|------|------|
| searchFn | 搜索函数 | `SearchFunction<T>` | 是 |
| initialParams | 初始搜索参数 | `Partial<SearchParams>` | 否 |

### 返回值

| 属性/方法 | 说明 | 类型 |
|-----------|------|------|
| searchParams | 搜索参数 | `Ref<SearchParams>` |
| loading | 加载状态 | `Ref<boolean>` |
| total | 总数 | `Ref<number>` |
| data | 数据列表 | `Ref<T[]>` |
| error | 错误信息 | `Ref<string \| null>` |
| handleSearch | 执行搜索 | `(params?: SearchParams) => Promise<SearchResult<T>>` |
| resetSearch | 重置搜索 | `() => void` |
| updateKeyword | 更新关键词 | `(keyword: string) => void` |
| updateFilter | 更新筛选条件 | `(key: string, value: any) => void` |
| updateFilters | 批量更新筛选条件 | `(filters: Record<string, any>) => void` |
| updatePagination | 更新分页 | `(page: number, size?: number) => void` |
| updateSort | 更新排序 | `(field: string, order: 'asc' \| 'desc') => void` |
| clearFilters | 清空筛选条件 | `() => void` |
| removeFilter | 移除单个筛选条件 | `(key: string) => void` |
| getSearchState | 获取当前搜索状态 | `() => SearchState` |

---

## 类型定义

### SearchParams

```typescript
interface SearchParams<T = Record<string, any>> {
  /** 关键词 */
  keyword: string;
  /** 筛选条件 */
  filters?: T;
  /** 分页信息 */
  pagination?: {
    page: number;
    size: number;
  };
  /** 排序信息 */
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  [key: string]: any;
}
```

### FilterConfig

```typescript
interface FilterConfig {
  /** 筛选字段key */
  key: string;
  /** 显示标签 */
  label: string;
  /** 筛选类型 */
  type: 'input' | 'select' | 'multiSelect' | 'date' | 'dateRange' | 'number';
  /** 选项列表（用于select和multiSelect） */
  options?: { label: string; value: any }[];
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 是否必填 */
  required?: boolean;
  /** 验证规则 */
  rules?: any[];
  /** 提示信息 */
  tooltip?: string;
}
```

### SearchResult

```typescript
interface SearchResult<T = any> {
  /** 数据列表 */
  data: T[];
  /** 总数 */
  total: number;
  /** 当前页 */
  page: number;
  /** 每页大小 */
  size: number;
}
```

### FilterValue

```typescript
type FilterValue = string | number | boolean | Date | any[] | null | undefined;
```

---

## 最佳实践

### 1. 搜索参数管理

```typescript
// 推荐：使用 useSearch 管理搜索状态
const { searchParams, handleSearch, updateFilter } = useSearch(searchFn);

// 避免：手动管理复杂的搜索状态
const searchParams = ref({ /* 复杂的状态管理 */ });
```

### 2. 筛选配置

```typescript
// 推荐：将筛选配置提取为常量
const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: STATUS_OPTIONS
  }
];

// 推荐：使用枚举定义选项
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

const STATUS_OPTIONS = [
  { label: '启用', value: UserStatus.ACTIVE },
  { label: '禁用', value: UserStatus.INACTIVE }
];
```

### 3. 表单验证

```typescript
// 推荐：使用验证规则
const filterConfig: FilterConfig = {
  key: 'email',
  label: '邮箱',
  type: 'input',
  required: true,
  rules: [
    (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || '请输入有效的邮箱地址';
    }
  ]
};
```

### 4. 性能优化

```typescript
// 推荐：使用防抖避免频繁搜索
const { debounce } = useDebounce();

const handleKeywordChange = debounce((keyword: string) => {
  updateKeyword(keyword);
  handleSearch();
}, 300);

// 推荐：使用 autoSearch 自动搜索
<ListSearch
  :auto-search="true"
  :debounce-delay="500"
/>
```

### 5. 错误处理

```typescript
// 推荐：统一错误处理
const handleSearch = async () => {
  try {
    await search();
  } catch (error) {
    console.error('搜索失败:', error);
    // 显示错误提示
    showError('搜索失败，请重试');
  }
};
```

### 6. 响应式设计

```vue
<!-- 推荐：配置响应式列数 -->
<ListSearch
  :filter-columns="{
    xs: 12,  // 手机端单列
    sm: 6,   // 平板端双列
    md: 4,   // 桌面端三列
    lg: 3,   // 大屏四列
    xl: 3    // 超大屏四列
  }"
/>
```

### 7. 组件组合

```vue
<template>
  <!-- 推荐：搜索 + 表格 + 分页的完整组合 -->
  <div class="page-container">
    <ListSearch
      v-model="searchParams"
      :filter-configs="filterConfigs"
      :loading="loading"
      @search="handleSearch"
    />
    
    <ConfigurableTable
      :data="data"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    />
  </div>
</template>
```

通过遵循这些最佳实践，可以构建出高效、可维护的搜索功能。